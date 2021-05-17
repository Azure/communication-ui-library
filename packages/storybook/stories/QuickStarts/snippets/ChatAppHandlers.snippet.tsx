import { sendBoxSelector, chatThreadSelector, createDefaultChatHandlersForComponent } from '@azure/acs-chat-selector';
import { ChatClient, ChatThreadClient } from '@azure/communication-chat';
import { AzureCommunicationUserCredential } from '@azure/communication-common';
import { FluentThemeProvider, MessageThread, SendBox, MessageThreadProps, SendBoxProps } from '@azure/communication-ui';
import { createStatefulChatClient, StatefulChatClient } from 'chat-stateful-client';
import React, { useState, useEffect } from 'react';

function App(): JSX.Element {
  const endpointUrl = 'INSERT ENDPOINT URL FOR RESOURCE';
  const userAccessToken = 'INSERT ACCESS TOKEN FOR RESOURCE';
  const userId = 'INSERT USER ID';
  const tokenCredential = new AzureCommunicationUserCredential(userAccessToken);
  const threadId = 'INSERT THREAD ID ';
  const displayName = 'INSERT DISPLAY NAME';

  const [statefulChatClient, setStatefulChatClient] = useState<StatefulChatClient>();
  const [chatThreadClient, setChatThreadClient] = useState<ChatThreadClient>();
  const [messageThreadProps, setChatThreadProps] = useState<MessageThreadProps>();
  const [sendBoxProps, setSendBoxProps] = useState<SendBoxProps>();

  useEffect(() => {
    // `selectors` compute props from `statefulChatClient`
    // Computed props are updated in you App's State.
    const updateAppState = (statefulClientState): void => {
      setChatThreadProps(chatThreadSelector(statefulClientState, { threadId }));
      setSendBoxProps(sendBoxSelector(statefulClientState, { threadId }));
    };
    (async () => {
      if (statefulChatClient && !chatThreadClient) {
        // When `statefulChatClient` becomes available, generate a thread client for chat
        setChatThreadClient(await statefulChatClient.getChatThreadClient(threadId));
        // Set your App State using computed props from `statefulChatClient`.
        updateAppState(statefulChatClient.getState());
        // Subscribe for changes in `statefulChatClient` state.
        statefulChatClient.onStateChange(updateAppState);
      }
    })();
    // Important: Ensure that events are unsubscribed when component unloads.
    return () => statefulChatClient.offStateChange(updateAppState);
  }, [statefulChatClient, chatThreadClient]);

  //Add state to the low-level chat client
  setStatefulChatClient(
    createStatefulChatClient({ userId: userId, displayName: displayName }, endpointUrl, tokenCredential)
  );

  //Generate Handlers for Message Thread and SendBox off the stateful client to handle events from the UI Components
  let sendBoxHandler;
  let messageThreadHandler;
  if (chatThreadClient && statefulChatClient) {
    sendBoxHandler = createDefaultChatHandlersForComponent(statefulChatClient, chatThreadClient, SendBox);
    messageThreadHandler = createDefaultChatHandlersForComponent(statefulChatClient, chatThreadClient, MessageThread);
  }

  return (
    <FluentThemeProvider>
      <div style={{ height: '50rem', width: '50rem' }}>
        {/*Props are updated asynchronously, so only render the component once props are populated.*/}
        {messageThreadProps && <MessageThread {...messageThreadProps} {...messageThreadHandler} />}
        {sendBoxProps && <SendBox {...sendBoxProps} {...sendBoxHandler} />}
      </div>
    </FluentThemeProvider>
  );
}

export default App;
