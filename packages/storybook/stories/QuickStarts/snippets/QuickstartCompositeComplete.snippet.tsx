import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
  CallComposite,
  CallAdapter,
  createAzureCommunicationCallAdapter,
  ChatComposite,
  ChatAdapter,
  createAzureCommunicationChatAdapter
} from '@azure/communication-react';
import React, { useState, useEffect } from 'react';

function App(): JSX.Element {
  const endpointUrl = '<Azure Communication Services Resource Endpoint>';
  const userId = '<Azure Communication Services Identifier>';
  const displayName = '<Display Name>';
  const token = '<Azure Communication Services Access Token>';

  //Calling Variables
  //For Group Id, developers can pass any GUID they can generate
  const groupId = '<Developer generated GUID>';
  const [callAdapter, setCallAdapter] = useState<CallAdapter>();

  //Chat Variables
  const threadId = '<Get thread id from chat service>';
  const [chatAdapter, setChatAdapter] = useState<ChatAdapter>();

  useEffect(() => {
    const createAdapter = async (): Promise<void> => {
      setChatAdapter(
        await createAzureCommunicationChatAdapter(
          endpointUrl,
          { kind: 'communicationUser', communicationUserId: userId },
          displayName,
          new AzureCommunicationTokenCredential(token),
          threadId
        )
      );
      setCallAdapter(
        await createAzureCommunicationCallAdapter(
          { kind: 'communicationUser', communicationUserId: userId },
          displayName,
          new AzureCommunicationTokenCredential(token),
          { groupId }
        )
      );
    };
    createAdapter();
  }, []);

  return (
    <>
      {chatAdapter && <ChatComposite adapter={chatAdapter} />}
      {callAdapter && <CallComposite adapter={callAdapter} />}
    </>
  );
}

export default App;
