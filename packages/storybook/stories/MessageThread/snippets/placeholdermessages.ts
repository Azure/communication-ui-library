// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatMessage, CustomMessage, MessageStatus, SystemMessage } from '@azure/communication-react';

// This is some mock messages for example purposes.
// For actual projects, you can get chat messages from declarative/selectors for ACS.
export const GetHistoryChatMessages = (): ChatMessage[] => {
  return [
    {
      messageType: 'chat',
      senderId: 'user1',
      senderDisplayName: 'Kat Larsson',
      messageId: Math.random().toString(),
      content: 'Hi everyone, I created this awesome group chat for us!',
      createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
      mine: true,
      attached: false,
      status: 'seen' as MessageStatus,
      contentType: 'html'
    },
    {
      messageType: 'chat',
      senderId: 'user2',
      senderDisplayName: 'Robert Tolbert',
      messageId: Math.random().toString(),
      content: 'Nice! This looks great!',
      createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false,
      contentType: 'text'
    },
    {
      messageType: 'chat',
      senderId: 'user3',
      senderDisplayName: 'Carole Poland',
      messageId: Math.random().toString(),
      content: "Yeah agree, let's chat here from now on!",
      createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false,
      contentType: 'text'
    },
    {
      messageType: 'chat',
      senderId: 'user1',
      senderDisplayName: 'Kat Larsson',
      messageId: Math.random().toString(),
      content: 'OK, perfect!',
      createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
      mine: true,
      attached: false,
      contentType: 'text',
      status: 'failed' as MessageStatus,
      failureReason: 'Edit failed, try again'
    }
  ];
};

export const GetHistoryWithSystemMessages = (): (SystemMessage | ChatMessage)[] => {
  return [
    ...GetHistoryChatMessages(),
    {
      messageType: 'system',
      createdOn: new Date('2020-04-13T00:00:00.000+07:01'),
      systemMessageType: 'content',
      messageId: Math.random().toString(),
      iconName: 'PeopleAdd',
      content: 'Miguel Garcia is added to the chat'
    }
  ];
};

export const GetHistoryWithCustomMessages = (): (CustomMessage | ChatMessage)[] => {
  return [
    {
      messageType: 'custom',
      // Custom message's payload can be any shape, this is just an example.
      // Whatever is defined in the custom message's payload needs to be handled in onRenderMessage in MessageThread.
      createdOn: new Date('2020-04-13T00:00:00.000+07:01'),
      messageId: Math.random().toString(),
      content: 'Today'
    },
    ...GetHistoryChatMessages()
  ];
};

// This is some mock avatars for example purposes.
export const GetAvatarUrlByUserId = (userId: string): string => {
  switch (userId) {
    case 'user1':
      return 'images/avatars/avatar-1.jpg';
    case 'user2':
      return 'images/avatars/avatar-2.jpg';
    case 'user3':
      return 'images/avatars/avatar-8.jpg';
    default:
      return '';
  }
};
