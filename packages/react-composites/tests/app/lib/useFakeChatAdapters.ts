// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatThreadRestError, FakeChatAdapterArgs } from '../../common';
import { createAzureCommunicationChatAdapterFromClient } from '../../../src';
import type { ChatAdapter } from '../../../src';

import { FakeChatClient, IChatClient, Model } from '@internal/fake-backends';

import { useEffect, useState } from 'react';
import { ChatClient, ChatParticipant, ChatThreadClient } from '@azure/communication-chat';
import { CommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { CommunicationIdentifier } from '@azure/communication-signaling';
import { _createStatefulChatClientWithDeps } from '@internal/chat-stateful-client';
import { RestError } from '@azure/core-http';

/**
 * Fake adapters and data structures for in-memory fake-backend for chat.
 */
export interface FakeAdapters {
  local: ChatAdapter;
  remotes: ChatAdapter[];
  service: {
    model: Model;
    threadId: string;
  };
}

/**
 * Create chat adapters using an in-memory fake-backend for chat.
 */
export function useFakeChatAdapters(args: FakeChatAdapterArgs): FakeAdapters | undefined {
  const [fakeAdapters, setFakeAdapters] = useState<FakeAdapters>();
  useEffect(() => {
    (async (): Promise<void> => {
      if (!args.localParticipant.displayName) {
        throw new Error(
          `Local participant must have display name defined, got ${JSON.stringify(args.localParticipant)}`
        );
      }

      const chatClientModel = new Model({ asyncDelivery: false });
      const participants = orderParticipants(
        args.localParticipant,
        args.remoteParticipants,
        args.localParticipantPosition
      );
      const chatClient = new FakeChatClient(chatClientModel, args.localParticipant.id);
      const thread = await chatClient.createChatThread({ topic: 'Cowabunga' }, { participants });
      const threadId = thread?.chatThread?.id ?? '';
      const chatThreadClient = chatClient.getChatThreadClient(threadId);
      const adapter = await initializeAdapter(
        {
          userId: args.localParticipant.id,
          displayName: args.localParticipant.displayName,
          chatClient: chatClient as IChatClient as ChatClient,
          chatThreadClient: chatThreadClient
        },
        args.chatThreadClientMethodErrors
      );
      const newFakeAdapters: FakeAdapters = {
        local: adapter,
        remotes: [],
        service: {
          model: chatClientModel,
          threadId: threadId
        }
      };
      if (args.participantsWithHiddenComposites) {
        newFakeAdapters.remotes = await initializeAdapters(
          args.participantsWithHiddenComposites,
          chatClientModel,
          thread
        );
      }
      setFakeAdapters(newFakeAdapters);
    })();
  }, [args]);

  return fakeAdapters;
}

const initializeAdapters = async (
  participants: ChatParticipant[],
  chatClientModel: Model,
  thread
): Promise<ChatAdapter[]> => {
  const remoteAdapters: ChatAdapter[] = [];
  for (const participant of participants) {
    if (!participant.displayName) {
      throw new Error(`All participants must have displayName defined, got ${JSON.stringify(participant)}`);
    }
    const remoteChatClient = new FakeChatClient(chatClientModel, participant.id);
    const remoteAdapter = await initializeAdapter({
      userId: participant.id,
      displayName: participant.displayName,
      chatClient: remoteChatClient as IChatClient as ChatClient,
      chatThreadClient: remoteChatClient.getChatThreadClient(thread.chatThread?.id ?? 'INVALID_THREAD_ID')
    });
    remoteAdapters.push(remoteAdapter);
  }
  return remoteAdapters;
};

const initializeAdapter = async (
  adapterInfo: AdapterInfo,
  chatThreadClientMethodErrors?: Partial<Record<keyof ChatThreadClient, ChatThreadRestError>>
): Promise<ChatAdapter> => {
  const statefulChatClient = _createStatefulChatClientWithDeps(adapterInfo.chatClient, {
    userId: adapterInfo.userId as CommunicationUserIdentifier,
    displayName: adapterInfo.displayName,
    endpoint: 'FAKE_ENDPOINT',
    credential: fakeToken
  });
  statefulChatClient.startRealtimeNotifications();
  const chatThreadClient: ChatThreadClient = await statefulChatClient.getChatThreadClient(
    adapterInfo.chatThreadClient.threadId
  );
  registerchatThreadClientMethodErrors(chatThreadClient, chatThreadClientMethodErrors);
  return await createAzureCommunicationChatAdapterFromClient(statefulChatClient, chatThreadClient);
};

interface AdapterInfo {
  userId: CommunicationIdentifier;
  displayName: string;
  chatClient: ChatClient;
  chatThreadClient: ChatThreadClient;
}

const fakeToken: CommunicationTokenCredential = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function
  getToken(): any {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function
  dispose(): any {}
};

const orderParticipants = (
  localUser: ChatParticipant,
  remoteParticipants: ChatParticipant[],
  localPosition?: number
): ChatParticipant[] => {
  const participants = remoteParticipants;
  const splicePosition = localPosition && localPosition < participants.length ? localPosition : 0;
  participants.splice(splicePosition, 0, localUser);
  return participants;
};

const registerchatThreadClientMethodErrors = (
  chatThreadClient: ChatThreadClient,
  chatThreadClientMethodErrors?: Partial<Record<keyof ChatThreadClient, ChatThreadRestError>>
): void => {
  for (const k in chatThreadClientMethodErrors) {
    chatThreadClient[k] = () => {
      throw new RestError(
        chatThreadClientMethodErrors[k].message ?? '',
        chatThreadClientMethodErrors[k].code,
        chatThreadClientMethodErrors[k].statusCode
      );
    };
  }
};
