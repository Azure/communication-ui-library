// © Microsoft Corporation. All rights reserved.

import React, { useEffect, useState } from 'react';
import { initializeIcons, loadTheme } from '@fluentui/react';

import EndCall from './EndCall';
import ConfigurationScreen from './ConfigurationScreen';
import GroupCall from './GroupCall';
import HomeScreen from './HomeScreen';
import { v1 as createGUID } from 'uuid';
import { CallingProvider, CallProvider, CommunicationUiErrorInfo, ErrorProvider } from '@azure/communication-ui';
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

loadTheme({});
initializeIcons();

// Get display name from local storage or generate a new random display name
const defaultDisplayName = (localStorageAvailable && getDisplayNameFromLocalStorage()) || createRandomDisplayName();

const App = (): JSX.Element => {
  const [page, setPage] = useState('home');
  const [subpage, setSubpage] = useState('configuration');
  const [groupId, setGroupId] = useState('');
  const [screenWidth, setScreenWidth] = useState(window?.innerWidth ?? 0);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');

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

  const getContent = (): JSX.Element => {
    const supportedBrowser = !isOnIphoneAndNotSafari();
    if (supportedBrowser) {
      switch (page) {
        case 'home': {
          return (
            <HomeScreen
              startCallHandler={(): void => {
                window.history.pushState({}, document.title, window.location.href + '?groupId=' + getGroupId());
              }}
            />
          );
        }
        case 'call': {
          return (
            <ErrorProvider
              onErrorCallback={(error: CommunicationUiErrorInfo) =>
                console.error('onErrorCallback received error:', error)
              }
            >
              <CallingProvider token={token} refreshTokenCallback={refreshTokenAsync(userId)}>
                <CallProvider displayName={defaultDisplayName}>
                  {(() => {
                    switch (subpage) {
                      case 'configuration': {
                        return (
                          <ConfigurationScreen
                            screenWidth={screenWidth}
                            startCallHandler={(): void => setSubpage('groupcall')}
                            groupId={getGroupId()}
                          />
                        );
                      }
                      case 'groupcall': {
                        return (
                          <GroupCall
                            endCallHandler={(): void => {
                              setPage('endCall');
                              setSubpage('configuration');
                            }}
                            screenWidth={screenWidth}
                            groupId={getGroupId()}
                          />
                        );
                      }
                      default: {
                        return <>Please set a valid subpage</>;
                      }
                    }
                  })()}
                </CallProvider>
              </CallingProvider>
            </ErrorProvider>
          );
        }
        case 'endCall': {
          return (
            <EndCall
              rejoinHandler={(): void => {
                setSubpage('configuration');
                setPage('call');
              }}
              homeHandler={(): void => {
                window.location.href = window.location.href.split('?')[0];
              }}
            />
          );
        }
        default:
          // fallthrough to error page
          break;
      }
    }
    // page === 'error'
    window.document.title = 'Unsupported browser';
    return (
      <>
        <a href="https://aka.ms/ACS-CallingSupport#calling-client-library-browser-support">Learn more</a>&nbsp;about
        browsers and platforms supported by the web calling sdk
      </>
    );
  };

  if (getGroupIdFromUrl() && page === 'home') {
    setSubpage('configuration');
    setPage('call');
  }

  if (isMobileSession() || isSmallScreen()) {
    console.log('ACS Calling sample: This is experimental behaviour');
  }

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
