// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import React, { useState, useEffect } from 'react';

import { CallAdapter, CallAdapterState, createAzureCommunicationCallAdapter } from '../../../src';
import { verifyParamExists } from '../lib/utils';
import memoizeOne from 'memoize-one';
import { fromFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { QueryArgs } from './QueryArgs';
import { BaseApp } from './BaseApp';

/** @internal */
export function LiveApp(props: { queryArgs: QueryArgs }): JSX.Element {
  const { queryArgs } = props;
  const [callAdapter, setCallAdapter] = useState<CallAdapter | undefined>(undefined);

  useEffect(() => {
    (async (): Promise<void> => {
      setCallAdapter(wrapAdapterForTests(await createCallAdapterWithCredentials(queryArgs)));
    })();

    return () => {
      callAdapter && callAdapter.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryArgs]);

  return <BaseApp queryArgs={queryArgs} callAdapter={callAdapter} />;
}

const wrapAdapterForTests = (adapter: CallAdapter): CallAdapter => {
  return new Proxy(adapter, new ProxyCallAdapter());
};

class ProxyCallAdapter implements ProxyHandler<CallAdapter> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public get<P extends keyof CallAdapter>(target: CallAdapter, prop: P): any {
    switch (prop) {
      case 'getState': {
        return (...args: Parameters<CallAdapter['getState']>) => {
          const state = target.getState(...args);
          return memoizedUnsetSpeakingWhileMicrophoneIsMuted(state);
        };
      }
      case 'onStateChange': {
        return (...args: Parameters<CallAdapter['onStateChange']>) => {
          const [handler] = args;
          return target.onStateChange((state) => handler(memoizedUnsetSpeakingWhileMicrophoneIsMuted(state)));
        };
      }
      case 'offStateChange': {
        return (...args: Parameters<CallAdapter['offStateChange']>) => {
          const [handler] = args;
          return target.offStateChange((state) => handler(memoizedUnsetSpeakingWhileMicrophoneIsMuted(state)));
        };
      }
      default:
        return Reflect.get(target, prop);
    }
  }
}

// This diagnostic gets flakily set to true only in our test harness.
// The suspected reason is due to flakiness in how chrome handles the `--mute-audio` CLI flag.
const unsetSpeakingWhileMicrophoneIsMuted = (state: CallAdapterState): CallAdapterState => {
  if (state.call?.diagnostics.media.latest.speakingWhileMicrophoneIsMuted) {
    return {
      ...state,
      call: {
        ...state.call,
        diagnostics: {
          ...state.call.diagnostics,
          media: { latest: { ...state.call.diagnostics.media.latest, speakingWhileMicrophoneIsMuted: undefined } }
        }
      }
    };
  }
  return state;
};

/**
 * It is essential to memoize this function.
 *
 * This function is called from both `getState` and `onStateChange`. Each time, *a new state object is returned.
 * If we don't memoize it, business logic that depends on both `getState` and `onStateChange` is returned
 * differnt objects even though there is no change in the underlying state. This causes spurious renders / render loops.
 */
const memoizedUnsetSpeakingWhileMicrophoneIsMuted = memoizeOne(unsetSpeakingWhileMicrophoneIsMuted);

// Function to create call adapter using createAzureCommunicationCallAdapter
const createCallAdapterWithCredentials = async (queryArgs: QueryArgs): Promise<CallAdapter> => {
  const displayName = verifyParamExists(queryArgs.displayName, 'displayName');
  const token = verifyParamExists(queryArgs.token, 'token');
  const groupId = verifyParamExists(queryArgs.groupId, 'groupId');
  const userId = verifyParamExists(queryArgs.userId, 'userId');

  const callAdapter = await createAzureCommunicationCallAdapter({
    userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
    displayName,
    credential: new AzureCommunicationTokenCredential(token),
    locator: { groupId: groupId }
  });
  return callAdapter;
};
