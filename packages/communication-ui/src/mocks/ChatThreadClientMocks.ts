// © Microsoft Corporation. All rights reserved.
/* eslint-disable no-undef */

import { BaseClientMock, createBaseClientMock } from './ChatClientMocks';
import { OK, TEXT_MESSAGE } from '../constants';

import { ChatMessage, ChatThreadMember } from '@azure/communication-chat';

export type ThreadClientMock = {
  sendReadReceipt: () => void;
  listMessages: () => void;
  listMembers: () => void;
  sendTypingNotification: () => void;
  getMessage: () => void;
  getThread: () => void;
} & BaseClientMock;

export const mockChatMessages = (): ChatMessage[] => {
  return [
    { id: '1', content: '1', type: TEXT_MESSAGE },
    { id: '2', content: '2', type: TEXT_MESSAGE },
    { id: '3', content: '3', type: TEXT_MESSAGE }
  ];
};

type ResponseWithStatus = {
  status: number;
};

type ChatMessageWithReponseStatus = {
  _response: ResponseWithStatus;
} & ChatMessage;

export const mockChatMessage = (): ChatMessageWithReponseStatus => {
  return { _response: { status: OK }, id: '1', content: '1', type: TEXT_MESSAGE };
};

export const mockThreadMembers = (): ChatThreadMember[] => {
  return [
    { user: { communicationUserId: 'userId1' } },
    { user: { communicationUserId: 'userId2' } },
    { user: { communicationUserId: 'userId3' } }
  ];
};

export const createThreadClient = (): ThreadClientMock => {
  const clientMock = createBaseClientMock();
  const messageId = 'message id';
  const messagesMock: ChatMessage[] = mockChatMessages();
  const messageMock: ChatMessage = mockChatMessage();
  const threadMembersMock: ChatThreadMember[] = mockThreadMembers();
  const threadClientMock: ThreadClientMock = {
    ...clientMock,
    sendReadReceipt: jest.fn(() => messageId),
    sendTypingNotification: jest.fn(),
    listMessages: jest.fn(() => messagesMock),
    listMembers: jest.fn(() => threadMembersMock),
    getMessage: jest.fn(() => messageMock),
    getThread: jest.fn()
  };
  return threadClientMock;
};
