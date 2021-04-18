import { FluentThemeProvider, MessageThread } from '@azure/communication-ui';
import React from 'react';
import { GetHistoryChatMessages } from './placeholdermessages';

export const MessageThreadWithReadReceiptExample: () => JSX.Element = () => {
  // Show the read receipt of messages that I sent by setting 'disableReadReceipt' prop to be false.
  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} messages={GetHistoryChatMessages()} disableReadReceipt={false} />
    </FluentThemeProvider>
  );
};
