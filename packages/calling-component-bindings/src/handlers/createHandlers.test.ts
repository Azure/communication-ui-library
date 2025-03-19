// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallAgent, CallAgentOptions, DeviceManager } from '@azure/communication-calling';
import { CommunicationTokenCredential } from '@azure/communication-common';
import { ReactElement } from 'react';
import { createDefaultCallingHandlersForComponent } from './createDefaultCallingHandlersForComponent';
import { StatefulCallClient, CreateViewResult } from '@internal/calling-stateful-client';
import { CallingHandlers } from './createHandlers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TestCallClientComponent(props: CallingHandlers): ReactElement | null {
  return null;
}

class MockCallClient {
  getState(): any {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStateChange(handler: (state: any) => void): void {
    throw new Error('Method not implemented.');
  }
  createView(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    callId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    participantId: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    stream: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: any
  ): Promise<CreateViewResult | undefined> {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  disposeView(callId: string, participantId: any, stream: any): void {
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
    const handlers = createDefaultCallingHandlersForComponent(
      new MockCallClient() as StatefulCallClient,
      undefined,
      undefined,
      undefined,
      TestCallClientComponent
    );
    expect(handlers).toBeDefined();
    expect(Object.keys(handlers).length > 0).toBe(true);
  });
});
