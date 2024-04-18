// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { _ChatThreadRestError, _FakeChatAdapterArgs } from './FakeChatAdapterArgs';
import { createAzureCommunicationChatAdapterFromClient } from '../composites/ChatComposite/adapter/AzureCommunicationChatAdapter';
import type { ChatAdapter } from '../composites/ChatComposite/adapter/ChatAdapter';

import { FakeChatClient, IChatClient, Model } from '@internal/fake-backends';

import { useEffect, useState } from 'react';
import { ChatClient, ChatParticipant, ChatThreadClient, CreateChatThreadResult } from '@azure/communication-chat';
import {
  CommunicationTokenCredential,
  CommunicationUserIdentifier,
  getIdentifierKind
} from '@azure/communication-common';
import { CommunicationIdentifier } from '@azure/communication-common';
import { _createStatefulChatClientWithDeps } from '@internal/chat-stateful-client';
import { RestError } from '@azure/core-rest-pipeline';

/**
 * Fake adapters and data structures for in-memory fake-backend for chat.
 * @internal
 */
export interface _FakeChatAdapters {
  local: ChatAdapter;
  remotes: ChatAdapter[];
  service: {
    model: Model;
    threadId: string;
  };
}

/** @private */
export interface _FakeChatAdaptersOptionalArgs {
  forceInvalidChatThread?: boolean;
}

/**
 * Create chat adapters using an in-memory fake-backend for chat.
 * @internal
 */
export function _useFakeChatAdapters(
  args: _FakeChatAdapterArgs,
  options?: _FakeChatAdaptersOptionalArgs
): _FakeChatAdapters | undefined {
  const [fakeAdapters, setFakeAdapters] = useState<_FakeChatAdapters>();
  const { forceInvalidChatThread } = options ?? {};
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
      const thread = await chatClient.createChatThread(
        { topic: args.topic ?? 'Cowabunga' },
        { participants, fakeInvalidThread: !!forceInvalidChatThread }
      );
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
      const newFakeAdapters: _FakeChatAdapters = {
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
  }, [args, forceInvalidChatThread]);

  return fakeAdapters;
}

const initializeAdapters = async (
  participants: ChatParticipant[],
  chatClientModel: Model,
  thread: CreateChatThreadResult
): Promise<ChatAdapter[]> => {
  const remoteAdapters: ChatAdapter[] = [];
  for (const participant of participants) {
    if (getIdentifierKind(participant.id).kind === 'microsoftTeamsApp') {
      throw new Error('Creating an adapter with a Bot participant is not supported');
    }
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
  chatThreadClientMethodErrors?: Partial<Record<keyof ChatThreadClient, _ChatThreadRestError>>
): Promise<ChatAdapter> => {
  const statefulChatClient = _createStatefulChatClientWithDeps(adapterInfo.chatClient, {
    userId: adapterInfo.userId as CommunicationUserIdentifier,
    displayName: adapterInfo.displayName,
    endpoint: 'http://FAKE_ENDPOINT',
    credential: fakeToken
  });
  statefulChatClient.startRealtimeNotifications();
  const chatThreadClient: ChatThreadClient = await statefulChatClient.getChatThreadClient(
    adapterInfo.chatThreadClient.threadId
  );
  registerChatThreadClientMethodErrors(chatThreadClient, chatThreadClientMethodErrors);
  return await createAzureCommunicationChatAdapterFromClient(statefulChatClient, chatThreadClient);
};

interface AdapterInfo {
  userId: CommunicationIdentifier;
  displayName: string;
  chatClient: ChatClient;
  chatThreadClient: ChatThreadClient;
}

type MockAccessToken = {
  token: string;
  expiresOnTimestamp: number;
};

const fakeToken: CommunicationTokenCredential = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function
  getToken: (): Promise<MockAccessToken> => {
    return new Promise<MockAccessToken>((resolve) => {
      resolve({ token: 'anyToken', expiresOnTimestamp: Date.now() });
    });
  },
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

const registerChatThreadClientMethodErrors = (
  chatThreadClient: ChatThreadClient,
  chatThreadClientMethodErrors?: Partial<Record<keyof ChatThreadClient, _ChatThreadRestError>>
): void => {
  for (const k in chatThreadClientMethodErrors) {
    if (k in chatThreadClient) {
      const key = k as keyof Omit<ChatThreadClient, 'threadId'>;
      chatThreadClient[key] = () => {
        throw new RestError(chatThreadClientMethodErrors[key]?.message ?? '', {
          code: chatThreadClientMethodErrors[key]?.code,
          statusCode: chatThreadClientMethodErrors[key]?.statusCode
        });
      };
    }
  }
};
