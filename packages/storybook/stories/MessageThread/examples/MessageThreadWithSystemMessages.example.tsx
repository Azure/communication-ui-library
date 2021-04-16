import { FluentThemeProvider, MessageThread } from '@azure/communication-ui';
import React from 'react';
import { GetHistoryWithSystemMessages } from './placeholdermessages';

export const MessageThreadWithSystemMessagesExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} messages={GetHistoryWithSystemMessages()} />
    </FluentThemeProvider>
  );
};
