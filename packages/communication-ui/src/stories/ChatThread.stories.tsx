// © Microsoft Corporation. All rights reserved.

import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { ChatThreadComponent as ChatThread } from '../components';
import { MessageStatus } from '../types';
import { getDocs } from './docs/ChatThreadDocs';
import { text, object, boolean } from '@storybook/addon-knobs';
import { COMPONENT_FOLDER_PREFIX } from './constants';

export const ChatThreadComponent: () => JSX.Element = () => {
  const userId = text('User ID', '1');
  const defaultChatMessages = [
    {
      messageId: '1',
      content: '1',
      createdOn: new Date('2020-12-15T00:00:00Z'),
      senderId: '1',
      senderDisplayName: 'User1',
      status: MessageStatus.SEEN
    },
    {
      messageId: '2',
      content: '2',
      createdOn: new Date('2020-12-15T00:01:01Z'),
      senderId: '2',
      senderDisplayName: 'User2',
      status: MessageStatus.DELIVERED
    },
    {
      messageId: '3',
      content: '3',
      createdOn: new Date('2020-12-15T00:02:01Z'),
      senderId: '2',
      senderDisplayName: 'User2',
      status: MessageStatus.DELIVERED
    },
    {
      messageId: '4',
      content: '4',
      createdOn: new Date('2020-12-15T00:03:01Z'),
      senderId: '3',
      senderDisplayName: 'User3',
      status: MessageStatus.DELIVERED
    },
    {
      messageId: '5',
      content: '5',
      createdOn: new Date('2020-12-15T00:04:01Z'),
      senderId: '1',
      senderDisplayName: 'User1',
      status: MessageStatus.SEEN
    },
    {
      messageId: '6',
      content: '6',
      createdOn: new Date('2020-12-15T00:05:01Z'),
      senderId: '1',
      senderDisplayName: 'User1',
      status: MessageStatus.DELIVERED
    },
    {
      messageId: '7',
      content: '7',
      createdOn: new Date('2020-12-15T00:06:01Z'),
      senderId: '2',
      senderDisplayName: 'User2',
      status: MessageStatus.SEEN
    },
    {
      messageId: '8',
      content: '8',
      createdOn: new Date('2020-12-15T00:07:01Z'),
      senderId: '1',
      senderDisplayName: 'User1',
      status: MessageStatus.DELIVERED
    },
    {
      messageId: '9',
      content: '9',
      createdOn: new Date('2020-12-15T00:08:01Z'),
      senderId: '1',
      senderDisplayName: 'User1',
      status: MessageStatus.DELIVERED
    },
    {
      messageId: '10',
      content: '10',
      createdOn: undefined,
      senderId: '1',
      senderDisplayName: 'User1',
      status: MessageStatus.FAILED
    }
  ];
  const chatMessages = object('Chat Messages', defaultChatMessages);
  const disableReadReceipt = boolean('Disable Read Receipt', false);
  const sendReadReceipt = (messageId: string): Promise<void> => {
    console.log('read receipt sent for ', messageId);
    return new Promise<void>((resolve) => resolve());
  };

  return (
    <ChatThread
      userId={userId}
      chatMessages={chatMessages}
      disableReadReceipt={disableReadReceipt}
      sendReadReceipt={sendReadReceipt}
    />
  );
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/ChatThread`,
  component: ChatThread,
  parameters: {
    useMaxHeightParent: true,
    useMaxWidthParent: true,
    docs: {
      page: () => getDocs()
    },
    /*
    - Cannot create storyshot for ChatThread. There is an error in the FluentUI components about missing
      addEventListener and removeEventListener. This still occurs even if we remove all usages of addEventListener
      and removeEventListener in our own code.

    console.error node_modules/react-test-renderer/cjs/react-test-renderer.development.js:10141
    The above error occurred in the <FocusZone> component:
        in FocusZone (created by Chat)
        in Chat (at ChatThread.tsx:445)
        in LiveAnnouncer (at ChatThread.tsx:444)
        in RefFindNode (created by Ref)
        in Ref (at ChatThread.tsx:443)
        in div (created by Stack)
        in Stack (at ChatThread.tsx:430)
        in RefFindNode (created by Ref)
        in Ref (at ChatThread.tsx:429)
        in ChatThreadComponent (at ChatThread.stories.tsx:94)
        in Unknown (at preview.tsx:55)
        in div (created by Provider)
        in RendererProvider (created by Provider)
        in Provider (created by Provider)
        in Provider (at preview.tsx:54)
        in Unknown (at preview.tsx:43)
        in div (created by ThemeProvider)
        in ThemeProvider (at preview.tsx:42)
        in Unknown (at preview.tsx:63)
        in div (at preview.tsx:62)
        in storyFn
    */
    storyshots: { disable: true }
  }
} as Meta;
