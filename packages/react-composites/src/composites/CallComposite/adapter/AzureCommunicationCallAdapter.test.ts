// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StatefulDeviceManager } from 'calling-stateful-client';
import { createMockStatefulCallClient, waitWithBreakCondition } from '../../../mocks';
import { AzureCommunicationCallAdapter } from './AzureCommunicationCallAdapter';

const DISPOSE_ERROR_MESSAGE = 'dispose error';

describe('AzureCommunicationCallAdapter', () => {
  test('emits error event when error happens', async () => {
    let error: Error | undefined;
    const errorListener = (e: Error): void => {
      error = e;
    };

    const statefulCallClient = createMockStatefulCallClient(
      undefined,
      {
        dispose: () => {
          throw new Error(DISPOSE_ERROR_MESSAGE);
        }
      },
      undefined,
      undefined
    );
    const callAgent = await statefulCallClient.createCallAgent({
      getToken: (): Promise<any> => {
        return Promise.resolve('');
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      dispose: () => {}
    });
    const deviceManager = await statefulCallClient.getDeviceManager();
    const adapter = new AzureCommunicationCallAdapter(
      statefulCallClient,
      { groupId: '' },
      callAgent,
      deviceManager as StatefulDeviceManager
    );
    adapter.on('error', errorListener);

    adapter.dispose();

    waitWithBreakCondition(() => error !== undefined);

    expect(error?.message).toBe(DISPOSE_ERROR_MESSAGE);
    expect(adapter.getState().error?.message).toBe(DISPOSE_ERROR_MESSAGE);
  });
});
