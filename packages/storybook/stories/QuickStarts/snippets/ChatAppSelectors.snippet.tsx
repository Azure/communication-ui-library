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
    // `selectors` compute props from `statefulChatClient`
    // Computed props are updated in you App's State.
    const updateAppState = (statefulClientState) => {
      setChatThreadProps(chatThreadSelector(statefulClientState, { threadId }));
      setSendBoxProps(sendBoxSelector(statefulClientState, { threadId }));
    };
    (async () => {
      if (statefulChatClient && !chatThreadClient) {
        // When `statefulChatClient` becomes available, generate a thread client for chat
        setChatThreadClient(await statefulChatClient.getChatThreadClient(threadId));
        // Set your App State using computed props from `statefulChatClient`.
        updateAppState(statefulChatClient.state);
        // Subscribe for changes in `statefulChatClient` state.
        statefulChatClient.onStateChange(updateAppState);
      }
    })();
    // Important: Ensure that events are unsubscribed when component unloads.
    return () => statefulChatClient.offStateChange(updateAppState);
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
