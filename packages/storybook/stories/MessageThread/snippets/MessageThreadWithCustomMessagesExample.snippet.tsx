import { DefaultMessageRendererType, FluentThemeProvider, MessageProps, MessageThread } from '@azure/communication-ui';
import { Divider } from '@fluentui/react-northstar';
import React from 'react';
import { GetHistoryWithCustomMessages } from './placeholdermessages';

export const MessageThreadWithCustomMessagesExample: () => JSX.Element = () => {
  // As an example, we want to use render custom message as a Divider.
  const onRenderMessage = (props: MessageProps, defaultOnRender?: DefaultMessageRendererType): JSX.Element => {
    if (props.message.type === 'custom') {
      return <Divider content={props.message.payload.content} color="brand" important />;
    }

    return defaultOnRender ? defaultOnRender(props) : <></>;
  };

  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} messages={GetHistoryWithCustomMessages()} onRenderMessage={onRenderMessage} />
    </FluentThemeProvider>
  );
};
