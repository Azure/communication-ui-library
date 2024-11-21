import { FluentThemeProvider, MessageThread } from '@azure/communication-react';
import { Text } from '@fluentui/react';
import React from 'react';
import { GetHistoryChatMessages } from '../../snippets/placeholdermessages';

export const MessageThreadWithCustomMessageStatusIndicatorExample: () => JSX.Element = () => {
  // Show the status of messages that I sent by setting 'showMessageStatus' prop to be true and customized it
  return (
    <FluentThemeProvider>
      <MessageThread
        userId={'1'}
        messages={GetHistoryChatMessages()}
        showMessageStatus={true}
        onRenderMessageStatus={(messageStatusIndicatorProps) => {
          return messageStatusIndicatorProps.status === 'seen' ? (
            <Text style={{ fontStyle: 'italic', fontWeight: 'bold', color: 'green' }}>seen</Text>
          ) : null;
        }}
      />
    </FluentThemeProvider>
  );
};
