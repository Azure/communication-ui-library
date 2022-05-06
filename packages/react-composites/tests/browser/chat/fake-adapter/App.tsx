// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClient, ChatParticipant, ChatThreadClient } from '@azure/communication-chat';
import { CommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { CommunicationIdentifier } from '@azure/communication-signaling';
import { _createStatefulChatClientWithDeps } from '@internal/chat-stateful-client';
import { _IdentifierProvider } from '@internal/react-components';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { ChatAdapter, ChatComposite, createAzureCommunicationChatAdapterFromClient } from '../../../../src';
// eslint-disable-next-line no-restricted-imports
import { IDS } from '../../common/constants';
import { verifyParamExists } from '../../common/testAppUtils';
import { FakeChatService } from './fake-back-end/ChatService';
import { ChatAdapterModel } from './fixture';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

/**
 * App with chat composite using a fake Chat adapter
 */
export const App = (): JSX.Element => {
  // Required params
  const fakeChatAdapterModel = JSON.parse(
    verifyParamExists(params.fakeChatAdapterModel, 'fakeChatAdapterModel')
  ) as ChatAdapterModel;

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
  const participants: ChatParticipant[] = model.users.map((user) => {
    return {
      id: { communicationUserId: nanoid() },
      displayName: user
    };
  });
  const firstUserId = participants[0].id;
  const firstChatClient = chatService.newClient(firstUserId);
  const thread = await firstChatClient.createChatThread(
    {
      topic: 'Cowabunga'
    },
    {
      participants: participants
    }
  );
  const participantHandle = {
    userId: participants[0].id,
    displayName: participants[0].displayName,
    chatClient: firstChatClient,
    chatThreadClient: firstChatClient.getChatThreadClient(thread.chatThread?.id ?? 'INVALID_THREAD_ID')
  };
  return await initializeAdapter(participantHandle);
}

const initializeAdapter = async (participant: ParticipantHandle): Promise<ChatAdapter> => {
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

interface ParticipantHandle {
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
