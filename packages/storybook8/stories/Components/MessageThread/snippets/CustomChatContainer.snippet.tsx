import { FluentThemeProvider, MessageThread } from '@azure/communication-react';
import React from 'react';
import { GetHistoryChatMessages } from './placeholdermessages';

export const MessageThreadWithCustomChatContainerExample: () => JSX.Element = () => {
  const messageThreadStyles = {
    chatContainer: {
      backgroundColor: 'lightgray',
      padding: '15px'
    }
  };

  // Show a customized Chat container.
  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} messages={GetHistoryChatMessages()} styles={messageThreadStyles} />
    </FluentThemeProvider>
  );
};
