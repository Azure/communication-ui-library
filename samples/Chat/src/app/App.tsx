// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import { createAzureCommunicationUserCredential, getBuildTime, getChatSDKVersion } from './utils/utils';
import { initializeIcons, registerIcons, Spinner } from '@fluentui/react';
import { defaultIcons } from '@azure/communication-react';

import { ChatScreen } from './ChatScreen';
import { EndScreen } from './EndScreen';
import { ErrorScreen } from './ErrorScreen';
import HomeScreen from './HomeScreen';
import ConfigurationScreen from './ConfigurationScreen';
import { getThreadId } from './utils/getThreadId';
import { refreshTokenAsync } from './utils/refreshToken';
import {
  createStatefulChatClient,
  StatefulChatClient,
  ChatClientProvider,
  ChatThreadClientProvider
} from '@azure/communication-react';
import { ChatThreadClient } from '@azure/communication-chat';
import { CommunicationUserKind } from '@azure/communication-common';

console.info(`Thread chat sample using @azure/communication-chat : ${getChatSDKVersion()}`);
console.info(`Build Date : ${getBuildTime()}`);

initializeIcons();
registerIcons({ icons: defaultIcons });

export default (): JSX.Element => {
  const [page, setPage] = useState('home');
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [threadId, setThreadId] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [chatClient, setChatClient] = useState<StatefulChatClient>();
  const [chatThreadClient, setChatThreadClient] = useState<ChatThreadClient>();

  useEffect(() => {
    if (token && userId && displayName && threadId && endpointUrl) {
      const userIdKind = { kind: 'communicationUser', communicationUserId: userId } as CommunicationUserKind;
      const createClient = async (): Promise<void> => {
        const chatClient = createStatefulChatClient({
          userId: userIdKind,
          displayName,
          endpoint: endpointUrl,
          credential: createAzureCommunicationUserCredential(token, refreshTokenAsync(userId))
        });

        setChatClient(chatClient);
        setChatThreadClient(await chatClient.getChatThreadClient(threadId));

        chatClient.startRealtimeNotifications();
      };
      createClient();
    }
  }, [displayName, endpointUrl, threadId, token, userId]);

  const getComponent = (): JSX.Element => {
    if (page === 'home') {
      return <HomeScreen />;
    } else if (page === 'configuration') {
      return (
        <ConfigurationScreen
          joinChatHandler={() => {
            setPage('chat');
          }}
          setToken={setToken}
          setUserId={setUserId}
          setDisplayName={setDisplayName}
          setThreadId={setThreadId}
          setEndpointUrl={setEndpointUrl}
        />
      );
    } else if (page === 'chat') {
      return chatClient && chatThreadClient ? (
        <ChatClientProvider chatClient={chatClient}>
          <ChatThreadClientProvider chatThreadClient={chatThreadClient}>
            <ChatScreen
              endChatHandler={() => {
                chatThreadClient.removeParticipant({ communicationUserId: userId });
                setPage('end');
                // Send up signal that the user wants to leave the chat
                // Move to to next screen on success
              }}
              errorHandler={() => {
                setPage('error');
              }}
            />
          </ChatThreadClientProvider>
        </ChatClientProvider>
      ) : (
        <Spinner label={'Loading...'} ariaLive="assertive" labelPosition="top" />
      );
    } else if (page === 'end') {
      return (
        <EndScreen
          rejoinHandler={() => {
            setPage('configuration'); // use store information to attempt to rejoin the chat thread
          }}
          homeHandler={() => {
            window.location.href = window.location.origin;
          }}
          userId={userId}
          displayName={displayName}
        />
      );
    } else if (page === 'error') {
      return (
        <ErrorScreen
          homeHandler={() => {
            window.location.href = window.location.origin;
          }}
        />
      );
    } else {
      throw new Error('Page type not recognized');
    }
  };

  if (getThreadId() && page === 'home') {
    setPage('configuration');
  }

  return getComponent();
};
