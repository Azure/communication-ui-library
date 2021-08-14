// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallClientState } from './CallClientState';
import { CallStateModifier } from './StatefulCallClient';
import { createMockCallAgent, createStatefulCallClientWithAgent, StateChangeListener } from './TestUtils';

describe('StateCallClient.modifyState should', () => {
  test('modify state on success', () => {
    const modifier: CallStateModifier = (state: CallClientState): void => {
      state.userId = { kind: 'communicationUser', communicationUserId: 'newUser' };
    };

    const client = createStatefulCallClientWithAgent(createMockCallAgent());
    const listener = new StateChangeListener(client);

    client.modifyState(modifier);
    expect(listener.onChangeCalledCount).toBe(1);
    expect(client.getState().userId).toEqual({ kind: 'communicationUser', communicationUserId: 'newUser' });
  });

  test('leave state unchanged on failure', () => {
    const modifier: CallStateModifier = (state: CallClientState): void => {
      throw new Error('injected error');
    };

    const client = createStatefulCallClientWithAgent(createMockCallAgent());
    const priorUserId = client.getState().userId;
    const listener = new StateChangeListener(client);

    expect(() => {
      client.modifyState(modifier);
    }).toThrow(new Error('injected error'));
    expect(listener.onChangeCalledCount).toBe(0);
    expect(client.getState().userId).toEqual(priorUserId);
  });
});
