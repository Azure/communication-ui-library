// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import { PartialTheme, Stack, Theme } from '@fluentui/react';
import { CallComposite, PollData, PollQuestionTile, PollResultTile } from '../CallComposite';
import { CallAdapterProvider } from '../CallComposite/adapter/CallAdapterProvider';
import { EmbeddedChatPane, EmbeddedPeoplePane } from './SidePane';
import { MeetingCallControlBar } from './MeetingCallControlBar';
import { CallState } from '@azure/communication-calling';
import { compositeOuterContainerStyles } from './styles/MeetingCompositeStyles';
import { FluentThemeProvider } from '@internal/react-components';
import { MeetingAdapter } from './adapter/MeetingAdapter';
import { MeetingBackedCallAdapter } from './adapter/MeetingBackedCallAdapter';
import { MeetingBackedChatAdapter } from './adapter/MeetingBackedChatAdapter';
import { MeetingCompositePage } from './state/MeetingCompositePage';
import { CallAdapter } from '../CallComposite';
import { ChatAdapter } from '../ChatComposite';
import { PollCreator, PollQuestion } from './PollCreator';
import { createFluidClient, initializeFluidContainer } from './FluidUtils';
import { CursorChatFluidModel, PollFluidModel } from './FluidModel';
/**
 * Props required for the {@link MeetingComposite}
 *
 * @alpha
 */
export type MeetingCompositeProps = {
  meetingAdapter: MeetingAdapter;
  /**
   * Fluent theme for the composite.
   *
   * Defaults to a light theme if undefined.
   */
  fluentTheme?: PartialTheme | Theme;
  /**
   * URL that can be used to copy a meeting invite to the Users clipboard.
   */
  meetingInvitationURL?: string;
  /**
   * Flags to enable/disable or customize UI elements of the {@link CallComposite}.
   */
  options?: MeetingCompositeOptions;
};

/**
 * Optional features of the {@link MeetingComposite}
 *
 * @alpha
 */
export type MeetingCompositeOptions = {
  /**
   * Choose to use the composite form optimized for use on a mobile device.
   * @remarks This is currently only optimized for Portrait mode on mobile devices and does not support landscape.
   * @defaultValue false
   * @alpha
   */
  mobileView?: boolean;
};

/**
 * Meeting Composite brings together key components to provide a full meeting experience out of the box.
 *
 * @alpha
 */
export const MeetingComposite = (props: MeetingCompositeProps): JSX.Element => {
  const { meetingAdapter, fluentTheme } = props;

  if (!meetingAdapter) {
    throw 'Meeting adapter is undefined';
  }

  const callAdapter: CallAdapter = useMemo(() => new MeetingBackedCallAdapter(meetingAdapter), [meetingAdapter]);
  const chatAdapter: ChatAdapter = useMemo(() => new MeetingBackedChatAdapter(meetingAdapter), [meetingAdapter]);

  const [currentMeetingState, setCurrentMeetingState] = useState<CallState>();
  const [currentPage, setCurrentPage] = useState<MeetingCompositePage>();
  meetingAdapter.onStateChange((newState) => {
    setCurrentPage(newState.page);
    setCurrentMeetingState(newState.meeting?.state);
  });
  const hasJoinedCall = currentPage === 'meeting' && currentMeetingState === 'Connected';

  const [showChat, setShowChat] = useState(false);
  const [showPeople, setShowPeople] = useState(false);
  const [showPollCreatorPane, setShowPollCreatorPane] = useState(false);

  const closePane = useCallback(() => {
    setShowChat(false);
    setShowPeople(false);
    setShowPollCreatorPane(false);
  }, []);

  const toggleChat = useCallback(() => {
    setShowPollCreatorPane(false);
    setShowPeople(false);
    setShowChat(!showChat);
  }, [showChat]);

  const togglePeople = useCallback(() => {
    setShowPollCreatorPane(false);
    setShowChat(false);
    setShowPeople(!showPeople);
  }, [showPeople]);

  const togglePollCreatorPane = useCallback(() => {
    setShowChat(false);
    setShowPeople(false);

    if (showPollCreatorPane) {
      //end poll
    }

    setShowPollCreatorPane(!showPollCreatorPane);
  }, [showPollCreatorPane]);

  const endCallClick = (): void => {
    meetingAdapter.setPage('configuration');
  };

  const pollFluidModel = useRef<PollFluidModel | undefined>(undefined);
  const [cursorChatFluidModel, setCursorChatFluidModel] = useState<CursorChatFluidModel | undefined>(undefined);
  const [pollData, setPollData] = useState<PollData | undefined>(undefined);
  useEffect(() => {
    (async () => {
      if (hasJoinedCall) {
        const client = createFluidClient();
        const container = await initializeFluidContainer(client, window.location.search);
        pollFluidModel.current = new PollFluidModel(container);
        pollFluidModel.current?.on('modelChanged', async () => {
          const newPollData = await pollFluidModel.current?.getPoll();
          console.log('[xkcd] Got a new Poll object', newPollData);
          setPollData(newPollData);
        });
        setCursorChatFluidModel(new CursorChatFluidModel(container, meetingAdapter?.getState().displayName ?? 'FNU'));
      }
    })();
  }, [hasJoinedCall, meetingAdapter]);

  const [pollAnswered, setPollAnswered] = useState(false);
  let focusTile: JSX.Element | undefined = undefined;
  if (pollData) {
    focusTile = !pollAnswered ? (
      <PollQuestionTile
        pollData={pollData}
        onSubmitAnswer={(chosenPollOption) => {
          const pollOptionindex = pollData.options.findIndex(
            (pollOption) => pollOption.option === chosenPollOption.option
          );
          pollFluidModel.current?.addVoteForOption(pollOptionindex);
          setPollAnswered(true);
        }}
      />
    ) : (
      <PollResultTile pollData={pollData} />
    );
  } else if (showPollCreatorPane && pollFluidModel.current) {
    focusTile = <PollCreatorTile fluidModel={pollFluidModel.current} />;
  }

  return (
    <FluentThemeProvider fluentTheme={props.fluentTheme}>
      <Stack verticalFill grow styles={compositeOuterContainerStyles}>
        <Stack horizontal grow>
          <Stack.Item grow>
            <CallComposite
              options={{ callControls: false, mobileView: props.options?.mobileView }}
              adapter={callAdapter}
              fluentTheme={fluentTheme}
              spotFocusTile={focusTile}
              fluidModel={cursorChatFluidModel}
            />
          </Stack.Item>
          {chatAdapter && hasJoinedCall && (
            <EmbeddedChatPane
              hidden={!showChat}
              chatAdapter={chatAdapter}
              fluentTheme={props.fluentTheme}
              onClose={closePane}
            />
          )}
          {callAdapter && chatAdapter && hasJoinedCall && (
            <CallAdapterProvider adapter={callAdapter}>
              <EmbeddedPeoplePane
                hidden={!showPeople}
                inviteLink={props.meetingInvitationURL}
                onClose={closePane}
                chatAdapter={chatAdapter}
                callAdapter={callAdapter}
              />
            </CallAdapterProvider>
          )}
        </Stack>
        {hasJoinedCall && (
          <MeetingCallControlBar
            callAdapter={callAdapter}
            chatButtonChecked={showChat}
            onChatButtonClicked={toggleChat}
            peopleButtonChecked={showPeople}
            testButtonChecked={showPollCreatorPane}
            onPeopleButtonClicked={togglePeople}
            onTestButtonClicked={togglePollCreatorPane}
            onEndCallClick={endCallClick}
            mobileView={props.options?.mobileView}
          />
        )}
      </Stack>
    </FluentThemeProvider>
  );
};

const PollCreatorTile = (props: { fluidModel: PollFluidModel }): JSX.Element => {
  const onPresentPoll = (question: PollQuestion): void => {
    console.log('Setting a new poll!', question);
    props.fluidModel.setPoll({
      prompt: question.prompt,
      options: question.choices.map((choice) => ({ option: choice, votes: 0 }))
    });
  };

  return <PollCreator onPresentPoll={onPresentPoll} />;
};
