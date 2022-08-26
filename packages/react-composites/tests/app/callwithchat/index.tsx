// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';

import { _IdentifierProvider } from '@internal/react-components';
import {
  CallWithChatAdapter,
  CallWithChatAdapterState,
  CallWithChatComposite,
  useAzureCommunicationCallWithChatAdapter
} from '../../../src';
import { IDS } from '../../browser/common/constants';
import { initializeIconsForUITests, isMobile, verifyParamExists } from '../../browser/common/testAppUtils';
import memoizeOne from 'memoize-one';
import { fromFlatCommunicationIdentifier } from '@internal/acs-ui-common';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

// Required params
const displayName = verifyParamExists(params.displayName, 'displayName');
const token = verifyParamExists(params.token, 'token');
const groupId = verifyParamExists(params.groupId, 'groupId');
const userId = verifyParamExists(params.userId, 'userId');
const endpoint = verifyParamExists(params.endpointUrl, 'endpointUrl');
const threadId = verifyParamExists(params.threadId, 'threadId');

initializeIconsForUITests();

function App(): JSX.Element {
  const userIdArg = useMemo(() => fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier, []);
  const locator = useMemo(
    () => ({
      callLocator: { groupId: groupId },
      chatThreadId: threadId
    }),
    []
  );
  const credential = useMemo(() => new AzureCommunicationTokenCredential(token), []);
  const adapter = useAzureCommunicationCallWithChatAdapter(
    {
      userId: userIdArg,
      displayName,
      credential,
      endpoint,
      locator
    },
    wrapAdapterForTests
  );

  if (!token) {
    return <h3>ERROR: No token set.</h3>;
  } else if (!displayName) {
    return <h3>ERROR: No Display name set.</h3>;
  } else if (!groupId) {
    return <h3>ERROR: No groupId set.</h3>;
  } else if (!userId) {
    return <h3>ERROR: No userId set.</h3>;
  } else if (!endpoint) {
    return <h3>ERROR: No endpoint set.</h3>;
  } else if (!threadId) {
    return <h3>ERROR: No threadId set.</h3>;
  } else if (!adapter) {
    return <h3>Initializing call and chat adapters...</h3>;
  }

  return (
    <>
      {!adapter && 'Initializing call-with-chat adapter...'}
      {adapter && (
        <div style={{ position: 'fixed', width: '100%', height: '100%' }}>
          <_IdentifierProvider identifiers={IDS}>
            <CallWithChatComposite
              adapter={adapter}
              formFactor={isMobile() ? 'mobile' : 'desktop'}
              joinInvitationURL={window.location.href}
            />
          </_IdentifierProvider>
        </div>
      )}
    </>
  );
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

ReactDOM.render(<App />, document.getElementById('root'));
