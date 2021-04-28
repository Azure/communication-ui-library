// © Microsoft Corporation. All rights reserved.

import { CallAgent, CallAgentOptions, CallClient, DeviceManager } from '@azure/communication-calling';
import { CommunicationTokenCredential } from '@azure/communication-common';
import { ReactElement } from 'react';
import { CallClientHandlers, createDefaultHandlersForComponent } from './createHandlers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TestCallClientComponent(props: CallClientHandlers): ReactElement | null {
  return null;
}

class MockCallClient {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createCallAgent(tokenCredential: CommunicationTokenCredential, options?: CallAgentOptions): Promise<CallAgent> {
    throw new Error('Method not implemented.');
  }
  getDeviceManager(): Promise<DeviceManager> {
    throw new Error('Method not implemented.');
  }
}

describe('createHandlers', () => {
  test('creates handlers when only callClient is passed in and others are undefined', async () => {
    const handlers = createDefaultHandlersForComponent(
      new MockCallClient() as CallClient,
      undefined,
      undefined,
      undefined,
      TestCallClientComponent
    );

    expect(handlers).toBeDefined();
    expect(Object.keys(handlers).length > 0).toBe(true);
  });
});
