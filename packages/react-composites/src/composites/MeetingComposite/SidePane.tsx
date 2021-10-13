// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { ChatComposite, ChatAdapter } from '../ChatComposite';
import { CommandBarButton, DefaultButton, PartialTheme, Theme, Stack } from '@fluentui/react';
import {
  sidePaneCloseButtonStyles,
  sidePaneContainerHiddenStyles,
  sidePaneContainerStyles,
  sidePaneContainerTokens,
  sidePaneHeaderStyles,
  peoplePaneContainerTokens,
  peopleSubheadingStyle,
  paneBodyContainer,
  scrollableContainer,
  scrollableContainerContents
} from './styles/SidePane.styles';
import { ParticipantList } from '@internal/react-components';
import copy from 'copy-to-clipboard';
import { usePropsFor } from '../CallComposite/hooks/usePropsFor';
import { CallAdapter } from '../CallComposite';
import { FluidComponent } from './FluidComponent';
import { PollCreator, PollQuestion } from './PollCreator';

const SidePane = (props: {
  headingText: string;
  children: React.ReactNode;
  onClose: () => void;
  hidden: boolean;
  dataUiId: string;
}): JSX.Element => {
  // We hide the side pane instead of not rendering the entire pane to persist certain elements
  // between renders. An example of this is composing a chat message - a chat message that has been
  // typed but not sent should not be lost if the side panel is closed and then reopened.
  const sidePaneStyles = props.hidden ? sidePaneContainerHiddenStyles : sidePaneContainerStyles;
  return (
    <Stack.Item disableShrink verticalFill styles={sidePaneStyles} tokens={sidePaneContainerTokens}>
      <Stack verticalFill data-ui-id={props.dataUiId}>
        <Stack horizontal horizontalAlign="space-between" styles={sidePaneHeaderStyles}>
          <Stack.Item>{props.headingText}</Stack.Item>
          <CommandBarButton
            styles={sidePaneCloseButtonStyles}
            iconProps={{ iconName: 'cancel' }}
            onClick={props.onClose}
          />
        </Stack>
        <Stack.Item verticalFill grow styles={paneBodyContainer}>
          <Stack horizontal styles={scrollableContainer}>
            <Stack.Item verticalFill styles={scrollableContainerContents}>
              {props.children}
            </Stack.Item>
          </Stack>
        </Stack.Item>
      </Stack>
    </Stack.Item>
  );
};

/**
 * In a Meeting when a participant is removed, we must remove them from both
 * the call and the chat thread.
 */
const removeParticipantFromMeeting = async (
  callAdapter: CallAdapter,
  chatAdapter: ChatAdapter,
  participantId: string
): Promise<void> => {
  await callAdapter.removeParticipant(participantId);
  await chatAdapter.removeParticipant(participantId);
};

/**
 * @private
 */
export const EmbeddedPeoplePane = (props: {
  inviteLink?: string;
  onClose: () => void;
  hidden: boolean;
  callAdapter: CallAdapter;
  chatAdapter: ChatAdapter;
}): JSX.Element => {
  const { callAdapter, chatAdapter, inviteLink } = props;
  const participantListDefaultProps = usePropsFor(ParticipantList);

  const participantListProps = useMemo(() => {
    const onParticipantRemove = async (participantId: string): Promise<void> =>
      removeParticipantFromMeeting(callAdapter, chatAdapter, participantId);
    return {
      ...participantListDefaultProps,
      onParticipantRemove
    };
  }, [participantListDefaultProps, callAdapter, chatAdapter]);

  return (
    <SidePane
      hidden={props.hidden}
      headingText={'People'}
      onClose={props.onClose}
      dataUiId={'meeting-composite-people-pane'}
    >
      <Stack tokens={peoplePaneContainerTokens}>
        {inviteLink && (
          <DefaultButton text="Copy invite link" iconProps={{ iconName: 'Link' }} onClick={() => copy(inviteLink)} />
        )}
        <Stack.Item styles={peopleSubheadingStyle}>In this call</Stack.Item>
        <ParticipantList {...participantListProps} />
      </Stack>
    </SidePane>
  );
};

/**
 * @private
 */
export const EmbeddedChatPane = (props: {
  chatAdapter: ChatAdapter;
  fluentTheme?: PartialTheme | Theme;
  hidden: boolean;
  onClose: () => void;
}): JSX.Element => {
  return (
    <SidePane
      hidden={props.hidden}
      headingText={'Chat'}
      onClose={props.onClose}
      dataUiId={'meeting-composite-chat-pane'}
    >
      <ChatComposite
        adapter={props.chatAdapter}
        fluentTheme={props.fluentTheme}
        options={{ participantPane: false, topic: false }}
      />
    </SidePane>
  );
};

/**
 * @private
 */
export const EmbeddedTestPane = (props: {
  fluentTheme?: PartialTheme | Theme;
  hidden: boolean;
  onClose: () => void;
}): JSX.Element => {
  return (
    <SidePane
      hidden={props.hidden}
      headingText={'Test Pane'}
      onClose={props.onClose}
      dataUiId={'meeting-composite-test-pane'}
    >
      <FluidComponent />
    </SidePane>
  );
};

/**
 * @private
 */
export const EmbeddedPollCreatorPane = (props: {
  fluentTheme?: PartialTheme | Theme;
  hidden: boolean;
  onClose: () => void;
}): JSX.Element => {
  return (
    <SidePane
      hidden={props.hidden}
      headingText={'Create live poll'}
      onClose={props.onClose}
      dataUiId={'meeting-composite-poll-creator-pane'}
    >
      <PollCreator
        onPresentPoll={(question: PollQuestion) => {
          // TODO: Connect with fluid!
          console.log('Egad! A new poll question is come!', question);
        }}
      />
    </SidePane>
  );
};
