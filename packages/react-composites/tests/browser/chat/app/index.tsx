// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { ChatAdapter, createAzureCommunicationChatAdapter, ChatComposite } from '../../../../src';
import { IDS } from '../../config';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

const displayName = params.displayName;
const token = params.token;
const endpointUrl = params.endpointUrl;
const threadId = params.threadId;
const userId = params.userId;

function App(): JSX.Element {
  const [chatAdapter, setChatAdapter] = useState<ChatAdapter | undefined>(undefined);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      setChatAdapter(
        await createAzureCommunicationChatAdapter(
          endpointUrl,
          { kind: 'communicationUser', communicationUserId: userId },
          displayName,
          new AzureCommunicationTokenCredential(token),
          threadId
        )
      );
    };

    initialize();

    return () => chatAdapter && chatAdapter.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {chatAdapter && <ChatComposite identifiers={IDS} adapter={chatAdapter} options={{ showParticipantPane: true }} />}
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
