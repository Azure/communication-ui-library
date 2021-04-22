import { FluentThemeProvider, MessageThread } from '@azure/communication-ui';
import React from 'react';
import { GetHistoryChatMessages } from './placeholdermessages';

export const MessageThreadWithCustomChatContainerExample: () => JSX.Element = () => {
  // Show a customized Chat container.
  return (
    <FluentThemeProvider>
      <MessageThread
        userId={'1'}
        messages={GetHistoryChatMessages()}
        styles={{ chatContainer: { backgroundColor: 'lightgray', padding: '15px' } }}
      />
    </FluentThemeProvider>
  );
};
