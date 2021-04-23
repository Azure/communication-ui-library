import { DefaultMessageRendererType, FluentThemeProvider, MessageProps, MessageThread } from '@azure/communication-ui';
import { Divider } from '@fluentui/react-northstar';
import React from 'react';
import { GetHistoryWithCustomMessages } from './placeholdermessages';

export const MessageThreadWithCustomMessagesExample: () => JSX.Element = () => {
  // As an example, we want to use render custom message as a Divider.
  const onRenderMessage = (messageProps: MessageProps, defaultOnRender?: DefaultMessageRendererType): JSX.Element => {
    if (messageProps.message.type === 'custom') {
      return <Divider content={messageProps.message.payload.content} color="brand" important />;
    }

    return defaultOnRender ? defaultOnRender(messageProps) : <></>;
  };

  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} messages={GetHistoryWithCustomMessages()} onRenderMessage={onRenderMessage} />
    </FluentThemeProvider>
  );
};
