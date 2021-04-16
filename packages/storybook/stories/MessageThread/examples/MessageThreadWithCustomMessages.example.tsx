import {
  ChatMessage,
  CustomMessage,
  DefaultMessageRendererType,
  FluentThemeProvider,
  MessageThread,
  SystemMessage
} from '@azure/communication-ui';
import { Divider } from '@fluentui/react-northstar';
import React from 'react';
import { GetHistoryWithCustomMessages } from './placeholdermessages';

export const MessageThreadWithCustomMessagesExample: () => JSX.Element = () => {
  // As an example, we want to use render custom message as a Divider.
  const onRenderMessage = (
    message: SystemMessage | CustomMessage | ChatMessage,
    defaultOnRender?: DefaultMessageRendererType
  ): JSX.Element => {
    if (message.type === 'custom') {
      return <Divider content={message.payload.content} color="brand" important />;
    } else {
      return defaultOnRender ? defaultOnRender(message) : <></>;
    }
  };

  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} messages={GetHistoryWithCustomMessages()} onRenderMessage={onRenderMessage} />
    </FluentThemeProvider>
  );
};
