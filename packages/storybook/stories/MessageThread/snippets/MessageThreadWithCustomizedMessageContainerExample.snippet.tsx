import {
  ChatMessage,
  CustomMessage,
  DefaultMessageRendererType,
  FluentThemeProvider,
  MessageThread,
  SystemMessage
} from '@azure/communication-ui';
import { ComponentSlotStyle } from '@fluentui/react-northstar';
import React from 'react';
import { GetHistoryChatMessages } from './placeholdermessages';

export const MessageThreadWithCustomizedMessageContainerExample: () => JSX.Element = () => {
  // Show a customized Chat container.
  const onRenderMessage = (
    message: SystemMessage | CustomMessage | ChatMessage,
    defaultOnRender: DefaultMessageRendererType
  ): JSX.Element => {
    const containerStyle: ComponentSlotStyle = {
      fontStyle: 'italic',
      boxShadow: '0px 3.2px 7.2px rgb(0 0 0 / 13%), 0px 0.6px 1.8px rgb(0 0 0 / 11%)'
    };

    if (message.type === 'chat' && message.payload.mine) {
      return defaultOnRender(message, containerStyle);
    }

    return defaultOnRender(message);
  };

  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} messages={GetHistoryChatMessages()} onRenderMessage={onRenderMessage} />
    </FluentThemeProvider>
  );
};
