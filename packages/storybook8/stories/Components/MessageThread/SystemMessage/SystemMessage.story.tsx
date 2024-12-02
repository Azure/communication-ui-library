// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatMessage, FluentThemeProvider, MessageThread, SystemMessage } from '@azure/communication-react';
import React from 'react';
import { ArgsFrom } from '../../../controlsUtils';
import { GetHistoryChatMessages } from '../snippets/placeholdermessages';

const storyControls = {
  content: { control: 'text', name: 'System Content' },
  icons: { control: 'radio', options: ['PeopleAdd', 'PeopleBlock'], name: 'Icon' }
};

const MessageThreadWithSystemMessagesExample = (args: ArgsFrom<typeof storyControls>): JSX.Element => {
  const systemMessages = (): (SystemMessage | ChatMessage)[] => {
    return [
      ...GetHistoryChatMessages(),
      {
        messageType: 'system',
        createdOn: new Date('2020-04-13T00:00:00.000+07:01'),
        systemMessageType: 'content',
        messageId: Math.random().toString(),
        iconName: args.icons || 'PeopleAdd',
        content: args.content || 'Participant'
      }
    ];
  };

  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} messages={systemMessages()} />
    </FluentThemeProvider>
  );
};

export const MessageThreadWithSystemMessage = MessageThreadWithSystemMessagesExample.bind({});
