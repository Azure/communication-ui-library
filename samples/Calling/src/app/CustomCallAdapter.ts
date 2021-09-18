// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  AzureCommunicationCallAdapterArgs,
  CallAdapter,
  CallAdapterState,
  createAzureCommunicationCallAdapter
} from '@azure/communication-react';
import { produce } from 'immer';

const showBotExclusively = (state: CallAdapterState): CallAdapterState => {
  if (!state.call) return state;
  const participants = state.call?.remoteParticipants;
  if (!participants) return state;

  let botId: string | undefined;
  for (const p of Object.keys(participants)) {
    if (p.startsWith('28:')) {
      botId = p;
      break;
    }
  }
  if (!botId) return state;

  const newState = produce(state, (draft) => {
    if (!botId || !draft.call) return;
    const botOnly = {};
    botOnly[botId] = participants[botId];
    draft.call.remoteParticipants = botOnly;
  });
  return newState;
};

const proxyCallAdapter: ProxyHandler<CallAdapter> = {
  get: <P extends keyof CallAdapter>(target: CallAdapter, prop: P) => {
    switch (prop) {
      case `onStateChange`: {
        return function (...args: Parameters<CallAdapter['onStateChange']>) {
          target.onStateChange((state) => args[0](showBotExclusively(state)));
        };
      }
      default:
        return Reflect.get(target, prop);
    }
  }
};

export const createCustomAdapter = async (args: AzureCommunicationCallAdapterArgs): Promise<CallAdapter> => {
  const azureAdapter = await createAzureCommunicationCallAdapter(args);
  return new Proxy(azureAdapter, proxyCallAdapter);
};
