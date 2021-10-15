// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DEFAULT_COMPONENT_ICONS } from '@azure/communication-react';
import { initializeIcons, registerIcons, Spinner } from '@fluentui/react';
import React, { useState } from 'react';
import { ChatScreen } from './ChatScreen';
import ConfigurationScreen from './ConfigurationScreen';
import { EndScreen } from './EndScreen';
import { ErrorScreen } from './ErrorScreen';
import HomeScreen from './HomeScreen';
import { getThreadId } from './utils/getThreadId';
import { getBuildTime, getChatSDKVersion } from './utils/utils';

console.info(`Thread chat sample using @azure/communication-chat : ${getChatSDKVersion()}`);
console.info(`Build Date : ${getBuildTime()}`);

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

const webAppTitle = document.title;

export default (): JSX.Element => {
  const [page, setPage] = useState('home');
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [threadId, setThreadId] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');

  const getComponent = (): JSX.Element => {
    switch (page) {
      case 'home': {
        document.title = `home - ${webAppTitle}`;
        return <HomeScreen />;
      }
      case 'configuration': {
        document.title = `configuration - ${webAppTitle}`;
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
      }
      case 'chat': {
        document.title = `chat - ${webAppTitle}`;
        if (token && userId && displayName && threadId && endpointUrl) {
          return (
            <ChatScreen
              token={token}
              userId={userId}
              displayName={displayName}
              endpointUrl={endpointUrl}
              threadId={threadId}
              endChatHandler={() => {
                setPage('end');
              }}
              errorHandler={() => {
                setPage('error');
              }}
            />
          );
        }

        return <Spinner label={'Loading...'} ariaLive="assertive" labelPosition="top" />;
      }
      case 'end': {
        document.title = `end chat - ${webAppTitle}`;
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
      }
      case 'error': {
        document.title = `error - ${webAppTitle}`;
        return (
          <ErrorScreen
            homeHandler={() => {
              window.location.href = window.location.origin;
            }}
          />
        );
      }
      default:
        document.title = `error - ${webAppTitle}`;
        throw new Error('Page type not recognized');
    }
  };

  if (getThreadId() && page === 'home') {
    setPage('configuration');
  }

  return getComponent();
};
