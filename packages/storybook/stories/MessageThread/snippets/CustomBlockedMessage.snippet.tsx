import {
  FluentThemeProvider,
  MessageThread,
  MessageProps,
  MessageThreadStyles,
  MessageRenderer,
  BlockedMessage
} from '@azure/communication-react';
import { Divider } from '@fluentui/react-northstar';
import React from 'react';

export const MessageThreadWithCustoBlockedmMessageContainerExample: () => JSX.Element = () => {
  const messageThreadStyle: MessageThreadStyles = {
    blockedMessageContainer: { '& p': { color: 'blue' }, '& svg': { color: 'red' }, border: 'double green' }
  };

  const onRenderMessage = (messageProps: MessageProps, defaultOnRender?: MessageRenderer): JSX.Element => {
    if (messageProps.message.messageType === 'custom') {
      return <Divider content={messageProps.message.content} color="brand" important />;
    } else if (messageProps.message.messageType === 'blocked' && messageProps.message.senderId === 'user3') {
      return <h3>{`${messageProps.message.senderDisplayName} message has been blocked (custom renderer)`}</h3>;
    }
    return defaultOnRender ? defaultOnRender(messageProps) : <></>;
  };

  const messages: BlockedMessage[] = [
    {
      messageType: 'blocked',
      link: 'https://go.microsoft.com/fwlink/?LinkId=2132837',
      senderId: 'user2',
      senderDisplayName: 'Robert Tolbert',
      messageId: Math.random().toString(),
      createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false,
      contentType: 'text'
    },
    {
      messageType: 'blocked',
      senderId: 'user2',
      content: 'This is custom blocked content, with different icon and without link',
      senderDisplayName: 'Robert Tolbert',
      messageId: Math.random().toString(),
      createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false,
      contentType: 'text'
    },
    {
      messageType: 'blocked',
      senderId: 'user2',
      content: false,
      linkText: 'This is custom blocked content, link only (microsoft.com)',
      link: 'https://microsoft.com',
      senderDisplayName: 'Robert Tolbert',
      messageId: Math.random().toString(),
      createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false,
      contentType: 'text'
    },
    {
      messageType: 'blocked',
      senderId: 'user3',
      senderDisplayName: 'Carole Poland',
      messageId: Math.random().toString(),
      createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false,
      contentType: 'text'
    }
  ];

  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} styles={messageThreadStyle} messages={messages} onRenderMessage={onRenderMessage} />
    </FluentThemeProvider>
  );
};
