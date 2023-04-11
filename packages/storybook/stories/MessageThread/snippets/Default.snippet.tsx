import { FluentThemeProvider, MessageThread } from '@azure/communication-react';
import React from 'react';
import { GetHistoryChatMessages } from './placeholdermessages';

export const DefaultMessageThreadExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} messages={GetHistoryChatMessages()} />
    </FluentThemeProvider>
  );
};
