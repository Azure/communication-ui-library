// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationUserIdentifier } from '@azure/communication-common';
/* @conditional-compile-remove(rooms) */
import { Role } from '@azure/communication-react';
/* @conditional-compile-remove(teams-identity-support) */
import { fromFlatCommunicationIdentifier } from '@azure/communication-react';
/* @conditional-compile-remove(teams-identity-support) */
import { MicrosoftTeamsUserIdentifier } from '@azure/communication-common';
import { setLogLevel } from '@azure/logger';
import { initializeIcons, Spinner } from '@fluentui/react';
import { CallAdapterLocator } from '@azure/communication-react';
import React, { useEffect, useState } from 'react';
import {
  buildTime,
  callingSDKVersion,
  communicationReactSDKVersion,
  createGroupId,
  fetchTokenResponse,
  getGroupIdFromUrl,
  getTeamsLinkFromUrl,
  isLandscape,
  isOnIphoneAndNotSafari,
  navigateToHomePage,
  WEB_APP_TITLE
} from './utils/AppUtils';
/* @conditional-compile-remove(PSTN-calls) */
/* @conditional-compile-remove(one-to-n-calling) */
import { getOutboundParticipants } from './utils/AppUtils';
/* @conditional-compile-remove(rooms) */
import { createRoom, getRoomIdFromUrl, addUserToRoom } from './utils/AppUtils';
import { useIsMobile } from './utils/useIsMobile';
import { useSecondaryInstanceCheck } from './utils/useSecondaryInstanceCheck';
import { CallError } from './views/CallError';
import { CallScreen } from './views/CallScreen';
import { HomeScreen } from './views/HomeScreen';
import { PageOpenInAnotherTab } from './views/PageOpenInAnotherTab';
import { UnsupportedBrowserPage } from './views/UnsupportedBrowserPage';

setLogLevel('warning');

console.log(
  `ACS sample calling app. Last Updated ${buildTime} Using @azure/communication-calling:${callingSDKVersion} and @azure/communication-react:${communicationReactSDKVersion}`
);

initializeIcons();

type AppPages = 'home' | 'call';

const App = (): JSX.Element => {
  const [page, setPage] = useState<AppPages>('home');

  // User credentials to join a call with - these are retrieved from the server
  const [token, setToken] = useState<string>();
  const [userId, setUserId] = useState<
    CommunicationUserIdentifier | /* @conditional-compile-remove(teams-identity-support) */ MicrosoftTeamsUserIdentifier
  >();
  const [userCredentialFetchError, setUserCredentialFetchError] = useState<boolean>(false);

  // Call details to join a call - these are collected from the user on the home screen
  const [callLocator, setCallLocator] = useState<CallAdapterLocator>(createGroupId());
  const [displayName, setDisplayName] = useState<string>('');
  /* @conditional-compile-remove(rooms) */
  const [role, setRole] = useState<Role>();

  /* @conditional-compile-remove(teams-identity-support) */
  const [isTeamsCall, setIsTeamsCall] = useState<boolean>(false);

  /* @conditional-compile-remove(PSTN-calls) */
  const [alternateCallerId, setAlternateCallerId] = useState<string | undefined>();

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
      const joiningExistingCall: boolean =
        !!getGroupIdFromUrl() ||
        !!getTeamsLinkFromUrl() ||
        /* @conditional-compile-remove(rooms) */ !!getRoomIdFromUrl();
      return (
        <HomeScreen
          joiningExistingCall={joiningExistingCall}
          startCallHandler={async (callDetails) => {
            setDisplayName(callDetails.displayName);
            /* @conditional-compile-remove(PSTN-calls) */
            setAlternateCallerId(callDetails.alternateCallerId);
            let callLocator: CallAdapterLocator | undefined =
              //{ kind: 'IncomingCallLocator' } ||
              callDetails.callLocator || getTeamsLinkFromUrl() || getGroupIdFromUrl();

            /* @conditional-compile-remove(rooms) */
            callLocator = callLocator || getRoomIdFromUrl();

            /* @conditional-compile-remove(PSTN-calls) */
            callLocator = callLocator || getOutboundParticipants(callDetails.outboundParticipants);

            /* @conditional-compile-remove(teams-adhoc-call) */
            callLocator = callLocator || getOutboundParticipants(callDetails.outboundTeamsUsers);

            callLocator = callLocator || createGroupId();

            /* @conditional-compile-remove(rooms) */
            // There is an API call involved with creating a room so lets only create one if we know we have to
            if (callDetails.option === 'StartRooms') {
              let roomId = '';
              try {
                roomId = await createRoom();
              } catch (e) {
                console.log(e);
              }

              callLocator = { roomId: roomId };
            }

            /* @conditional-compile-remove(rooms) */
            if ('roomId' in callLocator) {
              if (userId && 'communicationUserId' in userId) {
                setRole(callDetails.role as Role);
                await addUserToRoom(userId.communicationUserId, callLocator.roomId, callDetails.role as Role);
              } else {
                throw 'Invalid userId!';
              }
            }
            setCallLocator(callLocator);

            // Update window URL to have a joinable link
            if (!joiningExistingCall) {
              window.history.pushState({}, document.title, window.location.origin + getJoinParams(callLocator));
            }
            /* @conditional-compile-remove(teams-identity-support) */
            setIsTeamsCall(!!callDetails.teamsToken);
            /* @conditional-compile-remove(teams-identity-support) */
            callDetails.teamsToken && setToken(callDetails.teamsToken);
            /* @conditional-compile-remove(teams-identity-support) */
            callDetails.teamsId &&
              setUserId(fromFlatCommunicationIdentifier(callDetails.teamsId) as MicrosoftTeamsUserIdentifier);
            setPage('call');
          }}
        />
      );
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

      if (
        !token ||
        !userId ||
        (!displayName && /* @conditional-compile-remove(teams-identity-support) */ !isTeamsCall) ||
        !callLocator
      ) {
        document.title = `credentials - ${WEB_APP_TITLE}`;
        return <Spinner label={'Getting user credentials from server'} ariaLive="assertive" labelPosition="top" />;
      }
      return (
        <React.StrictMode>
          <CallScreen
            token={token}
            userId={userId}
            displayName={displayName}
            callLocator={callLocator}
            /* @conditional-compile-remove(PSTN-calls) */
            alternateCallerId={alternateCallerId}
            /* @conditional-compile-remove(rooms) */
            roleHint={role}
            /* @conditional-compile-remove(teams-identity-support) */
            isTeamsIdentityCall={isTeamsCall}
          />
        </React.StrictMode>
      );
    }
    default:
      document.title = `error - ${WEB_APP_TITLE}`;
      return <>Invalid page</>;
  }
};

const getJoinParams = (locator: CallAdapterLocator): string => {
  if ('meetingLink' in locator) {
    return '?teamsLink=' + encodeURIComponent(locator.meetingLink);
  }
  /* @conditional-compile-remove(rooms) */
  if ('roomId' in locator) {
    return '?roomId=' + encodeURIComponent(locator.roomId);
  }
  /* @conditional-compile-remove(PSTN-calls) */
  if ('participantIds' in locator) {
    return '';
  }
  return '?groupId=' + encodeURIComponent(locator.groupId);
};

export default App;
