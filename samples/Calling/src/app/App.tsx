// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import { Link, initializeIcons } from '@fluentui/react';

import EndCall from './EndCall';
import CallError from './CallError';
import { ConfigurationScreen } from './ConfigurationScreen';
import { GroupCall } from './GroupCall';
import { HomeScreen } from './HomeScreen';
import { v1 as createGUID } from 'uuid';
import {
  CallProvider,
  CallClientProvider,
  CallAgentProvider,
  CommunicationUiError,
  CommunicationUiErrorCode
} from 'react-composites';
import {
  createRandomDisplayName,
  fetchTokenResponse,
  getBuildTime,
  getDisplayNameFromLocalStorage,
  getGroupIdFromUrl,
  isOnIphoneAndNotSafari,
  isSmallScreen
} from './utils/AppUtils';
import { localStorageAvailable } from './utils/constants';
import { createStatefulCallClient, StatefulCallClient } from 'calling-stateful-client';
import { getIdFromToken, createAzureCommunicationUserCredential } from 'react-composites';
import { CallAgent } from '@azure/communication-calling';
import { refreshTokenAsync } from './utils/refreshToken';
// import { createAzureCommunicationUserCredential } from 'react-composites/dist/dist-esm/utils';

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

const createCallAgent = async (
  statefulCallClient: StatefulCallClient,
  token: string,
  displayName: string,
  userId: string,
  setCallAgent: React.Dispatch<React.SetStateAction<CallAgent | undefined>>
): Promise<void> => {
  const userCredential = createAzureCommunicationUserCredential(token, refreshTokenAsync(userId));
  try {
    setCallAgent(await statefulCallClient.createCallAgent(userCredential, { displayName: displayName }));
    console.log('created new call Agent');
  } catch (error) {
    throw new CommunicationUiError({
      message: 'Error creating call agent',
      code: CommunicationUiErrorCode.CREATE_CALL_AGENT_ERROR,
      error: error
    });
  }
};

const App = (): JSX.Element => {
  const [page, setPage] = useState('home');
  const [groupId, setGroupId] = useState('');
  const [screenWidth, setScreenWidth] = useState(window?.innerWidth ?? 0);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [teamsMeetingLink, setTeamsMeetingLink] = useState<string>();
  const [displayName, setDisplayName] = useState(defaultDisplayName);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const [statefulCallClient, setStatefulCallClient] = useState<StatefulCallClient>();
  const [callAgent, setCallAgent] = useState<CallAgent | undefined>(undefined);

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

  useEffect(() => {
    // if there is no valid token then there is no valid userId
    const userIdFromToken = token ? getIdFromToken(token) : '';
    setStatefulCallClient(createStatefulCallClient({ userId: userIdFromToken }));
  }, [token]);

  // const callAgent = createCallAgent(statefulCallClient, token, displayName, userId);

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
            displayName={displayName}
            screenWidth={screenWidth}
            startCallHandler={async (data) => {
              if (data?.callLocator && 'meetingLink' in data?.callLocator) {
                setTeamsMeetingLink(data?.callLocator.meetingLink);
              }
              console.log('disposing', callAgent);
              await callAgent?.dispose();
              statefulCallClient &&
                (await createCallAgent(statefulCallClient, token, displayName, userId, setCallAgent));
              setTimeout(async () => {
                setPage('call');
              }, 5000);
            }}
            onDisplayNameUpdate={setDisplayName}
            isMicrophoneOn={isMicrophoneOn}
            setIsMicrophoneOn={setIsMicrophoneOn}
          />
        );
      case 'call':
        return (
          <CallAgentProvider callAgent={callAgent} key={Math.random()}>
            <CallProvider key={Math.random()}>
              <GroupCall
                endCallHandler={(): void => {
                  setPage('endCall');
                }}
                callErrorHandler={() => {
                  setPage('callError');
                }}
                screenWidth={screenWidth}
                callLocator={
                  teamsMeetingLink
                    ? {
                        meetingLink: teamsMeetingLink
                      }
                    : {
                        groupId: getGroupId()
                      }
                }
                isMicrophoneOn={isMicrophoneOn}
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

    if (!statefulCallClient) return <></>;

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
      case 'callError': {
        return <CallError rejoinHandler={() => setPage('configuration')} homeHandler={navigateToHomePage} />;
      }
      default:
        return <CallClientProvider statefulCallClient={statefulCallClient}>{renderPage(page)}</CallClientProvider>;
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
