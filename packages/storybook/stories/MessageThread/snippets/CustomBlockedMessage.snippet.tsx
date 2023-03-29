import {
  FluentThemeProvider,
  MessageThread,
  MessageProps,
  MessageThreadStyles,
  MessageRenderer,
  BlockedMessage
} from '@azure/communication-react';
import React from 'react';

export const MessageThreadWithCustoBlockedmMessageContainerExample: () => JSX.Element = () => {
  const messageThreadStyle: MessageThreadStyles = {
    blockedMessageContainer: { '& p': { color: 'red' }, '& svg': { color: 'red' }, border: 'double green' }
  };

  const onRenderMessage = (messageProps: MessageProps, defaultOnRender?: MessageRenderer): JSX.Element => {
    // Add your own logic
    if (messageProps.message.messageType === 'blocked' && messageProps.message.senderId === 'user3') {
      return (
        <h3>{`Message from ${messageProps.message.senderDisplayName} has been blocked (with custom onRenderMessage)`}</h3>
      );
    }
    return defaultOnRender ? defaultOnRender(messageProps) : <></>;
  };

  const messages: BlockedMessage[] = [
    {
      messageType: 'blocked',
      senderId: 'user2',
      warningText: 'This is custom blocked message without hyperlink',
      senderDisplayName: 'Robert Tolbert',
      messageId: Math.random().toString(),
      createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false
    },
    {
      messageType: 'blocked',
      senderId: 'user2',
      warningText: false,
      linkText: 'This is custom blocked content with hyperlink only (microsoft.com)',
      link: 'https://microsoft.com',
      senderDisplayName: 'Robert Tolbert',
      messageId: Math.random().toString(),
      createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
      mine: false,
      attached: true
    },
    {
      messageType: 'blocked',
      senderId: 'user3',
      senderDisplayName: 'Carole Poland',
      messageId: Math.random().toString(),
      createdOn: new Date('2019-04-13T00:00:00.000+08:11'),
      mine: false,
      attached: false
    }
  ];

  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} styles={messageThreadStyle} messages={messages} onRenderMessage={onRenderMessage} />
    </FluentThemeProvider>
  );
};
