import { FluentThemeProvider, MessageThread } from '@azure/react-components';
import React from 'react';
import { GetHistoryWithSystemMessages } from './placeholdermessages';

export const MessageThreadWithSystemMessagesExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} messages={GetHistoryWithSystemMessages()} />
    </FluentThemeProvider>
  );
};
