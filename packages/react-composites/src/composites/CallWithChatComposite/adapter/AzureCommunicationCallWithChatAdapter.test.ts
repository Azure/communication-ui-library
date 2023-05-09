// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { CommunicationTokenCredential } from '@azure/communication-common';
import { StubChatThreadClient, createStatefulChatClientMock } from '../../ChatComposite/adapter/StubChatClient';
import { createAzureCommunicationCallWithChatAdapterFromClients } from './AzureCommunicationCallWithChatAdapter';
import { MockCallClient, MockCallAgent } from './TestUtils';
import { StatefulCallClient } from '@internal/calling-stateful-client';
jest.mock('@azure/communication-calling');

describe('Adapter is created as expected', () => {
  it('when creating a new adapter from stateful client', async () => {
    const mockCallClient = new MockCallClient() as StatefulCallClient;

    const mockCallAgent = new MockCallAgent();
    const locator = { meetingLink: 'someTeamsMeetingLink' };

    const statefulChatClient = createStatefulChatClientMock(new StubChatThreadClient());
    const threadClient = statefulChatClient.getChatThreadClient('threadId');

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
/**
 * @returns
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
