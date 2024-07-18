import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallComposite,
  fromFlatCommunicationIdentifier,
  useAzureCommunicationCallAdapter
} from '@azure/communication-react';
import { initializeIcons } from '@fluentui/react';
import React, { useMemo } from 'react';

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
 * A list of ACS User IDs to call
 */
const ACS_USER_IDS = ['<ACS User ID>'];

initializeIcons();

/**
 * Entry point of your application.
 */
function App(): JSX.Element {
  // Arguments that would usually be provided by your backend service or
  // (indirectly) by the user.
  const { userId, token, displayName, participantIds } = useAzureCommunicationServiceArgs();

  const createTargetCallees = useMemo(() => {
    return participantIds.map((c) => fromFlatCommunicationIdentifier(c) as CommunicationUserIdentifier);
  }, [participantIds]);

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
      targetCallees: createTargetCallees
    }),
    [userId, displayName, credential, createTargetCallees]
  );
  const callAdapter = useAzureCommunicationCallAdapter(callAdapterArgs);

  if (callAdapter) {
    return (
      <div style={{ height: '100vh', display: 'flex' }}>
        <CallComposite adapter={callAdapter} />
      </div>
    );
  }
  if (credential === undefined) {
    return <h3>Failed to construct credential. Provided token is malformed.</h3>;
  }
  return <h3>Initializing...</h3>;
}

/**
 * This hook returns all the arguments required to use the Azure Communication services
 * that would be provided by your backend service after user authentication depending on the user-flow.
 */
function useAzureCommunicationServiceArgs(): {
  userId: string;
  token: string;
  displayName: string;
  participantIds: string[];
} {
  return {
    userId: USER_ID,
    token: TOKEN,
    displayName: DISPLAY_NAME,
    participantIds: ACS_USER_IDS
  };
}

export default App;
