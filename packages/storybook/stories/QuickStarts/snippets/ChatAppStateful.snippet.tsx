import { chatClientDeclaratify, DeclarativeChatClient } from '@azure/acs-chat-declarative';
import { ChatClient, ChatThreadClient } from '@azure/communication-chat';
import { AzureCommunicationUserCredential } from '@azure/communication-common';
import { FluentThemeProvider, MessageThread, SendBox, MessageThreadProps, SendBoxProps } from '@azure/communication-ui';
import React, { useState, useEffect } from 'react';

function App() {
  const endpointUrl = 'INSERT ENDPOINT URL FOR RESOURCE';
  const userAccessToken = 'INSERT ACCESS TOKEN FOR RESOURCE';
  const userId = 'INSERT USER ID';
  const tokenCredential = new AzureCommunicationUserCredential(userAccessToken);
  const threadId = 'INSERT THREAD ID ';
  const displayName = 'INSERT DISPLAY NAME';

  const [statefulChatClient, setStatefulChatClient] = useState<DeclarativeChatClient>();
  const [chatThreadClient, setChatThreadClient] = useState<ChatThreadClient>();
  const [messageThreadProps, setChatThreadProps] = useState<MessageThreadProps>();
  const [sendBoxProps, setSendBoxProps] = useState<SendBoxProps>();

  useEffect(() => {
    (async () => {
      if (statefulChatClient && !chatThreadClient) {
        //Once stateful client exists, generate a thread client for chat
        setChatThreadClient(await statefulChatClient.getChatThreadClient(threadId));
      }
    })();
  }, [statefulChatClient]);

  //Add state to the low-level chat client
  setStatefulChatClient(
    chatClientDeclaratify(new ChatClient(endpointUrl, tokenCredential), { userId: userId, displayName: displayName })
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
