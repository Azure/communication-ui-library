// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import { Link, initializeIcons, Spinner } from '@fluentui/react';

import EndCall from './EndCall';
import CallError from './CallError';
import { ConfigurationScreen } from './ConfigurationScreen';
import { CallScreen } from './CallScreen';
import { HomeScreen } from './HomeScreen';
import { v1 as createGUID } from 'uuid';
import { CallProvider, CallClientProvider, CallAgentProvider } from '@azure/acs-calling-selector';
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
import { AudioOptions, Call, CallAgent, GroupLocator } from '@azure/communication-calling';
import { refreshTokenAsync } from './utils/refreshToken';

const isMobileSession = (): boolean =>
  !!window.navigator.userAgent.match(/(iPad|iPhone|iPod|Android|webOS|BlackBerry|Windows Phone)/g);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sdkVersion = require('../../package.json').dependencies['@azure/communication-calling'];
const lastUpdated = `Last Updated ${getBuildTime()} with @azure/communication-calling:${sdkVersion}`;
const creatingCallClientspinnerLabel = 'Initializing call client...';
const creatingCallAgentSpinnerLabel = 'Initializing call agent...';

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
  const [teamsMeetingLink, setTeamsMeetingLink] = useState<string>();
  const [displayName, setDisplayName] = useState(defaultDisplayName);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const [statefulCallClient, setStatefulCallClient] = useState<StatefulCallClient>();
  const [callAgent, setCallAgent] = useState<CallAgent | undefined>(undefined);
  const [call, setCall] = useState<Call | undefined>(undefined);

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

  useEffect(() => {
    // Create a new CallClient when at the home page or at the createCallClient page.
    if (page === 'createCallClient' || page === 'home') {
      const userIdFromToken = token ? getIdFromToken(token) : '';
      const newStatefulCallClient = createStatefulCallClient({ userId: userIdFromToken });
      setStatefulCallClient(newStatefulCallClient);
      page === 'createCallClient' && setPage('configuration');

      const askPermissionAndQueryDevices = async (): Promise<void> => {
        const deviceManager = await newStatefulCallClient.getDeviceManager();
        await deviceManager.askDevicePermission({ video: true, audio: true });
        await deviceManager.getCameras();
        await deviceManager.getMicrophones();
        await deviceManager.getSpeakers();
      };
      askPermissionAndQueryDevices();
    }
  }, [page, token]);

  /**
   * Routing flow of the sample app: (happy path)
   * home -> createCallClient -> configuration -> createCallAgent -> call -> endCall
   *            ^                                                                   |
   *            | ------------------------------------------------------------------|
   * CallClient instance can only support one CallAgent. We need to create a new CallClient to create a new CallAgent.
   * Thus re-creation of the call client is required for joining a new call,
   * So we need to guarantee that we have created a new client before we enter CallClientProvider.
   */
  const renderPage = (page: string): JSX.Element => {
    switch (page) {
      case 'configuration':
        return (
          <ConfigurationScreen
            displayName={displayName}
            screenWidth={screenWidth}
            startCallHandler={async (data) => {
              let meetingLink;
              if (data?.callLocator && 'meetingLink' in data?.callLocator) {
                setTeamsMeetingLink(data?.callLocator.meetingLink);
                meetingLink = data?.callLocator.meetingLink;
              }

              // Generate a new CallAgent for the new call experience.
              try {
                const userCredential = createAzureCommunicationUserCredential(token, refreshTokenAsync(userId));
                setPage('createCallAgent');
                await callAgent?.dispose();
                const newCallAgent = await statefulCallClient?.createCallAgent(userCredential, { displayName });
                const callLocator = meetingLink ? { meetingLink } : { groupId: getGroupId() };
                const audioOptions: AudioOptions = { muted: !isMicrophoneOn };
                const call = newCallAgent?.join(callLocator as GroupLocator, { audioOptions });
                setCall(call);
                setCallAgent(newCallAgent);
              } catch (error) {
                console.error(error);
                setPage('callError');
              }

              setPage('call');
            }}
            onDisplayNameUpdate={setDisplayName}
            isMicrophoneOn={isMicrophoneOn}
            setIsMicrophoneOn={setIsMicrophoneOn}
          />
        );
      case 'call':
        return (
          <CallAgentProvider callAgent={callAgent}>
            <CallProvider call={call}>
              <CallScreen
                endCallHandler={(): void => {
                  setPage('endCall');
                }}
                callErrorHandler={(customErrorPage?: string) => {
                  if (customErrorPage) setPage(customErrorPage);
                  else setPage('callError');
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
      case 'createCallAgent':
        return <Spinner label={creatingCallAgentSpinnerLabel} ariaLive="assertive" labelPosition="top" />;
      default:
        return <>Invalid Page</>;
    }
  };

  const getContent = (): JSX.Element => {
    const supportedBrowser = !isOnIphoneAndNotSafari();
    if (!supportedBrowser) return UnsupportedBrowserPage();

    if (!statefulCallClient)
      return <Spinner label={creatingCallClientspinnerLabel} ariaLive="assertive" labelPosition="top" />;

    if (getGroupIdFromUrl() && page === 'home') {
      setPage('createCallClient');
    }

    if (isMobileSession() || isSmallScreen()) {
      console.log('ACS Calling sample: This is experimental behaviour');
    }

    switch (page) {
      case 'home': {
        return <HomeScreen startCallHandler={navigateToStartCallPage} />;
      }
      case 'endCall': {
        return <EndCall rejoinHandler={() => setPage('createCallClient')} homeHandler={navigateToHomePage} />;
      }
      case 'callError': {
        return <CallError rejoinHandler={() => setPage('createCallClient')} homeHandler={navigateToHomePage} />;
      }
      case 'teamsMeetingDenied': {
        return (
          <CallError
            title="Error joining Teams Meeting"
            reason="Access to the Teams meeting was denied."
            rejoinHandler={() => setPage('createCallClient')}
            homeHandler={navigateToHomePage}
          />
        );
      }
      case 'createCallClient': {
        return <Spinner label={creatingCallClientspinnerLabel} ariaLive="assertive" labelPosition="top" />;
      }
      default:
        return <CallClientProvider callClient={statefulCallClient}>{renderPage(page)}</CallClientProvider>;
    }
  };

  return getContent();
};

window.setTimeout(() => {
  try {
    console.log(`ACS sample calling app: ${lastUpdated}`);
  } catch (e) {
    /* continue regardless of error */
  }
}, 0);

export default App;
