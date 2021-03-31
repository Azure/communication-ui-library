// © Microsoft Corporation. All rights reserved.

import { ChatMessage as WebUiChatMessage, MessageStatus, MessageAttachedStatus } from '@azure/communication-ui';

export const ChatThreadContainerStyles = {
  width: '100%',
  height: '100%',
  maxWidth: '50rem',
  maxHeight: '30rem'
};

export const ChatThreadStyles = {
  root: {
    margin: '20px auto',
    border: '1px solid',
    padding: '0 10px'
  }
};

export const UserOne = {
  senderId: '1',
  senderDisplayName: 'User1'
};
const UserTwo = {
  senderId: '2',
  senderDisplayName: 'User2'
};
const UserThree = {
  senderId: '3',
  senderDisplayName: 'User3'
};

export const GenerateMockNewChatMessage = (): WebUiChatMessage => {
  return {
    ...UserOne,
    messageId: Math.random().toString(),
    content: 'I just sent a new Message!',
    createdOn: new Date('2020-04-13T00:00:00.000+07:01'),
    mine: true,
    attached: false,
    statusToRender: 'seen' as MessageStatus
  };
};

export const GenerateMockNewChatMessageFromOthers = (): WebUiChatMessage => {
  return {
    ...UserThree,
    messageId: Math.random().toString(),
    content: "Sure! Let's checkout calling UI components as well!",
    createdOn: new Date('2020-04-13T00:00:00.000+07:01'),
    mine: false,
    attached: false
  };
};

export const GenerateMockHistoryChatMessages = (): WebUiChatMessage[] => {
  return [
    {
      ...UserOne,
      messageId: Math.random().toString(),
      content: 'Hi everyone, I created this awesome group chat for us!',
      createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
      mine: true,
      attached: false
    },
    {
      ...UserTwo,
      messageId: Math.random().toString(),
      content: 'Nice! This looks great!',
      createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false
    },
    {
      ...UserThree,
      messageId: Math.random().toString(),
      content: "Yeah agree, let's chat here from now on!",
      createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
      mine: false,
      attached: false
    }
  ];
};

export const GenerateMockChatMessages = (): WebUiChatMessage[] => {
  return [
    {
      ...UserOne,
      messageId: Math.random().toString(),
      content: 'Hey folks!',
      createdOn: new Date('2020-04-13T00:00:00.000+08:10'),
      mine: true,
      attached: false
    },
    {
      ...UserTwo,
      messageId: Math.random().toString(),
      content: 'Hey how are you?',
      createdOn: new Date('2020-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false
    },
    {
      ...UserThree,
      messageId: Math.random().toString(),
      content: 'Hey everyone!',
      createdOn: new Date('2020-04-13T00:00:00.000+08:08'),
      mine: false,
      attached: false
    },
    {
      ...UserOne,
      messageId: Math.random().toString(),
      content: 'Doing well!',
      createdOn: new Date('2020-04-13T00:00:00.000+08:07'),
      mine: true,
      attached: false
    },
    {
      ...UserTwo,
      messageId: Math.random().toString(),
      content: 'Checking out the new UI Components for Azure Communication Services!',
      createdOn: new Date('2020-04-13T00:00:00.000+08:06'),
      mine: false,
      attached: 'top' as MessageAttachedStatus
    },
    {
      ...UserTwo,
      messageId: Math.random().toString(),
      content: 'The chat thread is very responsive.',
      createdOn: new Date('2020-04-13T00:00:00.000+08:05'),
      mine: false,
      attached: true
    },
    {
      ...UserTwo,
      messageId: Math.random().toString(),
      content: 'It even scrolls!',
      createdOn: new Date('2020-04-13T00:00:00.000+08:05'),
      mine: false,
      attached: 'bottom' as MessageAttachedStatus
    },
    {
      ...UserThree,
      messageId: Math.random().toString(),
      content: 'Can you customize it?',
      createdOn: new Date('2020-04-13T00:00:00.000+08:04'),
      mine: false,
      attached: false
    },
    {
      ...UserTwo,
      messageId: Math.random().toString(),
      content: 'Yes you can customize it.',
      createdOn: new Date('2020-04-13T00:00:00.000+08:03'),
      mine: false,
      attached: false
    },
    {
      ...UserOne,
      messageId: Math.random().toString(),
      content: 'I saw there are also calling UI components',
      createdOn: new Date('2020-04-13T00:00:00.000+08:02'),
      mine: true,
      attached: false,
      statusToRender: 'seen' as MessageStatus
    },
    {
      ...UserTwo,
      messageId: Math.random().toString(),
      content: 'Yeah you can combine chat and calling components to build full communication experiences!',
      createdOn: new Date('2020-04-13T00:00:00.000+08:01'),
      mine: false,
      attached: false
    }
  ];
};
