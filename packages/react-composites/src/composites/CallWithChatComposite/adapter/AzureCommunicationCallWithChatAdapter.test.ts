// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* @conditional-compile-remove(teams-inline-images) */
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

    /* @conditional-compile-remove(teams-inline-images) */
    const options = { credential: stubCommunicationTokenCredential() };
    const args = {
      callClient: mockCallClient,
      callAgent: mockCallAgent,
      callLocator: locator,
      chatClient: statefulChatClient,
      chatThreadClient: threadClient,
      /* @conditional-compile-remove(teams-inline-images) */
      options: options
    };
    const adapter = await createAzureCommunicationCallWithChatAdapterFromClients(args);
    expect(adapter).toBeDefined();
  });
});
/* @conditional-compile-remove(teams-inline-images) */
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

/* @conditional-compile-remove(teams-inline-images) */
type MockAccessToken = {
  token: string;
  expiresOnTimestamp: number;
};
