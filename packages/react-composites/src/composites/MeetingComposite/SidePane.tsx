// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import { ChatComposite, ChatAdapter } from '../ChatComposite';
import { CommandBarButton, DefaultButton, PartialTheme, Theme, Stack } from '@fluentui/react';
import {
  sidePaneCloseButtonStyles,
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

const SidePane = (props: { headingText: string; children: React.ReactNode; onClose: () => void }): JSX.Element => {
  return (
    <Stack.Item disableShrink verticalFill styles={sidePaneContainerStyles} tokens={sidePaneContainerTokens}>
      <Stack verticalFill>
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

export const EmbeddedPeoplePane = (props: { inviteLink?: string; onClose: () => void }): JSX.Element => {
  const { inviteLink } = props;
  const participantListProps = usePropsFor(ParticipantList);
  return (
    <SidePane headingText={'People'} onClose={props.onClose}>
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
  onClose: () => void;
}): JSX.Element => {
  return (
    <SidePane headingText={'Chat'} onClose={props.onClose}>
      <ChatComposite adapter={props.chatAdapter} fluentTheme={props.fluentTheme} />
    </SidePane>
  );
};
