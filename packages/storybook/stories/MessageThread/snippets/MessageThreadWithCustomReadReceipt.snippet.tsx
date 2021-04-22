import { FluentThemeProvider, MessageThread } from '@azure/communication-ui';
import { Text } from '@fluentui/react/lib/Text';
import React from 'react';
import { GetHistoryChatMessages } from './placeholdermessages';

export const MessageThreadWithCustomReadReceiptExample: () => JSX.Element = () => {
  // Show the read receipt of messages that I sent by setting 'disableReadReceipt' prop to be false and customized it
  return (
    <FluentThemeProvider>
      <MessageThread
        userId={'1'}
        messages={GetHistoryChatMessages()}
        disableReadReceipt={false}
        onRenderReadReceipt={(readReceiptProps) => {
          return readReceiptProps.messageStatus === 'seen' ? (
            <Text style={{ fontStyle: 'italic', fontWeight: 'bold', color: 'green' }}>seen</Text>
          ) : null;
        }}
      />
    </FluentThemeProvider>
  );
};
