// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback, useState, useMemo } from 'react';
import { PartialTheme, Stack, Theme } from '@fluentui/react';
import { CallComposite, CallControlOptions } from '../CallComposite';
import { CallAdapterProvider } from '../CallComposite/adapter/CallAdapterProvider';
import { EmbeddedChatPane, EmbeddedPeoplePane } from './SidePane';
import { MeetingCallControlBar } from './MeetingCallControlBar';
import { CallState } from '@azure/communication-calling';
import { compositeOuterContainerStyles } from './styles/MeetingCompositeStyles';
import { MeetingAdapter } from './adapter/MeetingAdapter';
import { MeetingBackedCallAdapter } from './adapter/MeetingBackedCallAdapter';
import { MeetingBackedChatAdapter } from './adapter/MeetingBackedChatAdapter';
import { hasJoinedCall as hasJoinedCallFn, MeetingCompositePage } from './state/MeetingCompositePage';
import { CallAdapter } from '../CallComposite';
import { ChatAdapter } from '../ChatComposite';
import { BaseComposite, BaseCompositeProps } from '../common/BaseComposite';
import { CallCompositeIcons, ChatCompositeIcons } from '../common/icons';

/**
 * Props required for the {@link MeetingComposite}
 *
 * @beta
 */
export interface MeetingCompositeProps extends BaseCompositeProps<CallCompositeIcons & ChatCompositeIcons> {
  meetingAdapter: MeetingAdapter;
  /**
   * Fluent theme for the composite.
   *
   * Defaults to a light theme if undefined.
   */
  fluentTheme?: PartialTheme | Theme;
  /**
   * Optimizes the composite form factor for either desktop or mobile.
   * @remarks `mobile` is currently only optimized for Portrait mode on mobile devices and does not support landscape.
   * @defaultValue 'desktop'
   * @beta
   */
  formFactor?: 'desktop' | 'mobile';
  /**
   * URL that can be used to copy a meeting invite to the Users clipboard.
   */
  meetingInvitationURL?: string;
  /**
   * Call control options to change what buttons show on the meeting composite control bar.
   * If using the boolean values, true will cause default behavior across the whole control bar. False hides the whole control bar.
   */
  meetingCallControlOptions?: boolean | MeetingCallControlOptions;
}

/**
 * Meeting Call controls to show or hide buttons on the calling control bar.
 *
 * @beta
 */
export interface MeetingCallControlOptions
  extends Pick<
    CallControlOptions,
    'cameraButton' | 'microphoneButton' | 'screenShareButton' | 'devicesButton' | 'displayType'
  > {
  /**
   * Show or hide the chat button in the meeting control bar.
   * @defaultValue true
   */
  chatButton?: boolean;
  /**
   * Show or hide the people button in the meeting control bar.
   * @defaultValue true
   */
  peopleButton?: boolean;
}

export interface MeetingScreenProps extends MeetingCompositeProps {
  meetingAdapter: MeetingAdapter;
  fluentTheme?: PartialTheme | Theme;
  formFactor?: 'desktop' | 'mobile';
  meetingInvitationURL?: string;
  meetingCallControlOptions?: boolean | MeetingCallControlOptions;
}

export const MeetingScreen = (props: MeetingScreenProps): JSX.Element => {
  const { meetingAdapter, fluentTheme, formFactor = 'desktop' } = props;
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

  const [showChat, setShowChat] = useState(false);
  const [showPeople, setShowPeople] = useState(false);

  const closePane = useCallback(() => {
    setShowChat(false);
    setShowPeople(false);
  }, []);

  const toggleChat = useCallback(() => {
    setShowPeople(false);
    setShowChat(!showChat);
  }, [showChat]);

  const togglePeople = useCallback(() => {
    setShowChat(false);
    setShowPeople(!showPeople);
  }, [showPeople]);

  const isInLobbyOrConnecting = currentPage === 'lobby';
  const hasJoinedCall = !!(currentPage && hasJoinedCallFn(currentPage, currentMeetingState ?? 'None'));

  return (
    <Stack verticalFill grow styles={compositeOuterContainerStyles}>
      <Stack horizontal grow>
        <Stack.Item grow>
          <CallComposite
            {...props}
            formFactor={formFactor}
            options={{ callControls: false }}
            adapter={callAdapter}
            fluentTheme={fluentTheme}
          />
        </Stack.Item>
        {chatAdapter && hasJoinedCall && (
          <EmbeddedChatPane
            chatCompositeProps={props}
            hidden={!showChat}
            chatAdapter={chatAdapter}
            fluentTheme={fluentTheme}
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
      {(isInLobbyOrConnecting || hasJoinedCall) && (
        <MeetingCallControlBar
          callAdapter={callAdapter}
          chatButtonChecked={showChat}
          onChatButtonClicked={toggleChat}
          peopleButtonChecked={showPeople}
          onPeopleButtonClicked={togglePeople}
          mobileView={props.formFactor === 'mobile'}
          disableButtonsForLobbyPage={isInLobbyOrConnecting}
          meetingCallControlOptions={props.meetingCallControlOptions}
        />
      )}
    </Stack>
  );
};

/**
 * Meeting Composite brings together key components to provide a full meeting experience out of the box.
 *
 * @beta
 */
export const MeetingComposite = (props: MeetingCompositeProps): JSX.Element => {
  return (
    <BaseComposite fluentTheme={props.fluentTheme} locale={props.locale}>
      <MeetingScreen
        meetingAdapter={props.meetingAdapter}
        formFactor={props.formFactor}
        meetingCallControlOptions={props.meetingCallControlOptions}
        meetingInvitationURL={props.meetingInvitationURL}
      ></MeetingScreen>
    </BaseComposite>
  );
};
