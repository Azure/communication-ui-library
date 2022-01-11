// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useEffect, useState } from 'react';
import {
  ChatClientProvider,
  ChatThreadClientProvider,
  createStatefulCallClient,
  createStatefulChatClient,
  StatefulCallClient,
  StatefulChatClient,
  FluentThemeProvider,
  DEFAULT_COMPOSITE_ICONS
} from '@azure/communication-react';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ChatThreadClient } from '@azure/communication-chat';
import { CallAgent, Call } from '@azure/communication-calling';
import { v4 as createGUID } from 'uuid';
import { createChatThreadAndUsers } from './utils/utils';
import { ComponentExample } from './examples/ComponentExample';
import { UseSelectorExample } from './examples/UseSelectorExample';
import { CallClientProvider } from '@azure/communication-react';
import { CallAgentProvider } from '@azure/communication-react';
import { CallProvider } from '@azure/communication-react';
import { RenderVideoTileExample } from './examples/RenderSingleVideoTileExample';
import { initializeIcons, registerIcons } from '@fluentui/react';

initializeIcons();
registerIcons({ icons: { ...DEFAULT_COMPOSITE_ICONS } });

export const Examples = (): JSX.Element => {
  const [chatClient, setChatClient] = useState<StatefulChatClient>();
  const [chatThreadClient, setChatThreadClient] = useState<ChatThreadClient>();

  const [callClient, setCallClient] = useState<StatefulCallClient>();
  const [callAgent, setCallAgent] = useState<CallAgent>();
  const [callInstance, setCalInstance] = useState<Call>();

  useEffect(() => {
    (async () => {
      const displayName = 'Example user';
      const { token, userId, threadId, endpointUrl } = await createChatThreadAndUsers(displayName);
      const credential = new AzureCommunicationTokenCredential(token);

      // set up chat client
      const chatClient = createStatefulChatClient({
        credential,
        userId: { communicationUserId: userId },
        displayName,
        endpoint: endpointUrl
      });
      // start realtime notification
      chatClient.startRealtimeNotifications();

      setChatClient(chatClient);
      setChatThreadClient(chatClient.getChatThreadClient(threadId));

      // set up call client
      const callClient = createStatefulCallClient({
        userId: { communicationUserId: userId }
      });

      const callAgent = await callClient.createCallAgent(credential);
      setCallClient(callClient);
      setCallAgent(callAgent);
      // join a random GUID call
      setCalInstance(callAgent.join({ groupId: createGUID() }));
    })();
  }, []);

  const chatContainer = chatClient && chatThreadClient && (
    <ChatClientProvider chatClient={chatClient}>
      <ChatThreadClientProvider chatThreadClient={chatThreadClient}>
        <ComponentExample />
        <UseSelectorExample />
      </ChatThreadClientProvider>
    </ChatClientProvider>
  );

  const callCotainer = callClient && callAgent && callInstance && (
    <CallClientProvider callClient={callClient}>
      <CallAgentProvider callAgent={callAgent}>
        <CallProvider call={callInstance}>
          <RenderVideoTileExample />
        </CallProvider>
      </CallAgentProvider>
    </CallClientProvider>
  );

  return (
    <FluentThemeProvider>
      {chatContainer}
      {callCotainer}
    </FluentThemeProvider>
  );
};
