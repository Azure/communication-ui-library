import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
  createStatefulChatClient,
  FluentThemeProvider,
  ChatClientProvider,
  ChatThreadClientProvider
} from '@azure/communication-react';
import React from 'react';

function App(): JSX.Element {
  const endpointUrl = 'INSERT ENDPOINT URL FOR RESOURCE';
  const userAccessToken = 'INSERT ACCESS TOKEN FOR RESOURCE';
  const userId = 'INSERT USER ID';
  const tokenCredential = new AzureCommunicationTokenCredential(userAccessToken);
  const threadId = 'INSERT THREAD ID ';
  const displayName = 'INSERT DISPLAY NAME';

  //Instatiate the statefulChatClient
  const statefulChatClient = createStatefulChatClient({
    userId: userId,
    displayName: displayName,
    endpoint: endpointUrl,
    credential: tokenCredential
  });

  const chatThreadClient = statefulChatClient.getChatThreadClient(threadId);

  return (
    <FluentThemeProvider>
      <ChatClientProvider chatClient={statefulChatClient}>
        <ChatThreadClientProvider chatThreadClient={chatThreadClient}></ChatThreadClientProvider>
      </ChatClientProvider>
    </FluentThemeProvider>
  );
}

export default App;
