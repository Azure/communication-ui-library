// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { GroupCallLocator, GroupLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { DEFAULT_COMPONENT_ICONS } from '@azure/communication-react';
import { initializeIcons, registerIcons, Spinner } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import {
  ACSMeetingLocator,
  buildTime,
  callingSDKVersion,
  createGroupId,
  fetchTokenResponse,
  getEndpointUrl,
  getGroupIdFromUrl,
  getTeamsLinkFromUrl,
  isMobileSession,
  isOnIphoneAndNotSafari,
  isSmallScreen,
  joinThread,
  navigateToHomePage
} from './utils/AppUtils';
import { CallError } from './views/CallError';
import { CallScreen } from './views/CallScreen';
import { EndCall } from './views/EndCall';
import { HomeScreen } from './views/HomeScreen';
import { UnsupportedBrowserPage } from './views/UnsupportedBrowserPage';

console.log(
  `ACS sample calling app. Last Updated ${buildTime} Using @azure/communication-calling:${callingSDKVersion}`
);

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

type AppPages = 'home' | 'call' | 'endCall' | 'callError' | 'teamsMeetingDenied' | 'removed';

const App = (): JSX.Element => {
  const [page, setPage] = useState<AppPages>('home');

  // User credentials to join a call with - these are retrieved from the server
  const [token, setToken] = useState<string>();
  const [userId, setUserId] = useState<CommunicationUserIdentifier>();
  const [userCredentialFetchError, setUserCredentialFetchError] = useState<boolean>(false);

  // Call details to join a call - these are collected from the user on the home screen
  const [callLocator, setCallLocator] = useState<ACSMeetingLocator | TeamsMeetingLinkLocator | undefined>(undefined);
  const [endpointUrl, setEndpointUrl] = useState('');
  const [displayName, setDisplayName] = useState<string>('');

  // Get Azure Communications Service token from the server
  useEffect(() => {
    (async () => {
      try {
        const { token, user } = await fetchTokenResponse();
        setToken(token);
        setUserId(user);
      } catch (e) {
        console.error(e);
        setUserCredentialFetchError(true);
      }
    })();

    (async () => {
      try {
        setEndpointUrl(await getEndpointUrl());
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const supportedBrowser = !isOnIphoneAndNotSafari();
  if (!supportedBrowser) return <UnsupportedBrowserPage />;

  if (isMobileSession() || isSmallScreen()) {
    console.log('ACS Calling sample: This is experimental behaviour');
  }

  switch (page) {
    case 'home': {
      // Show a simplified join home screen if joining an existing call
      const joiningExistingCall: boolean = !!getGroupIdFromUrl() || !!getTeamsLinkFromUrl();
      return (
        <HomeScreen
          joiningExistingCall={joiningExistingCall}
          startCallHandler={async (callDetails) => {
            setDisplayName(callDetails.displayName);
            const isTeamsCall = !!callDetails.teamsLink;
            const callLocator =
              callDetails.teamsLink || getTeamsLinkFromUrl() || getGroupIdFromUrl() || (await createGroupId());
            setCallLocator(callLocator);

            if (!isTeamsCall && userId) {
              joinThread((callLocator as ACSMeetingLocator).threadId, userId.communicationUserId, displayName);
            }

            // Update window URL to have a joinable link
            if (!joiningExistingCall) {
              const joinParam = isTeamsCall
                ? '?teamsLink=' + encodeURIComponent((callLocator as TeamsMeetingLinkLocator).meetingLink)
                : '?groupId=' +
                  (callLocator as ACSMeetingLocator).groupLocator.groupId +
                  '&threadId=' +
                  (callLocator as ACSMeetingLocator).threadId;
              window.history.pushState({}, document.title, window.location.origin + joinParam);
            }

            setPage('call');
          }}
        />
      );
    }
    case 'endCall': {
      return <EndCall rejoinHandler={() => setPage('call')} homeHandler={navigateToHomePage} />;
    }
    case 'callError': {
      return <CallError rejoinHandler={() => setPage('call')} homeHandler={navigateToHomePage} />;
    }
    case 'teamsMeetingDenied': {
      return (
        <CallError
          title="Error joining Teams Meeting"
          reason="Access to the Teams meeting was denied."
          rejoinHandler={() => setPage('call')}
          homeHandler={navigateToHomePage}
        />
      );
    }
    case 'removed': {
      return (
        <CallError
          title="Oops! You are no longer a participant of the call."
          reason="Access to the meeting has been stopped"
          rejoinHandler={() => setPage('call')}
          homeHandler={navigateToHomePage}
        />
      );
    }
    case 'call': {
      if (userCredentialFetchError) {
        return (
          <CallError
            title="Error getting user credentials from server"
            reason="Ensure the sample server is running."
            rejoinHandler={() => setPage('call')}
            homeHandler={navigateToHomePage}
          />
        );
      }
      if (!token || !userId || !displayName || !callLocator) {
        return <Spinner label={'Getting user credentials from server'} ariaLive="assertive" labelPosition="top" />;
      }
      return (
        <CallScreen
          token={token}
          userId={userId}
          displayName={displayName}
          callLocator={callLocator}
          endpointUrl={endpointUrl}
          onCallEnded={() => setPage('endCall')}
          onCallError={() => setPage('callError')}
        />
      );
    }
    default:
      return <>Invalid page</>;
  }
};

export default App;
