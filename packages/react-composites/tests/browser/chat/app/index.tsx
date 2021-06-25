// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { ChatAdapter, createAzureCommunicationChatAdapter, ChatComposite } from '../../../src';

import { createUserAndThread } from './identity';

const connectionString = process.env.CONNECTION_STRING;

function App(): JSX.Element {
  const [displayName, setDisplayName] = useState('John Doe');
  const [chatAdapter, setChatAdapter] = useState<ChatAdapter | undefined>(undefined);

  useEffect(() => {
    const initialize = async () => {
      const data = await createUserAndThread(connectionString, 'Test Chat', [displayName]);
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
  }, []);

  return <>{chatAdapter && <ChatComposite adapter={chatAdapter} />}</>;
}

ReactDOM.render(<App />, document.getElementById('root'));
