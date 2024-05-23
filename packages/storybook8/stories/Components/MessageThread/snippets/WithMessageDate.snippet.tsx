import { FluentThemeProvider, MessageThread } from '@azure/communication-react';
import React from 'react';
import { GetHistoryChatMessages } from './placeholdermessages';

export const MessageThreadWithMessageDateExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} showMessageDate={true} messages={GetHistoryChatMessages()} />
    </FluentThemeProvider>
  );
};
