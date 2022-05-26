// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClient, ChatParticipant, ChatThreadClient } from '@azure/communication-chat';
import {
  CommunicationIdentifier,
  CommunicationTokenCredential,
  CommunicationUserIdentifier
} from '@azure/communication-common';
import { _createStatefulChatClientWithDeps } from '@internal/chat-stateful-client';
import { _IdentifierProvider } from '@internal/react-components';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import {
  ChatAdapter,
  ChatComposite,
  COMPOSITE_LOCALE_FR_FR,
  createAzureCommunicationChatAdapterFromClient
} from '../../../../src';
// eslint-disable-next-line no-restricted-imports
import { IDS } from '../../common/constants';
import { verifyParamExists } from '../../common/testAppUtils';
import { FakeChatService } from './fake-back-end/ChatService';
import { ChatAdapterModel } from '../fake-adapter/fixture';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

/**
 * App with chat composite using a fake Chat adapter
 */
export const FakeAdapterApp = (): JSX.Element => {
  // Required params
  const fakeChatAdapterModel = JSON.parse(
    verifyParamExists(params.fakeChatAdapterModel, 'fakeChatAdapterModel')
  ) as ChatAdapterModel;

  // Optional params
  const useFrLocale = Boolean(params.useFrLocale);

  const [adapter, setAdapter] = useState<ChatAdapter | undefined>(undefined);
  useEffect(() => {
    const initialize = async (): Promise<void> => {
      setAdapter(await createFakeChatAdapter(fakeChatAdapterModel));
    };

    initialize();
    return () => adapter && adapter.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!adapter && 'Initializing chat adapter...'}
      {adapter && (
        <_IdentifierProvider identifiers={IDS}>
          <ChatComposite
            adapter={adapter}
            locale={useFrLocale ? COMPOSITE_LOCALE_FR_FR : undefined}
            options={{
              participantPane: true
            }}
          />
        </_IdentifierProvider>
      )}
    </>
  );
};

async function createFakeChatAdapter(model: ChatAdapterModel): Promise<ChatAdapter> {
  const chatService = new FakeChatService();
  const remoteParticipants: ChatParticipant[] = model.remoteParticipants.map((user) => {
    return {
      id: { communicationUserId: nanoid() },
      displayName: user
    };
  });
  const localUser = { id: { communicationUserId: nanoid() }, displayName: model.localParticipant };
  const firstChatClient = chatService.newClient(localUser.id);
  const thread = await firstChatClient.createChatThread(
    {
      topic: 'Cowabunga'
    },
    {
      participants: [localUser, ...remoteParticipants]
    }
  );
  const participantHandle = {
    userId: localUser.id,
    displayName: localUser.displayName,
    chatClient: firstChatClient,
    chatThreadClient: firstChatClient.getChatThreadClient(thread.chatThread?.id ?? 'INVALID_THREAD_ID')
  };
  return await initializeAdapter(participantHandle);
}

const initializeAdapter = async (participant: AdapterInfo): Promise<ChatAdapter> => {
  const statefulChatClient = _createStatefulChatClientWithDeps(participant.chatClient, {
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
