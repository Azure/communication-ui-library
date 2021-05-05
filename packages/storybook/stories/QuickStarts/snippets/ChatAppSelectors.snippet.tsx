import React, { useState, useEffect } from 'react';
import { FluentThemeProvider, MessageThread, SendBox, MessageThreadProps, SendBoxProps } from '@azure/communication-ui';
import { chatClientDeclaratify, DeclarativeChatClient } from '@azure/acs-chat-declarative';
import { AzureCommunicationUserCredential } from '@azure/communication-common';
import { ChatClient, ChatThreadClient } from '@azure/communication-chat';
import { sendBoxSelector, chatThreadSelector, createDefaultHandlersForComponent } from '@azure/acs-chat-selector';

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
        //Extract props from stateful client to use to populate UI Components
        setChatThreadProps(chatThreadSelector(statefulChatClient.state, { threadId }));
        setSendBoxProps(sendBoxSelector(statefulChatClient.state, { threadId }));
        //Update props when ever the state of the stateful client changes
        statefulChatClient.onStateChange((state) => {
          setChatThreadProps({ ...chatThreadSelector(state, { threadId }) });
          setSendBoxProps({ ...sendBoxSelector(state, { threadId }) });
        });
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
        {/*Add UI Components with props passed. Render components only when props are populated*/}
        {messageThreadProps && <MessageThread {...messageThreadProps} />}
        {sendBoxProps && <SendBox {...sendBoxProps} />}
      </div>
    </FluentThemeProvider>
  );
}

export default App;
