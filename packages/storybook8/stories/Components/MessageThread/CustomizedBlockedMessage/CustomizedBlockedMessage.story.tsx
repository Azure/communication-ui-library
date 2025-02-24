// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  FluentThemeProvider,
  MessageThread,
  MessageProps,
  MessageThreadStyles,
  MessageRenderer,
  BlockedMessage
} from '@azure/communication-react';
import React from 'react';
import { ArgsFrom } from '../../../controlsUtils';

const storyControls = {
  textColor: { control: 'text', name: 'Text Color' },
  border: { control: 'text', name: 'Border' },
  warningMessage: { control: 'text', name: 'Warning Message' },
  overrideDefaultMessage: { control: 'text', name: 'Override Default Message' }
};

const CustomizedBlockedMessageStory = (args: ArgsFrom<typeof storyControls>): JSX.Element => {
  const messageThreadStyle: MessageThreadStyles = {
    blockedMessageContainer: {
      '& i': { paddingTop: '0.25rem' },
      '& p': { color: args.textColor, marginBlock: '0.125rem' },
      '& a': { marginBlock: '0.125rem' },
      '& svg': { color: args.textColor },
      border: args.border
    }
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
      warningText: args.warningMessage,
      senderDisplayName: 'Robert Tolbert',
      messageId: Math.random().toString(),
      createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false
    },
    {
      messageType: 'blocked',
      senderId: 'user2',
      warningText: '',
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
    },
    {
      messageType: 'blocked',
      senderId: 'user1',
      senderDisplayName: 'Elliot Woodward',
      warningText: args.overrideDefaultMessage,
      messageId: Math.random().toString(),
      createdOn: new Date('2019-04-13T00:00:00.000+08:11'),
      mine: true,
      attached: false
    }
  ];

  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} styles={messageThreadStyle} messages={messages} onRenderMessage={onRenderMessage} />
    </FluentThemeProvider>
  );
};

export const CustomizedBlockedMessage = CustomizedBlockedMessageStory.bind({});
