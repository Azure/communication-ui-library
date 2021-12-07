import { ChatThreadClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { createStatefulChatClient, DEFAULT_COMPONENT_ICONS } from '@azure/communication-react';
import { registerIcons } from '@fluentui/react';
import React from 'react';

function App(): JSX.Element {
  registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

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

  // Listen to notifications
  statefulChatClient.startRealtimeNotifications();

  const chatThreadClient = statefulChatClient.getChatThreadClient(threadId);
  // Fetch thread properties, participants etc.
  // Past messages are fetched as needed when the user scrolls to them.
  initializeThreadState(chatThreadClient);

  return <>{chatThreadClient && <h1>Hooray! You set up chat client 🎉🎉🎉</h1>};</>;
}

async function initializeThreadState(chatThreadClient: ChatThreadClient): Promise<void> {
  await chatThreadClient.getProperties();
  for await (const _page of chatThreadClient.listParticipants().byPage()) {
    // Simply fetching participants updates the cached state in client.
  }
}

export default App;
