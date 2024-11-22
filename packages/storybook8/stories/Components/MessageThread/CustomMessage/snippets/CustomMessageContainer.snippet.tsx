import { MessageRenderer, FluentThemeProvider, MessageProps, MessageThread } from '@azure/communication-react';
import { Divider } from '@fluentui/react-components';
import React from 'react';
import { GetHistoryWithCustomMessages } from '../../snippets/placeholdermessages';

export const MessageThreadWithCustomMessagesExample: () => JSX.Element = () => {
  // As an example, we want to use render custom message as a Divider.
  const onRenderMessage = (messageProps: MessageProps, defaultOnRender?: MessageRenderer): JSX.Element => {
    if (messageProps.message.messageType === 'custom') {
      return <Divider appearance="brand">{messageProps.message.content}</Divider>;
    }

    return defaultOnRender ? defaultOnRender(messageProps) : <></>;
  };

  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} messages={GetHistoryWithCustomMessages()} onRenderMessage={onRenderMessage} />
    </FluentThemeProvider>
  );
};
