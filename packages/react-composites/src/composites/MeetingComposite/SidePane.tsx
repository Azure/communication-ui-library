// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
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

const SidePane = (props: {
  headingText: string;
  children: React.ReactNode;
  onClose: () => void;
  hidden: boolean;
}): JSX.Element => {
  // We hide the side pane instead of not rendering the entire pane to persist certain elements
  // between renders. An example of this is composing a chat message - a chat message that has been
  // typed but not sent should not be lost if the side panel is closed and then reopened.
  const sidePaneStyles = props.hidden ? sidePaneContainerHiddenStyles : sidePaneContainerStyles;
  return (
    <Stack styles={sidePaneStyles} tokens={sidePaneContainerTokens}>
      <Stack.Item>
        <Stack horizontal horizontalAlign="space-between" styles={sidePaneHeaderStyles}>
          <Stack.Item>{props.headingText}</Stack.Item>
          <CommandBarButton
            styles={sidePaneCloseButtonStyles}
            iconProps={{ iconName: 'cancel' }}
            onClick={props.onClose}
          />
        </Stack>
      </Stack.Item>
      <Stack grow styles={paneBodyContainer}>
        <Stack horizontal styles={scrollableContainer}>
          <Stack.Item verticalFill styles={scrollableContainerContents}>
            {props.children}
          </Stack.Item>
        </Stack>
      </Stack>
    </Stack>
  );
};

export const EmbeddedPeoplePane = (props: {
  inviteLink?: string;
  onClose: () => void;
  hidden: boolean;
}): JSX.Element => {
  const { inviteLink } = props;
  const participantListProps = usePropsFor(ParticipantList);
  return (
    <SidePane hidden={props.hidden} headingText={'People'} onClose={props.onClose}>
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

export const EmbeddedChatPane = (props: {
  chatAdapter: ChatAdapter;
  fluentTheme?: PartialTheme | Theme;
  hidden: boolean;
  onClose: () => void;
}): JSX.Element => {
  return (
    <SidePane hidden={props.hidden} headingText={'Chat'} onClose={props.onClose}>
      <ChatComposite adapter={props.chatAdapter} fluentTheme={props.fluentTheme} />
    </SidePane>
  );
};
