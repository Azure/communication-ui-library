// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import ReactDOM from 'react-dom';

import { _IdentifierProvider } from '@internal/react-components';
import { CallAdapterState, CallComposite, COMPOSITE_LOCALE_FR_FR, COMPOSITE_LOCALE_EN_US } from '../../../../src';
import { IDS } from '../../common/constants';
import { isMobile } from '../../common/testAppUtils';
import memoizeOne from 'memoize-one';
import { IContextualMenuItem, mergeStyles } from '@fluentui/react';
import { MockCallAdapter } from './MockCallAdapter';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

const state = JSON.parse(params.state);

// Optional params
const useFrLocale = Boolean(params.useFrLocale);
const showCallDescription = Boolean(params.showCallDescription);
const injectParticipantMenuItems = Boolean(params.injectParticipantMenuItems);

function App(): JSX.Element {
  const callAdapter = new MockCallAdapter(state);

  const locale = useFrLocale ? COMPOSITE_LOCALE_FR_FR : COMPOSITE_LOCALE_EN_US;
  if (showCallDescription) {
    locale.strings.call.configurationPageCallDetails =
      'Some details about the call that span more than one line - many, many lines in fact. Who would want fewer lines than many, many lines? Could you even imagine?! 😲';
  }

  return (
    <>
      {!callAdapter && 'Initializing call adapter...'}
      {callAdapter && (
        <div style={{ position: 'fixed', width: '100%', height: '100%' }}>
          <_IdentifierProvider identifiers={IDS}>
            <CallComposite
              adapter={callAdapter}
              locale={locale}
              formFactor={isMobile() ? 'mobile' : 'desktop'}
              onFetchParticipantMenuItems={injectParticipantMenuItems ? onFetchParticipantMenuItems : undefined}
            />
          </_IdentifierProvider>
        </div>
      )}
    </>
  );
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
