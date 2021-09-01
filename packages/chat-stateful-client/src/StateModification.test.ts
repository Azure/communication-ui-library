// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClientState } from './ChatClientState';
import { ChatStateModifier } from './StatefulChatClient';
import { createStatefulChatClientMock, StateChangeListener } from './TestHelpers';

describe('StateChatClient.modifyState should', () => {
  test('modify state on success', () => {
    const modifier: ChatStateModifier = (state: ChatClientState): void => {
      state.userId = { kind: 'communicationUser', communicationUserId: 'newUser' };
    };

    const client = createStatefulChatClientMock();
    const listener = new StateChangeListener(client);

    client.modifyState(modifier);
    expect(listener.onChangeCalledCount).toBe(1);
    expect(client.getState().userId).toEqual({ kind: 'communicationUser', communicationUserId: 'newUser' });
  });

  test('leave state unchanged on failure', () => {
    const modifier: ChatStateModifier = (state: ChatClientState): void => {
      throw new Error('injected error');
    };

    const client = createStatefulChatClientMock();
    const priorUserId = client.getState().userId;
    const listener = new StateChangeListener(client);

    expect(() => {
      client.modifyState(modifier);
    }).toThrow(new Error('injected error'));
    expect(listener.onChangeCalledCount).toBe(0);
    expect(client.getState().userId).toEqual(priorUserId);
  });
});
