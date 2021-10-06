import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { createStatefulChatClient } from '@azure/communication-react';
import React from 'react';

function App(): JSX.Element {
  const endpointUrl = '<Azure Communication Services Resource Endpoint>';
  const userAccessToken = '<Azure Communication Services Resource Access Token>';
  const userId = '<User Id associated to the token>';
  const tokenCredential = new AzureCommunicationTokenCredential(userAccessToken);
  const threadId = '<Get thread id from chat service>';
  const displayName = '<Display Name>';

  // Instantiate the statefulChatClient
  const statefulChatClient = createStatefulChatClient({
    userId: { communicationUserId: userId },
    displayName: displayName,
    endpoint: endpointUrl,
    credential: tokenCredential
  });

  const chatThreadClient = statefulChatClient.getChatThreadClient(threadId);

  //Listen to notifications
  statefulChatClient.startRealtimeNotifications();

  return <>{chatThreadClient && <h1>Hooray! You set up chat client 🎉🎉🎉</h1>};</>;
}

export default App;
