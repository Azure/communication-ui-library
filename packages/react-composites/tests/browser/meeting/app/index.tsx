// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { _IdentifierProvider } from '@internal/react-components';
import {
  MeetingAdapter,
  MeetingAdapterState,
  createAzureCommunicationMeetingAdapter,
  MeetingComposite
} from '../../../../src';
import { IDS } from '../../common/constants';
import { isMobile, verifyParamExists } from '../../common/testAppUtils';
import memoizeOne from 'memoize-one';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

// Required params
const displayName = verifyParamExists(params.displayName, 'displayName');
const token = verifyParamExists(params.token, 'token');
const groupId = verifyParamExists(params.groupId, 'groupId');
const userId = verifyParamExists(params.userId, 'userId');
const endpointUrl = verifyParamExists(params.endpointUrl, 'endpointUrl');
const threadId = verifyParamExists(params.threadId, 'threadId');

function App(): JSX.Element {
  const [meetingAdapter, setMeetingAdapter] = useState<MeetingAdapter>(undefined);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      const credential = new AzureCommunicationTokenCredential(token);
      const adapter = await createAzureCommunicationMeetingAdapter({
        userId: { communicationUserId: userId },
        displayName,
        credential,
        callLocator: { groupId: groupId },
        endpointUrl,
        chatThreadId: threadId
      });
      setMeetingAdapter(wrapAdapterForTests(adapter));
    };

    initialize();

    return () => {
      meetingAdapter && meetingAdapter.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!token) return <h3>ERROR: No token set.</h3>;
  else if (!displayName) return <h3>ERROR: No Display name set.</h3>;
  else if (!groupId) return <h3>ERROR: No groupId set.</h3>;
  else if (!userId) return <h3>ERROR: No userId set.</h3>;
  else if (!endpointUrl) return <h3>ERROR: No endpointUrl set.</h3>;
  else if (!threadId) return <h3>ERROR: No threadId set.</h3>;
  else if (!meetingAdapter) return <h3>Initializing meeting adapters...</h3>;

  return (
    <div style={{ position: 'fixed', width: '100%', height: '100%' }}>
      <_IdentifierProvider identifiers={IDS}>
        {meetingAdapter && <MeetingComposite meetingAdapter={meetingAdapter} options={{ mobileView: isMobile() }} />}
      </_IdentifierProvider>
    </div>
  );
}

const wrapAdapterForTests = (adapter: MeetingAdapter): MeetingAdapter => {
  return new Proxy(adapter, new ProxyMeetingAdapter());
};

class ProxyMeetingAdapter implements ProxyHandler<MeetingAdapter> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public get<P extends keyof MeetingAdapter>(target: MeetingAdapter, prop: P): any {
    switch (prop) {
      case 'getState': {
        return (...args: Parameters<MeetingAdapter['getState']>) => {
          const state = target.getState(...args);
          return memoizedUnsetSpeakingWhileMicrophoneIsMuted(state);
        };
      }
      case 'onStateChange': {
        return (...args: Parameters<MeetingAdapter['onStateChange']>) => {
          const [handler] = args;
          return target.onStateChange((state) => handler(memoizedUnsetSpeakingWhileMicrophoneIsMuted(state)));
        };
      }
      case 'offStateChange': {
        return (...args: Parameters<MeetingAdapter['offStateChange']>) => {
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
const unsetSpeakingWhileMicrophoneIsMuted = (state: MeetingAdapterState): MeetingAdapterState => {
  if (state.meeting?.diagnostics.media.latest.speakingWhileMicrophoneIsMuted) {
    return {
      ...state,
      meeting: {
        ...state.meeting,
        diagnostics: {
          ...state.meeting.diagnostics,
          media: { latest: { ...state.meeting.diagnostics.media.latest, speakingWhileMicrophoneIsMuted: undefined } }
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
