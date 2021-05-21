import {
  CallAdapter,
  createAzureCommunicationCallAdapter,
  ChatAdapter,
  createAzureCommunicationChatAdapter
} from '@azure/communication-react';
import React, { useState, useEffect } from 'react';

function App(): JSX.Element {
  const endpointUrl = 'ADD ENDPOINT URL FOR AZURE COMMUNICATION SERVICES RESOURCE';
  const displayName = 'ADD DISPLAY NAME';
  const token = 'ADD ACCESS TOKEN WITH VOIP AND CHAT SCOPE';

  //Calling Variables
  const groupId = 'ADD GROUP ID TO JOIN';
  const [, setCallAdapter] = useState<CallAdapter>();

  //Chat Variables
  const threadId = 'ADD THREAD ID TO JOIN';
  const [, setChatAdapter] = useState<ChatAdapter>();

  useEffect(() => {
    const createAdapter = async (): Promise<void> => {
      setChatAdapter(await createAzureCommunicationChatAdapter(token, endpointUrl, threadId, displayName));
      setCallAdapter(await createAzureCommunicationCallAdapter(token, { groupId }, displayName));
    };
    createAdapter();
  });

  return <></>;
}

export default App;
