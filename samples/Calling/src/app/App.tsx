// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import { initializeIcons, Spinner } from '@fluentui/react';

import EndCall from './EndCall';
import CallError from './CallError';
import { CallJoinType, ConfigurationScreen } from './ConfigurationScreen';
import { CallScreen } from './CallScreen';
import { HomeScreen } from './HomeScreen';
import { CallProvider, CallClientProvider, CallAgentProvider } from 'calling-component-bindings';
import {
  fetchTokenResponse,
  buildTime,
  callingSDKVersion,
  getGroupIdFromUrl,
  isOnIphoneAndNotSafari,
  isSmallScreen,
  isMobileSession,
  navigateToHomePage,
  createGroupId,
  getTeamsLinkFromUrl
} from './utils/AppUtils';
import { createStatefulCallClient, StatefulCallClient } from 'calling-stateful-client';
import { createAzureCommunicationUserCredential } from 'react-composites';
import {
  AudioOptions,
  Call,
  CallAgent,
  GroupCallLocator,
  GroupLocator,
  TeamsMeetingLinkLocator
} from '@azure/communication-calling';
import { refreshTokenAsync } from './utils/refreshToken';
import { UnsupportedBrowserPage } from './UnsupportedBrowserPage';

console.log(
  `ACS sample calling app. Last Updated ${buildTime} Using @azure/communication-calling:${callingSDKVersion}`
);

const creatingCallClientspinnerLabel = 'Initializing call client...';
const creatingCallAgentSpinnerLabel = 'Initializing call agent...';

initializeIcons();

const App = (): JSX.Element => {
  const [page, setPage] = useState('home');
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [callLocator, setCallLocator] = useState<GroupLocator | TeamsMeetingLinkLocator>(createGroupId());
  const [displayName, setDisplayName] = useState<string>('');
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const [statefulCallClient, setStatefulCallClient] = useState<StatefulCallClient>();
  const [callAgent, setCallAgent] = useState<CallAgent | undefined>(undefined);
  const [call, setCall] = useState<Call | undefined>(undefined);
  const [callJoinType, setCallJoinType] = useState<CallJoinType>();

  // Get Azure Communications Service token from the server
  useEffect(() => {
    (async () => {
      const tokenResponse = await fetchTokenResponse();
      setToken(tokenResponse.token);
      setUserId(tokenResponse.user.communicationUserId);
    })();
  }, []);

  useEffect(() => {
    // Create a new CallClient when at the home page or at the createCallClient page.
    if (page === 'createCallClient' || page === 'home') {
      const newStatefulCallClient = createStatefulCallClient({
        userId: { kind: 'communicationUser', communicationUserId: userId }
      });
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
  }, [page, token, userId]);

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
            startCallHandler={async () => {
              // Generate a new CallAgent for the new call experience.
              try {
                const userCredential = createAzureCommunicationUserCredential(token, refreshTokenAsync(userId));
                setPage('createCallAgent');
                await callAgent?.dispose();
                const newCallAgent = await statefulCallClient?.createCallAgent(userCredential, { displayName });
                const audioOptions: AudioOptions = { muted: !isMicrophoneOn };
                const call = newCallAgent?.join(callLocator as GroupCallLocator, { audioOptions });
                setCall(call);
                setCallAgent(newCallAgent);
              } catch (error) {
                console.error(error);
                setPage('callError');
              }

              setPage('call');
            }}
            callType={callJoinType || 'newCall'}
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
                callLocator={callLocator}
                isMicrophoneOn={isMicrophoneOn}
                callInvitationURL={window.location.href}
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
    if (!supportedBrowser) return <UnsupportedBrowserPage />;

    if (!statefulCallClient)
      return <Spinner label={creatingCallClientspinnerLabel} ariaLive="assertive" labelPosition="top" />;

    if (isMobileSession() || isSmallScreen()) {
      console.log('ACS Calling sample: This is experimental behaviour');
    }

    // Show a simplified join home screen if joining an existing call
    const joiningExistingCall: boolean = page === 'home' && (!!getGroupIdFromUrl() || !!getTeamsLinkFromUrl());

    switch (page) {
      case 'home': {
        return (
          <HomeScreen
            joiningExistingCall={joiningExistingCall}
            startCallHandler={(callDetails) => {
              setDisplayName(callDetails.displayName);
              const isTeamsCall = !!callDetails.teamsLink;
              const callLocator =
                callDetails.teamsLink || getTeamsLinkFromUrl() || getGroupIdFromUrl() || createGroupId();
              setCallLocator(callLocator);
              setCallJoinType(joiningExistingCall ? (isTeamsCall ? 'teamsCall' : 'joinCall') : 'newCall');

              // Update window URL to have a joinable link
              if (!joiningExistingCall) {
                const joinParam = isTeamsCall
                  ? '?teamsLink=' + encodeURIComponent((callLocator as TeamsMeetingLinkLocator).meetingLink)
                  : '?groupId=' + (callLocator as GroupCallLocator).groupId;
                window.history.pushState({}, 'Joining Call', window.location.origin + joinParam);
              }

              setPage('configuration');
            }}
          />
        );
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
      case 'removed': {
        return (
          <CallError
            title="Oops! You are no longer a participant of the call."
            reason="Access to the meeting has been stopped"
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

export default App;
