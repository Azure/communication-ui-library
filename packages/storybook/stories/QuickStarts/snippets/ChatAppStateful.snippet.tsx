import { ChatThreadClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
  FluentThemeProvider,
  MessageThread,
  SendBox,
  MessageThreadProps,
  SendBoxProps,
  StatefulChatClient,
  createStatefulChatClient
} from '@azure/communication-react';
import React, { useState, useEffect } from 'react';

function App(): JSX.Element {
  const endpointUrl = 'INSERT ENDPOINT URL FOR RESOURCE';
  const userAccessToken = 'INSERT ACCESS TOKEN FOR RESOURCE';
  const userId = 'INSERT USER ID';
  const tokenCredential = new AzureCommunicationTokenCredential(userAccessToken);
  const threadId = 'INSERT THREAD ID ';
  const displayName = 'INSERT DISPLAY NAME';

  const [statefulChatClient, setStatefulChatClient] = useState<StatefulChatClient>();
  const [chatThreadClient, setChatThreadClient] = useState<ChatThreadClient>();
  const [messageThreadProps] = useState<MessageThreadProps>();
  const [sendBoxProps] = useState<SendBoxProps>();

  useEffect(() => {
    (async () => {
      if (statefulChatClient && !chatThreadClient) {
        //Once stateful client exists, generate a thread client for chat
        setChatThreadClient(await statefulChatClient.getChatThreadClient(threadId));
      }
    })();
  }, [statefulChatClient, chatThreadClient]);

  //Add state to the low-level chat client
  setStatefulChatClient(
    createStatefulChatClient({
      userId: { kind: 'communicationUser', communicationUserId: userId },
      displayName: displayName,
      endpoint: endpointUrl,
      credential: tokenCredential
    })
  );

  return (
    <FluentThemeProvider>
      <div style={{ height: '50rem', width: '50rem' }}>
        {/*Props are updated asynchronously, so only render the component once props are populated.*/}
        {messageThreadProps && <MessageThread {...messageThreadProps} />}
        {sendBoxProps && <SendBox {...sendBoxProps} />}
      </div>
    </FluentThemeProvider>
  );
}

export default App;
