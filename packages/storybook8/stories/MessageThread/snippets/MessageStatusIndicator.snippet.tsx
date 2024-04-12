import { FluentThemeProvider, MessageThread } from '@azure/communication-react';
import React from 'react';
import { GetHistoryChatMessages } from './placeholdermessages';

export const MessageThreadWithMessageStatusIndicatorExample: () => JSX.Element = () => {
  // Show the status of messages that I sent by setting 'showMessageStatus' prop to be true.
  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} messages={GetHistoryChatMessages()} showMessageStatus={true} />
    </FluentThemeProvider>
  );
};
