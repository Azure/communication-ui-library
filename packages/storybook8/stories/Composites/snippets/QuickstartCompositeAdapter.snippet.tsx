import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  fromFlatCommunicationIdentifier,
  useAzureCommunicationCallAdapter,
  useAzureCommunicationChatAdapter
} from '@azure/communication-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Authentication information needed for your client application to use
 * Azure Communication Services.
 *
 * For this quickstart, you can obtain these from the Azure portal as described here:
 * https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/identity/quick-create-identity
 *
 * In a real application, your backend service would provide these to the client
 * application after the user goes through your authentication flow.
 */
const ENDPOINT_URL = '<Azure Communication Services Resource Endpoint>';
const USER_ID = '<Azure Communication Services Identifier>';
const TOKEN = '<Azure Communication Services Access Token>';

/**
 * Display name for the local participant.
 * In a real application, this would be part of the user data that your
 * backend services provides to the client application after the user
 * goes through your authentication flow.
 */
const DISPLAY_NAME = '<Display Name>';

/**
 * Entry point of your application.
 */
function App(): JSX.Element {
  // Arguments that would usually be provided by your backend service or
  // (indirectly) by the user.
  const { endpointUrl, userId, token, displayName, groupId, threadId } = useAzureCommunicationServiceArgs();

  // A well-formed token is required to initialize the chat and calling adapters.
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [token]);

  // Memoize arguments to `useAzureCommunicationCallAdapter` so that
  // a new adapter is only created when an argument changes.
  const callAdapterArgs = useMemo(
    () => ({
      userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
      displayName,
      credential,
      locator: { groupId }
    }),
    [userId, credential, displayName, groupId]
  );
  const callAdapter = useAzureCommunicationCallAdapter(callAdapterArgs);

  // Memoize arguments to `useAzureCommunicationChatAdapter` so that
  // a new adapter is only created when an argument changes.
  const chatAdapterArgs = useMemo(
    () => ({
      endpoint: endpointUrl,
      userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
      displayName,
      credential,
      threadId
    }),
    [endpointUrl, userId, displayName, credential, threadId]
  );
  const chatAdapter = useAzureCommunicationChatAdapter(chatAdapterArgs);

  if (!!callAdapter && !!chatAdapter) {
    return <h1>Hooray! You set up adapters 🎉🎉🎉</h1>;
  }
  if (credential === undefined) {
    return <h3>Failed to construct credential. Provided token is malformed.</h3>;
  }
  return <h3>Initializing...</h3>;
}

/**
 * This hook returns all the arguments required to use the Azure Communication services
 * that would be provided by your backend service after user authentication
 * depending on the user-flow (e.g. which chat thread to use).
 */
function useAzureCommunicationServiceArgs(): {
  endpointUrl: string;
  userId: string;
  token: string;
  displayName: string;
  groupId: string;
  threadId: string;
} {
  const [threadId, setThreadId] = useState('');
  // For the quickstart, create a new thread with just the local participant in it.
  useEffect(() => {
    (async () => {
      const client = new ChatClient(ENDPOINT_URL, new AzureCommunicationTokenCredential(TOKEN));
      const { chatThread } = await client.createChatThread(
        {
          topic: 'Composites Quickstarts'
        },
        {
          participants: [
            {
              id: fromFlatCommunicationIdentifier(USER_ID),
              displayName: DISPLAY_NAME
            }
          ]
        }
      );
      setThreadId(chatThread?.id ?? '');
    })();
  }, []);

  // For the quickstart, generate a random group ID.
  // The group Id must be a UUID.
  const groupId = useRef(uuidv4());

  return {
    endpointUrl: ENDPOINT_URL,
    userId: USER_ID,
    token: TOKEN,
    displayName: DISPLAY_NAME,
    groupId: groupId.current,
    threadId
  };
}

export default App;
