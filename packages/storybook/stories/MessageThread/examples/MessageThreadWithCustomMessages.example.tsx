import { FluentThemeProvider, Message, MessageThread } from '@azure/communication-ui';
import { Divider } from '@fluentui/react-northstar';
import React from 'react';
import { GetHistoryWithCustomMessages } from './constants';

export const MessageThreadWithCustomMessagesExample: () => JSX.Element = () => {
  // As an example, we want to use render custom message as a Divider.
  const onRenderCustomMessage = (message: Message<'custom'>): JSX.Element => {
    return <Divider content={message.payload.content} color="brand" important />;
  };

  return (
    <FluentThemeProvider>
      <MessageThread
        userId={'1'}
        messages={GetHistoryWithCustomMessages()}
        onRenderCustomMessage={onRenderCustomMessage}
      />
    </FluentThemeProvider>
  );
};
