import { ChatMessage, FluentThemeProvider, MessageStatus, MessageThread } from '@azure/communication-react';
import React, { useState } from 'react';
import { GetHistoryChatMessages } from './placeholdermessages';

export const DefaultMessageThreadExample: () => JSX.Element = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(GetHistoryChatMessages());

  return (
    <FluentThemeProvider>
      <MessageThread
        userId={'1'}
        messages={messages}
        onUpdateMessage={async (id, content, metadata) => {
          const updated = messages.map((m) =>
            m.messageId === id
              ? { ...m, metadata, failureReason: 'Failed to edit', status: 'failed' as MessageStatus }
              : m
          );
          setMessages(updated);
          return Promise.reject('Failed to update');
        }}
        onCancelMessageEdit={(id, metadata, options) => {
          console.log('cancel edit');
          const updated = messages.map((m) =>
            m.messageId === id ? { ...m, metadata, failureReason: undefined, status: undefined } : m
          );
          setMessages(updated);
        }}
      />
    </FluentThemeProvider>
  );
};
