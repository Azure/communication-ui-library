// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  ChatAdapter,
  createAzureCommunicationChatAdapterFromClient,
  createStatefulChatClientWithDeps
} from '@azure/communication-react';
import { FakeChatService } from '@internal/fake-backends';
import { ChatClient, ChatThreadClient } from '@azure/communication-chat';
import {
  CommunicationIdentifier,
  CommunicationTokenCredential,
  CommunicationUserIdentifier
} from '@azure/communication-common';

export interface ParticipantHandle {
  userId: CommunicationIdentifier;
  displayName: string;
  chatClient: ChatClient;
  chatThreadClient: ChatThreadClient;
}

export const setupFakeThreadWithTwoParticipants = async (
  firstDisplayName: string,
  secondDisplayName: string
): Promise<[ParticipantHandle, ParticipantHandle]> => {
  const fakeChatService = new FakeChatService({
    asyncDelivery: true,
    maxDelayMilliseconds: 3000
  });
  const [firstUserId, firstChatClient] = fakeChatService.newUserAndClient();
  const [secondUserId, secondChatClient] = fakeChatService.newUserAndClient();
  const thread = await firstChatClient.createChatThread(
    {
      topic: 'Say Hello'
    },
    {
      participants: [
        { id: firstUserId, displayName: firstDisplayName },
        { id: secondUserId, displayName: secondDisplayName }
      ]
    }
  );

  return [
    {
      userId: firstUserId,
      displayName: firstDisplayName,
      chatClient: firstChatClient,
      chatThreadClient: firstChatClient.getChatThreadClient(thread.chatThread?.id ?? 'INVALID_THREAD_ID')
    },
    {
      userId: secondUserId,
      displayName: secondDisplayName,
      chatClient: secondChatClient,
      chatThreadClient: secondChatClient.getChatThreadClient(thread.chatThread?.id ?? 'INVALID_THREAD_ID')
    }
  ];
};

export const initializeAdapter = async (participant: ParticipantHandle): Promise<ChatAdapter> => {
  const statefulChatClient = createStatefulChatClientWithDeps(participant.chatClient, {
    userId: participant.userId as CommunicationUserIdentifier,
    displayName: participant.displayName,
    endpoint: 'FAKE_ENDPIONT',
    credential: fakeToken
  });
  statefulChatClient.startRealtimeNotifications();
  return await createAzureCommunicationChatAdapterFromClient(
    statefulChatClient,
    await statefulChatClient.getChatThreadClient(participant.chatThreadClient.threadId)
  );
};

export const sendMessages = (client: ChatThreadClient, messages: string[]): void => {
  let index = 0;
  // Send first message immediately so users aren't staring at an empty chat thread.
  if (messages.length > 0) {
    client.sendMessage({ content: messages[index++] });
  }
  setInterval(() => {
    if (index < messages.length) {
      client.sendMessage({ content: messages[index++] });
    }
  }, 5000);
};

const fakeToken: CommunicationTokenCredential = {
  getToken(): any {},
  dispose(): any {}
};
