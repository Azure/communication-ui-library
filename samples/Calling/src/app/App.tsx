// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import { Link, initializeIcons } from '@fluentui/react';

import EndCall from './EndCall';
import { ConfigurationScreen } from './ConfigurationScreen';
import { GroupCall } from './GroupCall';
import { HomeScreen } from './HomeScreen';
import { v1 as createGUID } from 'uuid';
import { CallProvider, CallClientProvider, CallAgentProvider } from 'react-composites';
import {
  createRandomDisplayName,
  fetchTokenResponse,
  getBuildTime,
  getDisplayNameFromLocalStorage,
  getGroupIdFromUrl,
  isOnIphoneAndNotSafari,
  isSmallScreen
} from './utils/AppUtils';
import { refreshTokenAsync } from './utils/refreshToken';
import { localStorageAvailable } from './utils/constants';

const isMobileSession = (): boolean =>
  !!window.navigator.userAgent.match(/(iPad|iPhone|iPod|Android|webOS|BlackBerry|Windows Phone)/g);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sdkVersion = require('../../package.json').dependencies['@azure/communication-calling'];
const lastUpdated = `Last Updated ${getBuildTime()} with @azure/communication-calling:${sdkVersion}`;

initializeIcons();

// Get display name from local storage or generate a new random display name
const defaultDisplayName = (localStorageAvailable && getDisplayNameFromLocalStorage()) || createRandomDisplayName();

const UnsupportedBrowserPage = (): JSX.Element => {
  window.document.title = 'Unsupported browser';
  return (
    <>
      <Link href="https://docs.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/calling-sdk-features#calling-client-library-browser-support">
        Learn more
      </Link>
      &nbsp;about browsers and platforms supported by the web calling sdk
    </>
  );
};

const App = (): JSX.Element => {
  const [page, setPage] = useState('home');
  const [groupId, setGroupId] = useState('');
  const [screenWidth, setScreenWidth] = useState(window?.innerWidth ?? 0);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState(defaultDisplayName);

  useEffect(() => {
    const setWindowWidth = (): void => {
      const width = typeof window !== 'undefined' ? window.innerWidth : 0;
      setScreenWidth(width);
    };
    setWindowWidth();
    window.addEventListener('resize', setWindowWidth);
    return () => window.removeEventListener('resize', setWindowWidth);
  }, []);

  useEffect(() => {
    (async () => {
      const tokenResponse = await fetchTokenResponse();
      setToken(tokenResponse.token);
      setUserId(tokenResponse.user.communicationUserId);
    })();
  }, []);

  const getGroupId = (): string => {
    if (groupId) return groupId;
    const uriGid = getGroupIdFromUrl();
    const gid = uriGid ? uriGid : createGUID();
    setGroupId(gid);
    return gid;
  };

  const navigateToHomePage = (): void => {
    window.location.href = window.location.href.split('?')[0];
  };

  const navigateToStartCallPage = (): void => {
    window.history.pushState({}, document.title, window.location.href + '?groupId=' + getGroupId());
  };

  const renderPage = (page: string): JSX.Element => {
    switch (page) {
      case 'configuration':
        return (
          <ConfigurationScreen
            screenWidth={screenWidth}
            startCallHandler={(): void => setPage('call')}
            onDisplayNameUpdate={setDisplayName}
          />
        );
      case 'call':
        return (
          <CallAgentProvider displayName={displayName} token={token}>
            <CallProvider>
              <GroupCall
                endCallHandler={(): void => {
                  setPage('endCall');
                }}
                screenWidth={screenWidth}
                groupId={getGroupId()}
              />
            </CallProvider>
          </CallAgentProvider>
        );
      default:
        return <>Invalid Page</>;
    }
  };

  const getContent = (): JSX.Element => {
    const supportedBrowser = !isOnIphoneAndNotSafari();
    if (!supportedBrowser) return UnsupportedBrowserPage();

    if (getGroupIdFromUrl() && page === 'home') {
      setPage('configuration');
    }

    if (isMobileSession() || isSmallScreen()) {
      console.log('ACS Calling sample: This is experimental behaviour');
    }

    switch (page) {
      case 'home': {
        return <HomeScreen startCallHandler={navigateToStartCallPage} />;
      }
      case 'endCall': {
        return <EndCall rejoinHandler={() => setPage('configuration')} homeHandler={navigateToHomePage} />;
      }
      default:
        return (
          <CallClientProvider token={token} displayName={displayName} refreshTokenCallback={refreshTokenAsync(userId)}>
            {renderPage(page)}
          </CallClientProvider>
        );
    }
  };

  return getContent();
};

window.setTimeout(() => {
  try {
    console.log(`ACS sample group calling app: ${lastUpdated}`);
  } catch (e) {
    /* continue regardless of error */
  }
}, 0);

export default App;
