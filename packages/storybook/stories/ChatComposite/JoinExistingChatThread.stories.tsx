// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { getDocs } from './ChatCompositeDocs';
import { ContosoChatContainer } from './snippets/Container.snippet';
import { ConfigJoinChatThreadHintBanner } from './snippets/Utils';

const JoinExistingChatThreadStory = (args): JSX.Element => {
  const areAllControlsSet =
    !!args.endpointUrl && !!args.threadId && !!args.userId && !!args.token && !!args.displayName;

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {areAllControlsSet ? (
        <ContosoChatContainer
          endpointUrl={args.endpointUrl}
          threadId={args.threadId}
          userId={{ communicationUserId: args.userId }}
          token={args.token}
          displayName={args.displayName}
          showParticipants={true}
          showTopic={true}
        />
      ) : (
        <ConfigJoinChatThreadHintBanner />
      )}
    </Stack>
  );
};

export const JoinExistingChatThread = JoinExistingChatThreadStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-chat-joinexistingchatthread`,
  title: `${COMPOSITE_FOLDER_PREFIX}/ChatComposite/Join Existing Chat Thread`,
  component: ChatComposite,
  argTypes: {
    endpointUrl: { control: 'text', defaultValue: '', name: 'Azure Communication Services endpoint URL' },
    threadId: { control: 'text', defaultValue: '', name: 'Existing thread' },
    userId: { control: 'text', defaultValue: '', name: 'User identifier for user' },
    token: { control: 'text', defaultValue: '', name: 'Valid token for user' },
    displayName: { control: 'text', defaultValue: '', name: 'Display Name' },
    // Hiding auto-generated controls
    adapter: { control: false, table: { disable: true } },
    fluentTheme: { control: false, table: { disable: true } },
    onRenderAvatar: { control: false, table: { disable: true } },
    onRenderMessage: { control: false, table: { disable: true } },
    onRenderTypingIndicator: { control: false, table: { disable: true } },
    options: { control: false, table: { disable: true } },
    identifiers: { control: false, table: { disable: true } },
    locale: { control: false, table: { disable: true } }
  },
  parameters: {
    useMaxHeightParent: true,
    useMaxWidthParent: true,
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
