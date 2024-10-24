import { FluentThemeProvider, MessageThread, Message } from '@azure/communication-react';
import React from 'react';
import { GetHistoryWithSystemMessages } from './placeholdermessages';

export const MessageThreadWithBlockedMessagesExample: () => JSX.Element = () => {
  const messages: Message[] = [
    ...GetHistoryWithSystemMessages(),
    {
      messageType: 'blocked',
      link: 'https://go.microsoft.com/fwlink/?LinkId=2132837',
      senderId: 'user2',
      senderDisplayName: 'Robert Tolbert',
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
