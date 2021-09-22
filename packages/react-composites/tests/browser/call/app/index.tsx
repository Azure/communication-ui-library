// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { IdentifierProvider } from '@internal/react-components';
import {
  CallAdapter,
  createAzureCommunicationCallAdapter,
  CallComposite,
  COMPOSITE_LOCALE_FR_FR
} from '../../../../src';
import { IDS } from '../../config';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

const displayName = params.displayName;
const token = params.token;
const groupId = params.groupId;
const userId = params.userId;
const useFrLocale = Boolean(params.useFrlocale);
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

  return (
    <div style={{ position: 'fixed', width: '100%', height: '100%' }}>
      <IdentifierProvider identifiers={IDS}>
        {callAdapter && (
          <CallComposite adapter={callAdapter} locale={useFrLocale ? COMPOSITE_LOCALE_FR_FR : undefined} />
        )}
      </IdentifierProvider>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
