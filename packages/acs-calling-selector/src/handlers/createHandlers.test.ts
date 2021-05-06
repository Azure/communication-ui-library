// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallAgent, CallAgentOptions, DeviceManager } from '@azure/communication-calling';
import { CommunicationTokenCredential } from '@azure/communication-common';
import { ReactElement } from 'react';
import { DefaultHandlers, createDefaultHandlersForComponent } from './createHandlers';
import { DeclarativeCallClient } from '@azure/acs-calling-declarative';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TestCallClientComponent(props: DefaultHandlers): ReactElement | null {
  return null;
}

class MockCallClient {
  state: any;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStateChange(handler: (state: any) => void): void {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startRenderVideo(callId: string, stream: any, options?: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  stopRenderVideo(callId: string, stream: any): void {
    throw new Error('Method not implemented.');
  }
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
      new MockCallClient() as DeclarativeCallClient,
      undefined,
      undefined,
      undefined,
      TestCallClientComponent
    );
    console.log(handlers);
    expect(handlers).toBeDefined();
    expect(Object.keys(handlers).length > 0).toBe(true);
  });
});
