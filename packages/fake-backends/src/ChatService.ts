// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { nanoid } from 'nanoid';
import { CommunicationIdentifier } from '@azure/communication-common';
import { FakeChatClient } from './FakeChatClient';
import { Model } from './Model';
import { IChatClient } from './types';
import { ChatClient } from '@azure/communication-chat';

/**
 * A fake Azure Communication Services chat backend.
 *
 * The service starts out with no state - no participants and no chat threads.
 * Subsequent operations create participants, threads etc that are all stored in-memory.
 */
export class FakeChatService {
  private model: Model = new Model();

  public newClient(id: CommunicationIdentifier): ChatClient {
    return new FakeChatClient(this.model, id) as IChatClient as ChatClient;
  }

  public newUserAndClient(): [CommunicationIdentifier, ChatClient] {
    const id = { communicationUserId: nanoid() };
    return [id, this.newClient(id)];
  }
}
