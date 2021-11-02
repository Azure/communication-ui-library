// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { _IdentifierProvider } from '@internal/react-components';
import {
  CallAdapter,
  CallAdapterState,
  createAzureCommunicationCallAdapter,
  CallComposite,
  CompositeLocale,
  COMPOSITE_LOCALE_FR_FR,
  COMPOSITE_LOCALE_EN_US
} from '../../../../src';
import { IDS } from '../../common/constants';
import { isMobile, verifyParamExists } from '../../common/testAppUtils';
import memoizeOne from 'memoize-one';
import { IContextualMenuItem, mergeStyles } from '@fluentui/react';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

// Required params
const displayName = verifyParamExists(params.displayName, 'displayName');
const token = verifyParamExists(params.token, 'token');
const groupId = verifyParamExists(params.groupId, 'groupId');
const userId = verifyParamExists(params.userId, 'userId');

// Optional params
const useFrLocale = Boolean(params.useFrLocale);
const showCallDescription = Boolean(params.showCallDescription);
const injectParticipantMenuItems = Boolean(params.injectParticipantMenuItems);

function App(): JSX.Element {
  const [callAdapter, setCallAdapter] = useState<CallAdapter | undefined>(undefined);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      const newAdapter = await createAzureCommunicationCallAdapter({
        userId: { communicationUserId: userId },
        displayName,
        credential: new AzureCommunicationTokenCredential(token),
        locator: { groupId: groupId }
      });
      setCallAdapter(wrapAdapterForTests(newAdapter));
    };

    initialize();

    return () => callAdapter && callAdapter.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const locale = useFrLocale ? COMPOSITE_LOCALE_FR_FR : COMPOSITE_LOCALE_EN_US;
  if (showCallDescription) {
    locale.strings.call.configurationPageCallDetails =
      'Some details about the call that span more than one line - many, many lines in fact. Who would want fewer lines than many, many lines? Could you even imagine?! 😲';
  }

  return (
    <div style={{ position: 'fixed', width: '100%', height: '100%' }}>
      <_IdentifierProvider identifiers={IDS}>
        {callAdapter && (
          <CallComposite
            adapter={callAdapter}
            locale={locale}
            options={{ mobileView: isMobile() }}
            onFetchParticipantMenuItems={injectParticipantMenuItems ? onFetchParticipantMenuItems : undefined}
          />
        )}
      </_IdentifierProvider>
    </div>
  );
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

function onFetchParticipantMenuItems(): IContextualMenuItem[] {
  return [
    {
      'data-ui-id': 'test-app-participant-menu-item',
      key: 'theOneWithRedBackground',
      className: mergeStyles({ background: 'red' }),
      href: 'https://bing.com',
      text: 'I feel so blue'
    },
    {
      key: 'shareSplit',
      split: true,
      subMenuProps: {
        items: [
          { key: 'sharetotwittersplit', text: 'Share to Twitter' },
          { key: 'sharetofacebooksplit', text: 'Share to Facebook' }
        ]
      },
      text: 'Share w/ Split'
    }
  ];
}

ReactDOM.render(<App />, document.getElementById('root'));
