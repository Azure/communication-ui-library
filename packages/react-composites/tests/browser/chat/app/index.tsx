// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { ChatAdapter, createAzureCommunicationChatAdapter, ChatComposite } from '../../../../src';

import { createUserAndThread } from './identity';

const connectionString = process.env.CONNECTION_STRING;

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

const displayName = params.displayName ?? 'John Doe';
const topic = params.topic ?? 'Test Topic';

function App(): JSX.Element {
  const [chatAdapter, setChatAdapter] = useState<ChatAdapter | undefined>(undefined);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      const data = await createUserAndThread(connectionString, topic, [displayName]);
      setChatAdapter(
        await createAzureCommunicationChatAdapter(
          data[0].userId,
          data[0].token,
          data[0].endpointUrl,
          data[0].threadId,
          displayName
        )
      );
    };

    initialize();

    return () => chatAdapter && chatAdapter.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{chatAdapter && <ChatComposite adapter={chatAdapter} />}</>;
}

ReactDOM.render(<App />, document.getElementById('root'));
