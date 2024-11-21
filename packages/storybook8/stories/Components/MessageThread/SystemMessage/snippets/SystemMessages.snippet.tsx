import { ChatMessage, FluentThemeProvider, MessageThread, SystemMessage } from '@azure/communication-react';
import React from 'react';
import { GetHistoryChatMessages } from '../../snippets/placeholdermessages';

export const MessageThreadWithSystemMessagesExample: () => JSX.Element = () => {
  const systemMessages = (): (SystemMessage | ChatMessage)[] => {
    return [
      ...GetHistoryChatMessages(),
      {
        messageType: 'system',
        createdOn: new Date('2020-04-13T00:00:00.000+07:01'),
        systemMessageType: 'content',
        messageId: Math.random().toString(),
        iconName: 'PeopleAdd',
        content: 'Miguel Garcia is added to the chat'
      }
    ];
  };

  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} messages={systemMessages()} />
    </FluentThemeProvider>
  );
};
