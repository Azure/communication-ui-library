// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { setLogLevel } from '@azure/logger';
import { initializeIcons, Spinner, Stack } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { ChatScreen } from './ChatScreen';
import ConfigurationScreen from './ConfigurationScreen';
import { EndScreen } from './EndScreen';
import { ErrorScreen } from './ErrorScreen';
import HomeScreen from './HomeScreen';
import { getExistingThreadIdFromURL } from './utils/getExistingThreadIdFromURL';
import { getBuildTime, getChatSDKVersion, getCommnicationReactSDKVersion } from './utils/utils';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
import { Header } from './Header';
import { _GraphToolkitEnabledProvider, _useIsSignedIn } from '@internal/acs-ui-common';
import { getChat, getChatMessages, getChatParticipants } from './graph-adapter/GraphQueries';
import { createMicrosoftGraphChatAdapter } from './graph-adapter/MicrosoftGraphChatAdapter';

setLogLevel('warning');

console.info(
  `Thread chat sample using @azure/communication-chat : ${getChatSDKVersion()} and @azure/communication-react : ${getCommnicationReactSDKVersion()}`
);
console.info(`Build Date : ${getBuildTime()}`);

initializeIcons();
initializeFileTypeIcons();

const ERROR_PAGE_TITLE_ERROR = 'Oops! You are no longer a participant for the chat thread.';
const ERROR_PAGE_TITLE_REMOVED = 'You have been removed from the chat.';

const webAppTitle = document.title;

const AppBody = (): JSX.Element => {
  const [page, setPage] = useState('home');
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [threadId, setThreadId] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [isSignedIn] = _useIsSignedIn();

  // Quick tests
  useEffect(() => {
    if (isSignedIn) {
      console.log('running some test fns:');
      (async () => {
        const chatThreadId =
          '19:08381377-19e1-48df-876d-a45998dd5910_71ad4812-19d8-4fd6-8ceb-0f14c2101e5e@unq.gbl.spaces';
        await getChat(chatThreadId);
        await getChatParticipants(chatThreadId);
        await getChatMessages(chatThreadId);
      })();
    }
  }, [isSignedIn]);

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
              endChatHandler={(isParticipantRemoved) => {
                if (isParticipantRemoved) {
                  setPage('removed');
                } else {
                  setPage('end');
                }
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
              setPage('chat'); // use stored information to attempt to rejoin the chat thread
            }}
            homeHandler={() => {
              window.location.href = window.location.origin;
            }}
            userId={userId}
            displayName={displayName}
          />
        );
      }
      case 'removed': {
        document.title = `removed - ${webAppTitle}`;
        return (
          <ErrorScreen
            title={ERROR_PAGE_TITLE_REMOVED}
            homeHandler={() => {
              window.location.href = window.location.origin;
            }}
          />
        );
      }
      case 'error': {
        document.title = `error - ${webAppTitle}`;
        return (
          <ErrorScreen
            title={ERROR_PAGE_TITLE_ERROR}
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

  if (getExistingThreadIdFromURL() && page === 'home') {
    setPage('configuration');
  }

  return getComponent();
};

export default (): JSX.Element => {
  const [enableGraphUiToolkit, setEnableGraphUiToolkit] = useState<boolean>(getEnabledFromLocalStorage());

  return (
    <_GraphToolkitEnabledProvider isEnabled={enableGraphUiToolkit}>
      <Stack verticalFill>
        <Stack.Item>
          <Header graphUiToolkitEnabled={enableGraphUiToolkit} setEnableGraphUiToolkit={setEnableGraphUiToolkit} />
        </Stack.Item>
        <Stack.Item grow>
          <Stack verticalFill verticalAlign="center" horizontalAlign="center">
            <AppBody />
          </Stack>
        </Stack.Item>
      </Stack>
    </_GraphToolkitEnabledProvider>
  );
};

const localStorageAvailable = typeof Storage !== 'undefined';
const localStorageKey = 'GraphUIToolkitEnabled';

const getEnabledFromLocalStorage = (): boolean =>
  localStorageAvailable && window.localStorage.getItem(localStorageKey) === 'true';
