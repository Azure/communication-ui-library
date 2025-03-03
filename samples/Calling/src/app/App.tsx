// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommunicationUserIdentifier } from '@azure/communication-common';
import { ParticipantRole } from '@azure/communication-calling';
import { fromFlatCommunicationIdentifier, StartCallIdentifier } from '@azure/communication-react';
import { MicrosoftTeamsUserIdentifier } from '@azure/communication-common';
import { setLogLevel } from '@azure/logger';
import { initializeIcons, Spinner, Stack } from '@fluentui/react';
import { CallAdapterLocator } from '@azure/communication-react';
import React, { useEffect, useState } from 'react';
import {
  buildTime,
  callingSDKVersion,
  commitID,
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
import { createRoom, getRoomIdFromUrl, addUserToRoom } from './utils/AppUtils';
import { useIsMobile } from './utils/useIsMobile';
import { CallError } from './views/CallError';
import { CallScreen } from './views/CallScreen';
import { HomeScreen } from './views/HomeScreen';
import { UnsupportedBrowserPage } from './views/UnsupportedBrowserPage';
import { getMeetingIdFromUrl } from './utils/AppUtils';

setLogLevel('verbose');

console.log(
  `ACS sample calling app. Last Updated ${buildTime} with CommitID:${commitID} using @azure/communication-calling:${callingSDKVersion} and @azure/communication-react:${communicationReactSDKVersion}`
);

initializeIcons();

type AppPages = 'home' | 'call';

const App = (): JSX.Element => {
  const [page, setPage] = useState<AppPages>('home');
  // User credentials to join a call with - these are retrieved from the server
  const [token, setToken] = useState<string>();
  const [userId, setUserId] = useState<CommunicationUserIdentifier | MicrosoftTeamsUserIdentifier>();
  const [userCredentialFetchError, setUserCredentialFetchError] = useState<boolean>(false);
  // Call details to join a call - these are collected from the user on the home screen
  const [callLocator, setCallLocator] = useState<CallAdapterLocator>();
  const [targetCallees, setTargetCallees] = useState<StartCallIdentifier[] | undefined>(undefined);
  const [displayName, setDisplayName] = useState<string>('');
  const [isTeamsCall, setIsTeamsCall] = useState<boolean>(false);
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

  useEffect(() => {
    if (isMobileSession && isLandscapeSession) {
      console.log('ACS Calling sample: Mobile landscape view is experimental behavior');
    }
  }, [isMobileSession, isLandscapeSession]);

  const supportedBrowser = !isOnIphoneAndNotSafari();
  if (!supportedBrowser) {
    return <UnsupportedBrowserPage />;
  }

  switch (page) {
    case 'home': {
      document.title = `home - ${WEB_APP_TITLE}`;
      // Show a simplified join home screen if joining an existing call
      const joiningExistingCall: boolean =
        !!getGroupIdFromUrl() || !!getTeamsLinkFromUrl() || !!getMeetingIdFromUrl() || !!getRoomIdFromUrl();
      return (
        <HomeScreen
          joiningExistingCall={joiningExistingCall}
          startCallHandler={async (callDetails) => {
            setDisplayName(callDetails.displayName);
            setAlternateCallerId(callDetails.alternateCallerId);
            let callLocator: CallAdapterLocator | undefined =
              callDetails.callLocator ||
              getRoomIdFromUrl() ||
              getTeamsLinkFromUrl() ||
              getMeetingIdFromUrl() ||
              getGroupIdFromUrl() ||
              createGroupId();

            if (callDetails.option === 'Rooms') {
              callLocator = getRoomIdFromUrl() || callDetails.callLocator;
            }

            if (callDetails.option === '1:N' || callDetails.option === 'PSTN') {
              const outboundUsers = callDetails.outboundParticipants?.map((user) => {
                return fromFlatCommunicationIdentifier(user);
              });
              callLocator = undefined;
              setTargetCallees(outboundUsers);
            }

            if (callDetails.option === 'TeamsAdhoc') {
              const outboundTeamsUsers = callDetails.outboundTeamsUsers?.map((user) => {
                return fromFlatCommunicationIdentifier(user) as StartCallIdentifier;
              });
              callLocator = undefined;
              setTargetCallees(outboundTeamsUsers);
            }

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

            if (callLocator && 'roomId' in callLocator) {
              if (userId && 'communicationUserId' in userId) {
                await addUserToRoom(
                  userId.communicationUserId,
                  callLocator.roomId,
                  callDetails.role as ParticipantRole
                );
              } else {
                throw 'Invalid userId!';
              }
            }
            setCallLocator(callLocator);
            // Update window URL to have a joinable link
            if (callLocator && !joiningExistingCall) {
              window.history.pushState(
                {},
                document.title,
                window.location.origin +
                  window.location.pathname +
                  getJoinParams(callLocator) +
                  getIsCTEParam(!!callDetails.teamsToken)
              );
            }
            setIsTeamsCall(!!callDetails.teamsToken);
            callDetails.teamsToken && setToken(callDetails.teamsToken);
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

      if (!token || !userId || (!displayName && !isTeamsCall) || (!targetCallees && !callLocator)) {
        document.title = `credentials - ${WEB_APP_TITLE}`;
        return (
          <Stack horizontalAlign="center" verticalAlign="center" styles={{ root: { height: '100%' } }}>
            <Spinner label={'Getting user credentials from server'} ariaLive="assertive" labelPosition="top" />
          </Stack>
        );
      }
      return (
        <CallScreen
          token={token}
          userId={userId}
          displayName={displayName}
          callLocator={callLocator}
          targetCallees={targetCallees}
          alternateCallerId={alternateCallerId}
          isTeamsIdentityCall={isTeamsCall}
        />
      );
    }
    default:
      document.title = `error - ${WEB_APP_TITLE}`;
      return <>Invalid page</>;
  }
};

const getIsCTEParam = (isCTE?: boolean): string => {
  return isCTE ? '&isCTE=true' : '';
};

const getJoinParams = (locator: CallAdapterLocator): string => {
  if ('meetingLink' in locator) {
    return '?teamsLink=' + encodeURIComponent(locator.meetingLink);
  }
  if ('meetingId' in locator) {
    return (
      '?meetingId=' + encodeURIComponent(locator.meetingId) + (locator.passcode ? '&passcode=' + locator.passcode : '')
    );
  }
  if ('roomId' in locator) {
    return '?roomId=' + encodeURIComponent(locator.roomId);
  }
  if ('participantIds' in locator) {
    return '';
  }
  return '?groupId=' + encodeURIComponent(locator.groupId);
};

export default App;
