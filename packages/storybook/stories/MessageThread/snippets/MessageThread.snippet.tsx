import { FluentThemeProvider, MessageThread } from '@azure/react-components';
import React from 'react';
import { GetHistoryChatMessages } from './placeholdermessages';

export const DefaultMessageThreadExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} messages={GetHistoryChatMessages()} />
    </FluentThemeProvider>
  );
};
