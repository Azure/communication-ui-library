import { FluentThemeProvider, MessageThread } from 'react-components';
import React from 'react';
import { GetHistoryWithSystemMessages } from './placeholdermessages';

export const MessageThreadWithSystemMessagesExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} messages={GetHistoryWithSystemMessages()} />
    </FluentThemeProvider>
  );
};
