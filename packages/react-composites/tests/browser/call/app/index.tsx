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
import { LatestMediaDiagnostics, MediaDiagnostics } from '@azure/communication-calling';

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
// const customDataModel = params.customDataModel;

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

  let locale: CompositeLocale;
  if (useFrLocale) {
    locale = COMPOSITE_LOCALE_FR_FR;
  } else if (showCallDescription) {
    locale = COMPOSITE_LOCALE_EN_US;
    locale.strings.call.configurationPageCallDetails =
      'Some details about the call that span more than one line - many, many lines in fact. Who would want fewer lines than many, many lines? Could you even imagine?! 😲';
  }

  return (
    <div style={{ position: 'fixed', width: '100%', height: '100%' }}>
      <_IdentifierProvider identifiers={IDS}>
        {callAdapter && <CallComposite adapter={callAdapter} locale={locale} options={{ mobileView: isMobile() }} />}
      </_IdentifierProvider>
    </div>
  );
}

const wrapAdapterForTests = (adapter: CallAdapter): CallAdapter => {
  return new Proxy(adapter, new ProxyCallAdapter());
};

class ProxyCallAdapter implements ProxyHandler<CallAdapter> {
  public get<P extends keyof CallAdapter>(target: CallAdapter, prop: P): any {
    switch (prop) {
      case 'getState': {
        return (...args: Parameters<CallAdapter['getState']>) => {
          const state = target.getState(...args);
          return unsetSpeakingWhileMicrophoneIsMuted(state);
        };
      }
      case 'onStateChange': {
        return (...args: Parameters<CallAdapter['onStateChange']>) => {
          const [handler] = args;
          return target.onStateChange((state) => handler(unsetSpeakingWhileMicrophoneIsMuted(state)));
        };
      }
      case 'offStateChange': {
        return (...args: Parameters<CallAdapter['offStateChange']>) => {
          const [handler] = args;
          return target.offStateChange((state) => handler(unsetSpeakingWhileMicrophoneIsMuted(state)));
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
  if (state.call?.diagnostics.media.latest) {
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

ReactDOM.render(<App />, document.getElementById('root'));
