// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  MessageStatus,
  MessageAttachedStatus,
  ChatMessage,
  CustomMessage,
  SystemMessage,
  FileMetadata
} from '@azure/communication-react';

export const MessageThreadStoryContainerStyles = {
  width: '100%',
  height: '100%',
  maxWidth: '50rem',
  padding: '1rem'
};

export const UserOne = {
  senderId: 'user1',
  senderDisplayName: 'Elliot Woodward'
};
const UserTwo = {
  senderId: 'user2',
  senderDisplayName: 'Katri Ahokas'
};
const UserThree = {
  senderId: 'user3',
  senderDisplayName: 'Miguel Garcia'
};

// This is some mock avatars for example purposes.
export const GetAvatarUrlByUserId = (userId: string): string => {
  switch (userId) {
    case 'user1':
      return 'images/avatars/avatar-4.jpg';
    case 'user2':
      return 'images/avatars/avatar-9.jpg';
    case 'user3':
      return 'images/avatars/avatar-6.jpg';
    default:
      return '';
  }
};

export const GenerateMockNewChatMessage = (): ChatMessage => {
  return {
    messageType: 'chat',
    ...UserOne,
    messageId: Math.random().toString(),
    content: 'I just sent a new Message!',
    createdOn: new Date('2020-04-13T00:00:00.000+07:01'),
    mine: true,
    attached: false,
    contentType: 'text',
    status: 'seen' as MessageStatus
  };
};

export const GenerateMockNewChatMessageFromOthers = (): ChatMessage => {
  return {
    messageType: 'chat',
    ...UserThree,
    messageId: Math.random().toString(),
    content: "Sure! Let's checkout calling UI components as well!",
    createdOn: new Date('2020-04-13T00:00:00.000+07:01'),
    mine: false,
    attached: false,
    contentType: 'text'
  };
};

export const GenerateMockNewChatMessageWithInlineImage = (): ChatMessage => {
  return {
    messageType: 'chat',
    ...UserThree,
    messageId: Math.random().toString(),
    content:
      '<p>Check out this image:&nbsp;</p>\r\n<p><img alt="image" src="" itemscope="png" width="250" height="250" id="SomeImageId" style="vertical-align:bottom"></p>\r\n<p><img alt="image" src="" itemscope="png" width="500" height="500" id="SomeImageId2" style="vertical-align:bottom"></p><p>&nbsp;</p>\r\n',
    createdOn: new Date('2020-04-13T00:00:00.000+07:01'),
    mine: false,
    attached: false,
    contentType: 'html',
    attachedFilesMetadata: GenerateMockMessageAttachments()
  };
};

const GenerateMockMessageAttachments = (): FileMetadata[] => {
  return [
    {
      id: 'SomeImageId',
      name: 'SomeImageId',
      attachmentType: 'teamsInlineImage',
      extension: 'png',
      url: 'images/github.png',
      previewUrl: 'images/github.png'
    },
    {
      id: 'SomeImageId2',
      name: 'SomeImageId2',
      attachmentType: 'teamsInlineImage',
      extension: 'png',
      url: 'https://www.gstatic.com/webp/gallery3/1_webp_a.png',
      previewUrl: 'https://www.gstatic.com/webp/gallery3/1_webp_a.png'
    }
  ];
};

export const GenerateMockSystemMessage = (): SystemMessage => {
  return {
    messageType: 'system',
    systemMessageType: 'content',
    createdOn: new Date('2020-04-13T00:00:00.000+07:01'),
    messageId: Math.random().toString(),
    iconName: 'PeopleAdd',
    content: 'Elliot Woodward added Carole Poland to the chat and shared all chat history.'
  };
};

export const GenerateMockCustomMessage = (): CustomMessage => {
  return {
    messageType: 'custom',
    // Custom message's payload can be any shape, this is just an example.
    // Whatever is defined in the custom message's payload needs to be handled in onRenderCustomMessage in MessageThread.
    createdOn: new Date('2020-04-13T00:00:00.000+07:01'),
    messageId: Math.random().toString(),
    content: 'Today'
  };
};

export const GenerateMockHistoryChatMessages = (): ChatMessage[] => {
  return [
    {
      messageType: 'chat',
      ...UserOne,
      messageId: Math.random().toString(),
      content: 'Hi everyone, I created this awesome group chat for us!',
      createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
      mine: true,
      attached: false,
      contentType: 'text',
      status: 'seen' as MessageStatus
    },
    {
      messageType: 'chat',

      ...UserTwo,
      messageId: Math.random().toString(),
      content: 'Nice! This looks great!',
      createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false,
      contentType: 'text'
    },
    {
      messageType: 'chat',

      ...UserThree,
      messageId: Math.random().toString(),
      content: "Yeah agree, let's chat here from now on!",
      createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
      mine: false,
      attached: false,
      contentType: 'text'
    }
  ];
};

export const GenerateMockChatMessages = (): ChatMessage[] => {
  return [
    {
      messageType: 'chat',
      ...UserOne,
      messageId: Math.random().toString(),
      content: 'Hey folks!',
      createdOn: new Date('2020-04-13T00:00:00.000+08:10'),
      mine: true,
      attached: false,
      contentType: 'text',
      status: 'seen' as MessageStatus
    },
    {
      messageType: 'chat',
      ...UserTwo,
      messageId: Math.random().toString(),
      content: 'Hey how are you?',
      createdOn: new Date('2020-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false,
      contentType: 'text'
    },
    {
      messageType: 'chat',
      ...UserThree,
      messageId: Math.random().toString(),
      content: 'Hey everyone!',
      createdOn: new Date('2020-04-13T00:00:00.000+08:08'),
      mine: false,
      attached: false,
      contentType: 'text'
    },
    {
      messageType: 'chat',
      ...UserOne,
      messageId: Math.random().toString(),
      content: 'Doing well!',
      createdOn: new Date('2020-04-13T00:00:00.000+08:07'),
      mine: true,
      attached: false,
      contentType: 'text',
      status: 'seen' as MessageStatus
    },
    {
      messageType: 'chat',
      ...UserTwo,
      messageId: Math.random().toString(),
      content: 'Checking out the new UI Components for Azure Communication Services!',
      createdOn: new Date('2020-04-13T00:00:00.000+08:06'),
      mine: false,
      attached: 'top' as MessageAttachedStatus,
      contentType: 'text'
    },
    {
      messageType: 'chat',
      ...UserTwo,
      messageId: Math.random().toString(),
      content: 'The chat thread is very responsive.',
      createdOn: new Date('2020-04-13T00:00:00.000+08:05'),
      mine: false,
      attached: true,
      contentType: 'text'
    },
    {
      messageType: 'chat',
      ...UserTwo,
      messageId: Math.random().toString(),
      content: 'It even scrolls!',
      createdOn: new Date('2020-04-13T00:00:00.000+08:05'),
      mine: false,
      attached: 'bottom' as MessageAttachedStatus,
      contentType: 'text'
    },
    {
      messageType: 'chat',
      ...UserThree,
      messageId: Math.random().toString(),
      content: 'Can you customize it?',
      createdOn: new Date('2020-04-13T00:00:00.000+08:04'),
      mine: false,
      attached: false,
      contentType: 'text'
    },
    {
      messageType: 'chat',
      ...UserTwo,
      messageId: Math.random().toString(),
      content: 'Yes you can customize it.',
      createdOn: new Date('2020-04-13T00:00:00.000+08:03'),
      mine: false,
      attached: false,
      contentType: 'text'
    },
    {
      messageType: 'chat',
      ...UserOne,
      messageId: Math.random().toString(),
      content: 'I saw there are also calling UI components',
      createdOn: new Date('2020-04-13T00:00:00.000+08:02'),
      mine: true,
      attached: false,
      contentType: 'text',
      status: 'seen' as MessageStatus
    },
    {
      messageType: 'chat',
      ...UserTwo,
      messageId: Math.random().toString(),
      content: 'Yeah you can combine chat and calling components to build full communication experiences!',
      createdOn: new Date('2020-04-13T00:00:00.000+08:01'),
      mine: false,
      attached: false,
      contentType: 'text'
    }
  ];
};
