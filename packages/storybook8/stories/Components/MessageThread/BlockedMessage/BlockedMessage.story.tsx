// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { FluentThemeProvider, MessageThread, Message } from '@azure/communication-react';
import React from 'react';
import { GetHistoryWithSystemMessages } from './../snippets/placeholdermessages';

const BlockedMessageStory = (args: { displayName: string; link: string }): JSX.Element => {
  const messages: Message[] = [
    ...GetHistoryWithSystemMessages(),
    {
      messageType: 'blocked',
      link: args.link ? args.link : 'https://go.microsoft.com/fwlink/?LinkId=2132837',
      senderId: 'user2',
      senderDisplayName: args.displayName ? args.displayName : 'Robert Tolbert',
      messageId: Math.random().toString(),
      createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false
    }
  ];

  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} messages={messages} />
    </FluentThemeProvider>
  );
};

export const MessageThreadWithBlockedMessage = BlockedMessageStory.bind({});
