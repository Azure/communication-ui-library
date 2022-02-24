import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAdapter,
  CallComposite,
  ChatAdapter,
  ChatComposite,
  createAzureCommunicationCallAdapter,
  createAzureCommunicationChatAdapter,
  fromFlatCommunicationIdentifier
} from '@azure/communication-react';
import React, { useEffect, useMemo, useState } from 'react';

// Fill in the following configuration inline for this sample.
// In a real application, these must be supplied securely to the client application.
const DISPLAY_NAME = '<Display Name>';
const ENDPOINT_URL = '<Azure Communication Services Resource Endpoint>';
const TOKEN = '<Azure Communication Services Access Token>';
const USER_ID = '<Azure Communication Services Identifier>';
// CallComposite specific configuration:
// For Group Id, developers can pass any GUID they can generate
const GROUP_ID = '<Developer generated GUID>';
// ChatComposite specific configuration:
const THREAD_ID = '<Get thread id from chat service>';

function App(): JSX.Element {
  // CallComposite and ChatComposite need a well-formed token for initialization.
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(TOKEN);
    } catch {
      return undefined;
    }
  }, []);
  const callAdapter = useCallAdapter(DISPLAY_NAME, GROUP_ID, USER_ID, credential);
  const chatAdapter = useChatAdapter(DISPLAY_NAME, ENDPOINT_URL, THREAD_ID, USER_ID, credential);

  if (!credential) {
    return <h3>Failed to construct credential. Provided token is malformed.</h3>;
  }
  if (!callAdapter || !chatAdapter) {
    return <h3>Initializing...</h3>;
  }
  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <div style={{ width: '50vw' }}>
        <ChatComposite adapter={chatAdapter} />
      </div>
      <div style={{ width: '50vw' }}>
        <CallComposite adapter={callAdapter} />
      </div>
    </div>
  );
}

function useCallAdapter(
  displayName: string,
  groupId: string,
  userId: string,
  credential?: AzureCommunicationTokenCredential
): CallAdapter | undefined {
  const [callAdapter, setCallAdapter] = useState<CallAdapter>();
  useEffect(() => {
    (async (): Promise<void> => {
      credential &&
        setCallAdapter(
          await createAzureCommunicationCallAdapter({
            credential,
            displayName,
            locator: { groupId },
            userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier
          })
        );
    })();
  }, [credential, displayName, groupId, userId]);
  return callAdapter;
}

function useChatAdapter(
  displayName: string,
  endpoint: string,
  threadId: string,
  userId: string,
  credential?: AzureCommunicationTokenCredential
): ChatAdapter | undefined {
  const [chatAdapter, setChatAdapter] = useState<ChatAdapter>();
  useEffect(() => {
    (async (): Promise<void> => {
      credential &&
        setChatAdapter(
          await createAzureCommunicationChatAdapter({
            endpoint,
            userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
            displayName,
            credential,
            threadId
          })
        );
    })();
  }, [credential, displayName, endpoint, threadId, userId]);
  return chatAdapter;
}

export default App;
