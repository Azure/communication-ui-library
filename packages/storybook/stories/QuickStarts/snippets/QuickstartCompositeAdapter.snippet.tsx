import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAdapter,
  createAzureCommunicationCallAdapter,
  ChatAdapter,
  createAzureCommunicationChatAdapter,
  fromFlatCommunicationIdentifier
} from '@azure/communication-react';
import React, { useEffect, useMemo, useState } from 'react';

type CompositeProps = {
  userId: string; // '<Azure Communication Services Identifier>'
  token: string; // '<Azure Communication Services Access Token>'
  endpoint: string; // '<Azure Communication Services Resource Endpoint>'
  displayName: string; // '<Display Name>'
  callId: string; // '<Developer generated GUID>'
  threadId: string; // '<Get thread id from chat service>'
};

const compositeProps: CompositeProps = {
  displayName: '<Display Name>',
  userId: '<Azure Communication Services Identifier>',
  token: '<Azure Communication Services Access Token>',
  endpoint: '<Azure Communication Services Resource Endpoint>',
  threadId: '<Get thread id from chat service>',
  callId: '<Developer generated GUID>'
};

function App(): JSX.Element {
  // Deconstruct the input props object
  const { userId, token, endpoint, displayName, callId, threadId } = compositeProps;

  //Calling Variables
  const [callAdapter, setCallAdapter] = useState<CallAdapter>();

  //Chat Variables
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
            endpoint: endpoint,
            userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
            displayName: displayName,
            credential,
            threadId: threadId
          })
        );
        setCallAdapter(
          await createAzureCommunicationCallAdapter({
            userId: fromFlatCommunicationIdentifier(compositeProps.userId) as CommunicationUserIdentifier,
            displayName: displayName,
            credential: credential,
            locator: { meetingLink: callId }
          })
        );
      };
      createAdapter(credential);
    }
  }, [credential, displayName, endpoint, callId, threadId, userId]);

  if (!!callAdapter && !!chatAdapter) {
    return <h1>Hooray! You set up adapters 🎉🎉🎉</h1>;
  }
  if (credential === undefined) {
    return <h3>Failed to construct credential. Provided token is malformed.</h3>;
  }
  return <h3>Initializing...</h3>;
}

export default App;
