// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { IdentifierProvider } from '@internal/react-components';
import {
  CallAdapter,
  ChatAdapter,
  createAzureCommunicationCallAdapter,
  createAzureCommunicationChatAdapter,
  MeetingComposite
} from '../../../../src';
import { IDS } from '../../common/config';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

const displayName = params.displayName;
const token = params.token;
const groupId = params.groupId;
const userId = params.userId;
const endpointUrl = params.endpointUrl;
const threadId = params.threadId;

function App(): JSX.Element {
  const [callAdapter, setCallAdapter] = useState<CallAdapter>(undefined);
  const [chatAdapter, setChatAdapter] = useState<ChatAdapter>(undefined);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      const credential = new AzureCommunicationTokenCredential(token);

      setCallAdapter(
        await createAzureCommunicationCallAdapter({
          userId: { kind: 'communicationUser', communicationUserId: userId },
          displayName,
          credential,
          locator: { groupId: groupId }
        })
      );

      setChatAdapter(
        await createAzureCommunicationChatAdapter({
          userId: { kind: 'communicationUser', communicationUserId: userId },
          displayName,
          credential,
          endpointUrl,
          threadId
        })
      );
    };

    initialize();

    return () => {
      callAdapter && callAdapter.dispose();
      chatAdapter && chatAdapter.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!token) return <h3>ERROR: No token set.</h3>;
  else if (!displayName) return <h3>ERROR: No Display name set.</h3>;
  else if (!groupId) return <h3>ERROR: No groupId set.</h3>;
  else if (!userId) return <h3>ERROR: No userId set.</h3>;
  else if (!endpointUrl) return <h3>ERROR: No endpointUrl set.</h3>;
  else if (!threadId) return <h3>ERROR: No threadId set.</h3>;
  else if (!callAdapter || !callAdapter) return <h3>Initalizing adapters...</h3>;

  return (
    <div style={{ position: 'fixed', width: '100%', height: '100%' }}>
      <IdentifierProvider identifiers={IDS}>
        {callAdapter && chatAdapter && <MeetingComposite chatAdapter={chatAdapter} callAdapter={callAdapter} />}
      </IdentifierProvider>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
