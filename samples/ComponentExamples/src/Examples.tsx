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
import { CallAgent, Call, TeamsCallAgent, TeamsCall } from '@azure/communication-calling';
import { v4 as createGUID } from 'uuid';
import { createChatThreadAndUsers } from './utils/utils';
import { ComponentExample } from './examples/ComponentExample';
import { UseSelectorExample } from './examples/UseSelectorExample';
import { CallClientProvider } from '@azure/communication-react';
import { CallAgentProvider } from '@azure/communication-react';
import { CallProvider } from '@azure/communication-react';
import { RenderVideoTileExample } from './examples/RenderSingleVideoTileExample';
import { initializeIcons, registerIcons } from '@fluentui/react';
import { StyledControlBarExample } from './examples/StyledControlBarExample';

initializeIcons();
registerIcons({ icons: { ...DEFAULT_COMPOSITE_ICONS } });

export const Examples = (): JSX.Element => {
  const [chatClient, setChatClient] = useState<StatefulChatClient>();
  const [chatThreadClient, setChatThreadClient] = useState<ChatThreadClient>();

  const [callClient, setCallClient] = useState<StatefulCallClient>();
  const [callAgent, setCallAgent] = useState<TeamsCallAgent>();
  const [callInstance, setCalInstance] = useState<TeamsCall>();

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
        userId: { communicationUserId: 'a2745dd5-0376-4698-bd7f-eff6fcc6e29e' }
      });

      const callAgent = await callClient.createTeamsCallAgent(
        new AzureCommunicationTokenCredential(
          'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwNiIsIng1dCI6Im9QMWFxQnlfR3hZU3pSaXhuQ25zdE5PU2p2cyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoib3JnaWQ6YTI3NDVkZDUtMDM3Ni00Njk4LWJkN2YtZWZmNmZjYzZlMjllIiwic2NwIjoxMDI0LCJjc2kiOiIxNjY1MDk0NDEwIiwiZXhwIjoxNjY1MDk5NDQ5LCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJhY3NTY29wZSI6InZvaXAsY2hhdCIsInJlc291cmNlSWQiOiJiNmFhZGExZi0wYjFkLTQ3YWMtODY2Zi05MWFhZTAwYTFkMDEiLCJpYXQiOjE2NjUwOTQ3MTB9.aRAuXXYxiPJO_872vJEoOTwo7dkb0ivkb_BSZO8K65te_XyDU3pSHT7FdyRwvbAmAX0NM9Fz-mLNzV-oTcEQTChqOxfrbEnXhK43DgCCdxzS1gKL0fYOFWsESgCrzLn8ou_v61muO5o3eSymFdP3nKTzrWxV2O3OrUTmubegoixy2OWA5PxXewcQjDqu-CHWPS2CT2xYo07n_cDtA1Erz-Pa7EE2MTbH_lzWY5BNENZuj5p6sNfEuN1YkBJsRg9Fkn0zPBCXjypj6ON8wgdi-TC1FkmrC0ZK5AZXHJFJpgPTQ8wHEtgLIdMq-KZT5csREvvVWL3FJojj-4JdCOk8pw'
        )
      );
      setCallClient(callClient);
      setCallAgent(callAgent);
      // join a random GUID call
      setCalInstance(
        callAgent.join({
          meetingLink:
            'https://teams.microsoft.com/l/meetup-join/19%3ameeting_MzYxNDc0NDUtNTQ5MC00MDRjLWJkMjItODMyMzcxMzI5MDcx%40thread.v2/0?context=%7b%22Tid%22%3a%2272f988bf-86f1-41af-91ab-2d7cd011db47%22%2c%22Oid%22%3a%22a2745dd5-0376-4698-bd7f-eff6fcc6e29e%22%7d'
        })
      );
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
          <StyledControlBarExample />
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
