// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useEffect, useState } from "react";
import {
  ChatClientProvider,
  ChatThreadClientProvider,
  createStatefulChatClient,
  StatefulChatClient,
  FluentThemeProvider,
  MessageThread,
  SendBox,
  usePropsFor,
} from "@azure/communication-react";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import type { ChatThreadClient } from "@azure/communication-chat";

export type ContainerProps = {
  userId: string;
  token: string;
  displayName: string;
  endpointUrl: string;
  threadId1: string;
  threadId2: string;
};

export const Examples = (props: ContainerProps): JSX.Element => {
  const [chatClient, setChatClient] = useState<StatefulChatClient>();
  const [chatThreadClient1, setChatThreadClient1] =
    useState<ChatThreadClient>();
  const [chatThreadClient2, setChatThreadClient2] =
    useState<ChatThreadClient>();

  const [activeChat, setActiveChat] = useState(1);

  useEffect(() => {
    (async () => {
      const { userId, token, displayName, endpointUrl, threadId1, threadId2 } =
        props;
      const credential = new AzureCommunicationTokenCredential(token);
      // set up chat client
      const chatClient = createStatefulChatClient({
        credential,
        userId: { communicationUserId: userId },
        displayName,
        endpoint: endpointUrl,
      });
      // start realtime notification
      chatClient.startRealtimeNotifications();

      setChatClient(chatClient);
      setChatThreadClient1(chatClient.getChatThreadClient(threadId1));
      setChatThreadClient2(chatClient?.getChatThreadClient(threadId2));
    })();
  }, []);

  const handleClick = (): void => {
    setActiveChat((prevActiveChat) => (prevActiveChat === 1 ? 2 : 1));
  };

  const chatContainer = chatClient && chatThreadClient1 && (
    <div
      style={{
        position: "absolute",
        zIndex: activeChat === 1 ? 2 : 1,
        width: "100%",
      }}
    >
      <ChatClientProvider chatClient={chatClient}>
        <ChatThreadClientProvider chatThreadClient={chatThreadClient1}>
          <ComponentExample />
        </ChatThreadClientProvider>
      </ChatClientProvider>
    </div>
  );

  const chatContainer2 = chatClient && chatThreadClient2 && (
    <div
      style={{
        position: "absolute",
        zIndex: activeChat === 2 ? 2 : 1,
        width: "100%",
      }}
    >
      <ChatClientProvider chatClient={chatClient}>
        <ChatThreadClientProvider chatThreadClient={chatThreadClient2}>
          <ComponentExample />
        </ChatThreadClientProvider>
      </ChatClientProvider>
    </div>
  );

  return (
    <FluentThemeProvider>
      <div>
        <button onClick={handleClick}>Switch Chat</button>
      </div>
      <div style={{ position: "relative", width: "100%" }}>
        {chatContainer}
        {chatContainer2}
      </div>
    </FluentThemeProvider>
  );
};

export const ComponentExample = (): JSX.Element => {
  const sendBoxProps = usePropsFor(SendBox);
  const messageThreadProps = usePropsFor(MessageThread);
  return (
    <>
      <h3>Connect components to StatefulClient</h3>
      <h5>SendBox(send message here and see what happens in MessageThread):</h5>
      <SendBox {...sendBoxProps} />
      <h5>MessageThread:</h5>
      <div style={{ height: "50rem" }}>
        <MessageThread {...messageThreadProps} />
      </div>
    </>
  );
};
