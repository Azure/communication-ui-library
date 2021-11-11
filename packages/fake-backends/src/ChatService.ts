// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { nanoid } from 'nanoid';
import { CommunicationIdentifier } from '@azure/communication-common';
import { FakeChatClient } from './StubChatClient';
import { IChatClient } from './types';

/**
 * A fake Azure Communication Services chat backend.
 *
 * The service starts out with no state - no participants and no chat threads.
 * Subsequent operations create participants, threads etc that are all stored in-memory.
 */
export class FakeChatService {
  public newClient(id: CommunicationIdentifier): IChatClient {
    return new FakeChatClient();
  }

  public newUserAndClient(): [CommunicationIdentifier, IChatClient] {
    return [{ communicationUserId: nanoid() }, new FakeChatClient()];
  }
}
