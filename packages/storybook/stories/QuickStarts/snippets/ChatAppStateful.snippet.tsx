import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { createStatefulChatClient } from '@azure/communication-react';
import React from 'react';

function App(): JSX.Element {
  const endpointUrl = 'INSERT ENDPOINT URL FOR RESOURCE';
  const userAccessToken = 'INSERT ACCESS TOKEN FOR RESOURCE';
  const userId = 'INSERT USER ID';
  const tokenCredential = new AzureCommunicationTokenCredential(userAccessToken);
  const threadId = 'INSERT THREAD ID ';
  const displayName = 'INSERT DISPLAY NAME';

  // Instantiate the statefulChatClient
  const statefulChatClient = createStatefulChatClient({
    userId: { kind: 'communicationUser', communicationUserId: userId },
    displayName: displayName,
    endpoint: endpointUrl,
    credential: tokenCredential
  });

  // Example usage
  const chatThreadClient = statefulChatClient.getChatThreadClient(threadId);
  chatThreadClient.listParticipants();

  return <></>;
}

export default App;
