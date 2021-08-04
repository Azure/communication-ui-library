import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
  CallAdapter,
  createAzureCommunicationCallAdapter,
  ChatAdapter,
  createAzureCommunicationChatAdapter
} from '@azure/communication-react';
import React, { useEffect, useMemo, useState } from 'react';

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

  // We can't even initialize the Chat and Call adapters without a well-formed token.
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [token]);

  useEffect(() => {
    if (credential !== undefined) {
      const createAdapter = async (credential: AzureCommunicationTokenCredential): Promise<void> => {
        setChatAdapter(
          await createAzureCommunicationChatAdapter({
            endpointUrl,
            userId: { kind: 'communicationUser', communicationUserId: userId },
            displayName,
            credential,
            threadId
          })
        );
        setCallAdapter(
          await createAzureCommunicationCallAdapter({
            userId: { kind: 'communicationUser', communicationUserId: userId },
            displayName,
            credential,
            locator: { groupId }
          })
        );
      };
      createAdapter(credential);
    }
  }, [credential]);

  if (!!callAdapter && !!chatAdapter) {
    return <h1>Hooray! You set up adapters 🎉🎉🎉</h1>;
  }
  if (credential === undefined) {
    return <h3>Failed to construct credential. Provided token is malformed.</h3>;
  }
  return <h3>Initializing...</h3>;
}

export default App;
