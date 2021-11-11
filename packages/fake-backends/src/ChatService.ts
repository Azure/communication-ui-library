// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { nanoid } from 'nanoid';
import { CommunicationIdentifier } from '@azure/communication-common';
import { FakeChatClient } from './StubChatClient';
import { Model } from './Model';
import { IChatClient } from './types';

/**
 * A fake Azure Communication Services chat backend.
 *
 * The service starts out with no state - no participants and no chat threads.
 * Subsequent operations create participants, threads etc that are all stored in-memory.
 */
export class FakeChatService {
  private model: Model = { threads: [] };

  public newClient(id: CommunicationIdentifier): IChatClient {
    return new FakeChatClient(this.model, id);
  }

  public newUserAndClient(): [CommunicationIdentifier, IChatClient] {
    const id = { communicationUserId: nanoid() };
    return [id, new FakeChatClient(this.model, id)];
  }
}
