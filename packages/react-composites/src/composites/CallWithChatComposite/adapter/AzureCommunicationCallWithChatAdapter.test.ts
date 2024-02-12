// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { CommunicationTokenCredential } from '@azure/communication-common';
import { StubChatThreadClient } from '../../ChatComposite/adapter/StubChatClient';
import { createStatefulChatClientMock } from '../../../mocks';
import { createAzureCommunicationCallWithChatAdapterFromClients } from './AzureCommunicationCallWithChatAdapter';
import { MockCallClient, MockCallAgent } from './TestUtils';
import { StatefulCallClient } from '@internal/calling-stateful-client';

describe('Adapter is created as expected', () => {
  it('when creating a new adapter from stateful client', async () => {
    const mockCallClient = new MockCallClient() as unknown as StatefulCallClient;

    const mockCallAgent = new MockCallAgent();
    const locator = { meetingLink: 'someTeamsMeetingLink' };

    const statefulChatClient = createStatefulChatClientMock(new StubChatThreadClient());
    const threadClient = statefulChatClient.getChatThreadClient('threadId');

    /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
    const options = { credential: stubCommunicationTokenCredential() };
    const args = {
      callClient: mockCallClient,
      callAgent: mockCallAgent,
      callLocator: locator,
      chatClient: statefulChatClient,
      chatThreadClient: threadClient,
      /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
      options: options
    };
    const adapter = await createAzureCommunicationCallWithChatAdapterFromClients(args);
    expect(adapter).toBeDefined();
  });

  /* @conditional-compile-remove(meeting-id) */
  it('when creating a new adapter from stateful client with meeting id', async () => {
    const mockCallClient = new MockCallClient() as unknown as StatefulCallClient;

    const mockCallAgent = new MockCallAgent();
    const locator = { meetingId: '123', passcode: 'qwe' };

    const statefulChatClient = createStatefulChatClientMock(new StubChatThreadClient());
    const threadClient = statefulChatClient.getChatThreadClient('threadId');

    /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
    const options = { credential: stubCommunicationTokenCredential() };
    const args = {
      callClient: mockCallClient,
      callAgent: mockCallAgent,
      callLocator: locator,
      chatClient: statefulChatClient,
      chatThreadClient: threadClient,
      /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
      options: options
    };
    const adapter = await createAzureCommunicationCallWithChatAdapterFromClients(args);
    expect(adapter).toBeDefined();
  });
});
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
/**
 * Stub implementation of CommunicationTokenCredential
 */
export const stubCommunicationTokenCredential = (): CommunicationTokenCredential => {
  return {
    getToken: (): Promise<MockAccessToken> => {
      throw new Error('Not implemented');
    },
    dispose: (): void => {
      /* Nothing to dispose */
    }
  };
};

/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
type MockAccessToken = {
  token: string;
  expiresOnTimestamp: number;
};
