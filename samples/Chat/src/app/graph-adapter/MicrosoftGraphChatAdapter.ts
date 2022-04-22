// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { ChatClient } from '@azure/communication-chat';
import { CommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  ChatAdapter,
  createAzureCommunicationChatAdapterFromClient,
  createStatefulChatClientWithDeps
} from '@azure/communication-react';
import { MicrosoftGraphChatClient } from './MicrosoftGraphChatClient';
import { Model } from './Model';
import { IChatClient } from './types';

const participantId = '08381377-19e1-48df-876d-a45998dd5910';
const displayName = 'James  Burnside';
const threadId = '19:08381377-19e1-48df-876d-a45998dd5910_71ad4812-19d8-4fd6-8ceb-0f14c2101e5e@unq.gbl.spaces';

export const createMicrosoftGraphChatAdapter = async (): Promise<ChatAdapter> => {
  const model = new Model();
  await model.populateAllThreads();
  const chatClient = new MicrosoftGraphChatClient(model) as IChatClient as ChatClient;

  const statefulChatClient = createStatefulChatClientWithDeps(chatClient, {
    userId: { id: participantId } as unknown as CommunicationUserIdentifier,
    displayName: displayName,
    endpoint: 'FAKE_ENDPIONT',
    credential: fakeToken
  });

  return await createAzureCommunicationChatAdapterFromClient(
    statefulChatClient,
    await statefulChatClient.getChatThreadClient(threadId)
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
const fakeToken: CommunicationTokenCredential = {
  getToken(): any {},
  dispose(): any {}
};
