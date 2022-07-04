// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { GroupCallLocator, GroupLocator, RoomLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { setLogLevel } from '@azure/logger';
import { initializeIcons, Spinner } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import {
  buildTime,
  callingSDKVersion,
  communicationReactSDKVersion,
  createGroupId,
  fetchTokenResponse,
  getGroupIdFromUrl,
  getRoomIdFromUrl,
  getTeamsLinkFromUrl,
  isLandscape,
  isOnIphoneAndNotSafari,
  joinRoom,
  navigateToHomePage,
  WEB_APP_TITLE
} from './utils/AppUtils';
import { useIsMobile } from './utils/useIsMobile';
import { useSecondaryInstanceCheck } from './utils/useSecondaryInstanceCheck';
import { CallError } from './views/CallError';
import { CallScreen } from './views/CallScreen';
import { EndCall } from './views/EndCall';
import { HomeScreen } from './views/HomeScreen';
import { PageOpenInAnotherTab } from './views/PageOpenInAnotherTab';
import { UnsupportedBrowserPage } from './views/UnsupportedBrowserPage';

setLogLevel('warning');

console.log(
  `ACS sample calling app. Last Updated ${buildTime} Using @azure/communication-calling:${callingSDKVersion} and @azure/communication-react:${communicationReactSDKVersion}`
);

initializeIcons();

type AppPages = 'home' | 'call' | 'endCall';

const App = (): JSX.Element => {
  const [page, setPage] = useState<AppPages>('home');

  // User credentials to join a call with - these are retrieved from the server
  const [token, setToken] = useState<string>();
  const [userId, setUserId] = useState<CommunicationUserIdentifier>();
  const [userCredentialFetchError, setUserCredentialFetchError] = useState<boolean>(false);

  // Call details to join a call - these are collected from the user on the home screen
  const [callLocator, setCallLocator] = useState<GroupLocator | TeamsMeetingLinkLocator | RoomLocator>(createGroupId());
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
  }, []);

  const isMobileSession = useIsMobile();
  const isLandscapeSession = isLandscape();
  const isAppAlreadyRunningInAnotherTab = useSecondaryInstanceCheck();

  useEffect(() => {
    if (isMobileSession && isLandscapeSession) {
      console.log('ACS Calling sample: Mobile landscape view is experimental behavior');
    }
  }, [isMobileSession, isLandscapeSession]);

  if (isMobileSession && isAppAlreadyRunningInAnotherTab) {
    return <PageOpenInAnotherTab />;
  }

  const supportedBrowser = !isOnIphoneAndNotSafari();
  if (!supportedBrowser) {
    return <UnsupportedBrowserPage />;
  }

  switch (page) {
    case 'home': {
      document.title = `home - ${WEB_APP_TITLE}`;
      // Show a simplified join home screen if joining an existing call
      const joiningExistingCall: boolean = !!getGroupIdFromUrl() || !!getTeamsLinkFromUrl() || !!getRoomIdFromUrl();
      return (
        <HomeScreen
          joiningExistingCall={joiningExistingCall}
          startCallHandler={(callDetails) => {
            setDisplayName(callDetails.displayName);
            const callLocator =
              callDetails.callLocator ||
              getTeamsLinkFromUrl() ||
              getGroupIdFromUrl() ||
              getRoomIdFromUrl() ||
              createGroupId();

            if ('roomId' in callLocator) {
              if (userId) {
                joinRoom(userId.communicationUserId, callLocator.roomId);
              } else {
                throw 'Invalid userId!';
              }
            }

            setCallLocator(callLocator);

            // Update window URL to have a joinable link
            if (!joiningExistingCall) {
              window.history.pushState({}, document.title, window.location.origin + getJoinParams(callLocator));
            }

            setPage('call');
          }}
          roomId={getRoomIdFromUrl()}
        />
      );
    }
    case 'endCall': {
      document.title = `end call - ${WEB_APP_TITLE}`;
      return <EndCall rejoinHandler={() => setPage('call')} homeHandler={navigateToHomePage} />;
    }
    case 'call': {
      if (userCredentialFetchError) {
        document.title = `error - ${WEB_APP_TITLE}`;
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
        document.title = `credentials - ${WEB_APP_TITLE}`;
        return <Spinner label={'Getting user credentials from server'} ariaLive="assertive" labelPosition="top" />;
      }
      return (
        <CallScreen
          token={token}
          userId={userId}
          displayName={displayName}
          callLocator={callLocator}
          onCallEnded={() => setPage('endCall')}
        />
      );
    }
    default:
      document.title = `error - ${WEB_APP_TITLE}`;
      return <>Invalid page</>;
  }
};

const getJoinParams = (locator: TeamsMeetingLinkLocator | GroupCallLocator | RoomLocator): string => {
  if ('meetingLink' in locator) {
    return '?teamsLink=' + encodeURIComponent(locator.meetingLink);
  } else if ('groupId' in locator) {
    return '?groupId=' + encodeURIComponent(locator.groupId);
  } else {
    return '?roomId=' + encodeURIComponent(locator.roomId);
  }
};

export default App;
