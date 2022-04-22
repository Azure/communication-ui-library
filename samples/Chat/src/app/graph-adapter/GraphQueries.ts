// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Providers } from '@microsoft/mgt-element';
import { Chat, ChatMessage, ConversationMember } from '@microsoft/microsoft-graph-types';

export const getChats = async (): Promise<Chat[]> => {
  const chats = (await Providers.client.api(`/me/chats`).get()).value;
  console.log('GraphQuery getChats response:', chats);
  return chats;
};

export const getChat = async (chatId: string): Promise<Chat> => {
  const chat = await Providers.client.api(`/me/chats/${chatId}`).get();
  console.log('GraphQuery getChat response:', chat);
  return chat;
};

export const getChatMessages = async (chatId: string): Promise<ChatMessage[]> => {
  const messages = (await Providers.client.api(`/chats/${chatId}/messages`).get()).value;
  console.log('GraphQuery getChatMessages response:', messages);
  return messages;
};

export const sendMessage = async (chatId: string, message: string): Promise<void> => {
  const chatMessage = {
    body: {
      content: message
    }
  };
  console.log('GraphQuery sendMessage, content: ', chatMessage);
  const reponse = await Providers.client.api(`/chats/${chatId}/messages`).post(chatMessage);
  console.log('GraphQuery sendMessage response:', reponse);
};

export const getChatParticipants = async (chatId: string): Promise<ConversationMember[]> => {
  const chatParticipants = (await Providers.client.api(`/chats/${chatId}/members`).get()).value;
  console.log('GraphQuery getChatParticipants response:', chatParticipants);
  return chatParticipants;
};
