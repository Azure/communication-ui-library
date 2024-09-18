// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import React, { useMemo } from 'react';

import { _IdentifierProvider } from '@internal/react-components';
import { CallWithChatAdapter, CallWithChatAdapterState, useAzureCommunicationCallWithChatAdapter } from '../../../src';
import memoizeOne from 'memoize-one';
import { fromFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { CommonQueryArgs, LiveQueryArgs, QueryArgs } from './QueryArgs';
import { BaseApp } from './BaseApp';

/** @private */
export function LiveApp(props: { queryArgs: QueryArgs }): JSX.Element {
  const { queryArgs: args } = props;
  if (hasRequiredParams(args)) {
    return <LiveAppImpl queryArgs={args} />;
  }
  const missingParams = missingRequiredParams(args);
  return <h3>ERROR: Required parameters {missingParams.join(', ')} not set.</h3>;
}

function LiveAppImpl(props: { queryArgs: CommonQueryArgs & LiveQueryArgs }): JSX.Element {
  const { queryArgs: args } = props;
  const userIdArg = useMemo(
    () => fromFlatCommunicationIdentifier(args.userId) as CommunicationUserIdentifier,
    [args.userId]
  );
  const locator = useMemo(
    () => ({
      callLocator: { groupId: args.groupId },
      chatThreadId: args.threadId
    }),
    [args.groupId, args.threadId]
  );
  const credential = useMemo(() => new AzureCommunicationTokenCredential(args.token), [args.token]);
  const adapter = useAzureCommunicationCallWithChatAdapter(
    {
      userId: userIdArg,
      displayName: args.displayName,
      credential,
      endpoint: args.endpoint,
      locator,
      alternateCallerId: '+182927203720'
    },
    wrapAdapterForTests
  );
  return <BaseApp queryArgs={args} adapter={adapter} />;
}

function hasRequiredParams(args: QueryArgs): args is LiveQueryArgs & CommonQueryArgs {
  return missingRequiredParams(args).length === 0;
}

const wrapAdapterForTests = async (adapter: CallWithChatAdapter): Promise<CallWithChatAdapter> => {
  return new Proxy(adapter, new ProxyCallWithChatAdapter());
};

class ProxyCallWithChatAdapter implements ProxyHandler<CallWithChatAdapter> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public get<P extends keyof CallWithChatAdapter>(target: CallWithChatAdapter, prop: P): any {
    switch (prop) {
      case 'getState': {
        return (...args: Parameters<CallWithChatAdapter['getState']>) => {
          const state = target.getState(...args);
          return memoizedUnsetSpeakingWhileMicrophoneIsMuted(state);
        };
      }
      case 'onStateChange': {
        return (...args: Parameters<CallWithChatAdapter['onStateChange']>) => {
          const [handler] = args;
          return target.onStateChange((state) => handler(memoizedUnsetSpeakingWhileMicrophoneIsMuted(state)));
        };
      }
      case 'offStateChange': {
        return (...args: Parameters<CallWithChatAdapter['offStateChange']>) => {
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
const unsetSpeakingWhileMicrophoneIsMuted = (state: CallWithChatAdapterState): CallWithChatAdapterState => {
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

function missingRequiredParams(args: QueryArgs): string[] {
  const missing: string[] = [];
  if (!args.displayName) {
    missing.push('displayName');
  }
  if (!args.endpoint) {
    missing.push('endpoint');
  }
  if (!args.groupId) {
    missing.push('groupId');
  }
  if (!args.threadId) {
    missing.push('threadId');
  }
  if (!args.token) {
    missing.push('token');
  }
  if (!args.userId) {
    missing.push('userId');
  }
  return missing;
}
