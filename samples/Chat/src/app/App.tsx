// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState } from 'react';
import { getBuildTime, getChatSDKVersion } from './utils/utils';
import { initializeIcons, Spinner } from '@fluentui/react';

import { ChatScreen } from './ChatScreen';
import ConfigurationScreen from './ConfigurationScreen';
import { EndScreen } from './EndScreen';
import { ErrorScreen } from './ErrorScreen';
import HomeScreen from './HomeScreen';
import { getThreadId } from './utils/getThreadId';

console.info(`Thread chat sample using @azure/communication-chat : ${getChatSDKVersion()}`);
console.info(`Build Date : ${getBuildTime()}`);

initializeIcons();

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
        return <HomeScreen />;
      }
      case 'configuration': {
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
        return (
          <ErrorScreen
            homeHandler={() => {
              window.location.href = window.location.origin;
            }}
          />
        );
      }
      default:
        throw new Error('Page type not recognized');
    }
  };

  if (getThreadId() && page === 'home') {
    setPage('configuration');
  }

  return getComponent();
};
