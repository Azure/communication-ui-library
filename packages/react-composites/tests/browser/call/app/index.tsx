// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { _IdentifierProvider } from '@internal/react-components';
import {
  CallAdapter,
  createAzureCommunicationCallAdapter,
  CallComposite,
  CompositeLocale,
  COMPOSITE_LOCALE_FR_FR,
  COMPOSITE_LOCALE_EN_US
} from '../../../../src';
import { IDS } from '../../common/config';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

const displayName = params.displayName;
const token = params.token;
const groupId = params.groupId;
const userId = params.userId;
const useFrLocale = Boolean(params.useFrlocale);
const showCallDescription = Boolean(params.showCallDescription);
// const customDataModel = params.customDataModel;

function App(): JSX.Element {
  const [callAdapter, setCallAdapter] = useState<CallAdapter | undefined>(undefined);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      setCallAdapter(
        await createAzureCommunicationCallAdapter({
          userId: { kind: 'communicationUser', communicationUserId: userId },
          displayName,
          credential: new AzureCommunicationTokenCredential(token),
          locator: { groupId: groupId }
        })
      );
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
        {callAdapter && <CallComposite adapter={callAdapter} locale={locale} />}
      </_IdentifierProvider>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
