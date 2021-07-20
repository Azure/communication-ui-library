// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { CallAdapter, createAzureCommunicationCallAdapter, CallComposite } from '../../../../src';
import { IDS } from '../../config';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

const displayName = params.displayName;
const token = params.token;
const groupId = params.groupId;
const userId = params.userId;
// const customDataModel = params.customDataModel;

function App(): JSX.Element {
  const [callAdapter, setCallAdapter] = useState<CallAdapter | undefined>(undefined);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      setCallAdapter(
        await createAzureCommunicationCallAdapter(
          { kind: 'communicationUser', communicationUserId: userId },
          displayName,
          new AzureCommunicationTokenCredential(token),
          { groupId: groupId }
        )
      );
    };

    initialize();

    return () => callAdapter && callAdapter.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: 'fixed', width: '100%', height: '100%' }}>
      {callAdapter && <CallComposite identifiers={IDS} adapter={callAdapter} />}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
