// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommunicationUserIdentifier } from '@azure/communication-common';
/* @conditional-compile-remove(rooms) */
import { ParticipantRole } from '@azure/communication-calling';
import {
  CallingWidgetCallCompositeOptions,
  CallingWidgetComposite,
  fromFlatCommunicationIdentifier,
  StartCallIdentifier,
  toFlatCommunicationIdentifier
} from '@azure/communication-react';
/* @conditional-compile-remove(teams-identity-support) */
import { MicrosoftTeamsUserIdentifier } from '@azure/communication-common';
import { setLogLevel } from '@azure/logger';
import { Dropdown, initializeIcons, Spinner, Stack } from '@fluentui/react';
import { CallAdapterLocator } from '@azure/communication-react';
import React, { useEffect, useMemo, useState } from 'react';
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
/* @conditional-compile-remove(rooms) */
import { createRoom, getRoomIdFromUrl, addUserToRoom } from './utils/AppUtils';
import { useIsMobile } from './utils/useIsMobile';
import { CallError } from './views/CallError';
import { CallScreen } from './views/CallScreen';
import { HomeScreen } from './views/HomeScreen';
import { UnsupportedBrowserPage } from './views/UnsupportedBrowserPage';
import { createAutoRefreshingCredential } from './utils/credential';
import heroSVG from './../assets/hero.svg';

setLogLevel('error');

console.log(
  `ACS sample calling app. Last Updated ${buildTime} with CommitID:${commitID} using @azure/communication-calling:${callingSDKVersion} and @azure/communication-react:${communicationReactSDKVersion}`
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
  const [callLocator, setCallLocator] = useState<CallAdapterLocator>();
  //   {
  //   groupId: '2c69f815-2bc8-434f-932b-b43449b2c159'
  // }
  const [targetCallees, setTargetCallees] = useState<StartCallIdentifier[]>();
  //   [
  //   fromFlatCommunicationIdentifier('28:orgid:19b01e96-c923-433a-83e4-bda54446bad7')
  // ]
  const [displayName, setDisplayName] = useState<string>('');

  const [widgetTheme, setWidgetTheme] = useState<string>('default');

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

  const credential = useMemo(() => {
    if (userId && 'communicationUserId' in userId && token) {
      return createAutoRefreshingCredential(toFlatCommunicationIdentifier(userId), token);
    }
    return undefined;
  }, [token, userId]);

  const widgetAdapterArgs = useMemo(() => {
    if (userId && 'communicationUserId' in userId && token && credential) {
      return {
        userId: userId,
        credential: credential,
        displayName: displayName,
        locator: callLocator,
        /* @conditional-compile-remove(PSTN-calls) */
        alternateCallerId: alternateCallerId,
        options: {
          callingSounds: {
            callEnded: { url: '/assets/sounds/callEnded.mp3' },
            callRinging: { url: '/assets/sounds/callRinging.mp3' },
            callBusy: { url: '/assets/sounds/callBusy.mp3' }
          }
        }
      };
    }
    return;
  }, [credential, userId, token, displayName, callLocator, targetCallees, alternateCallerId]);

  const widgetRenderWaitingStatePika = (): JSX.Element => {
    return (
      <Stack
        style={{
          height: '7rem',
          width: '7rem',
          borderRadius: '50%',
          padding: '0.5rem',
          backgroundImage: `url("/assets/images/pika.png")`,
          backgroundSize: 'cover',
          backgroundOrigin: 'padding-box',
          backgroundPosition: 'center',
          boxShadow: '0rem 0 1.5rem'
        }}
      ></Stack>
    );
  };

  const pikaTheme = {
    palette: {
      themePrimary: '#693100',
      themeLighterAlt: '#f9f4ef',
      themeLighter: '#e7d3c2',
      themeLight: '#d2b093',
      themeTertiary: '#a57042',
      themeSecondary: '#7b410f',
      themeDarkAlt: '#5e2c00',
      themeDark: '#4f2500',
      themeDarker: '#3b1b00',
      neutralLighterAlt: '#f8e67c',
      neutralLighter: '#f4e27a',
      neutralLight: '#ead975',
      neutralQuaternaryAlt: '#daca6d',
      neutralQuaternary: '#d0c068',
      neutralTertiaryAlt: '#c8b964',
      neutralTertiary: '#f6acac',
      neutralSecondary: '#ed5f5f',
      neutralPrimaryAlt: '#e41b1b',
      neutralPrimary: '#e00000',
      neutralDark: '#ab0000',
      black: '#7e0000',
      white: '#ffec80'
    }
  };

  const widgetOptions: CallingWidgetCallCompositeOptions = {
    callControls: {
      cameraButton: false,
      screenShareButton: false,
      moreButton: false,
      peopleButton: false,
      raiseHandButton: false,
      displayType: 'default'
    },
    onRenderLogo:
      widgetTheme === 'pika'
        ? () => {
            return (
              <Stack style={{ height: '100%' }}>
                <img
                  style={{ transform: 'scale(0.6)', borderRadius: '50%', boxShadow: '0.5rem 0 1.5rem' }}
                  src={`/assets/images/pika.png`}
                  alt="cat header"
                />
              </Stack>
            );
          }
        : () => {
            return (
              <Stack style={{ height: '100%' }}>
                <img style={{ transform: 'scale(0.6)' }} src={`${heroSVG}`} alt="cat header" />
              </Stack>
            );
          },
    customFieldProps:
      widgetTheme === 'pika'
        ? [
            {
              key: '1',
              label: 'Custom Field 1',
              onChange: (newValue) => {
                console.log('Custom Field Value:', newValue);
              },
              kind: 'textBox',
              placeholder: 'Enter a value',
              onCallStart: () => {
                alert('Call Started');
              }
            },
            {
              key: '2',
              label: 'Custom Field 2',
              required: true,
              onChange: (newValue) => {
                console.log('Custom Field Value:', newValue);
              },
              kind: 'textBox',
              placeholder: 'Enter a value',
              onCallStart: () => {
                alert('Call Started');
              }
            },
            {
              key: '3',
              label: 'Custom Field 3',
              onChange: (newValue) => {
                console.log('Custom Field Value:', newValue);
              },
              kind: 'checkBox',
              defaultChecked: false,
              onCallStart: () => {
                alert('Call Started');
              }
            },
            {
              key: '4',
              label: 'Custom Field 4',
              onChange: (newValue) => {
                console.log('Custom Field Value:', newValue);
              },
              kind: 'checkBox',
              defaultChecked: false,
              onCallStart: () => {
                alert('Call Started');
              }
            },
            {
              key: '5',
              label: 'Custom Field 5',
              onChange: (newValue) => {
                console.log('Custom Field Value:', newValue);
              },
              kind: 'textBox',
              placeholder: 'Enter a value',
              onCallStart: () => {
                alert('Call Started');
              }
            }
          ]
        : undefined,
    position: widgetTheme === 'pika' ? 'bottomLeft' : 'bottomRight'
  };

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
        !!getGroupIdFromUrl() ||
        !!getTeamsLinkFromUrl() ||
        /* @conditional-compile-remove(rooms) */ !!getRoomIdFromUrl();
      return (
        <Stack>
          <HomeScreen
            joiningExistingCall={joiningExistingCall}
            startCallHandler={async (callDetails) => {
              setDisplayName(callDetails.displayName);
              /* @conditional-compile-remove(PSTN-calls) */
              setAlternateCallerId(callDetails.alternateCallerId);
              let callLocator: CallAdapterLocator | undefined =
                callDetails.callLocator ||
                /* @conditional-compile-remove(rooms) */ getRoomIdFromUrl() ||
                getTeamsLinkFromUrl() ||
                getGroupIdFromUrl() ||
                createGroupId();

              /* @conditional-compile-remove(rooms) */
              if (callDetails.option === 'Rooms') {
                callLocator = getRoomIdFromUrl() || callDetails.callLocator;
              }

              /* @conditional-compile-remove(PSTN-calls) */
              if (callDetails.option === '1:N' || callDetails.option === 'PSTN') {
                const outboundUsers = callDetails.outboundParticipants?.map((user) => {
                  return fromFlatCommunicationIdentifier(user);
                });
                callLocator = undefined;
                setTargetCallees(outboundUsers ?? []);
              }

              if (callDetails.option === 'TeamsAdhoc') {
                const outboundTeamsUsers = callDetails.outboundTeamsUsers?.map((user) => {
                  return fromFlatCommunicationIdentifier(user) as StartCallIdentifier;
                });
                callLocator = undefined;
                setTargetCallees(outboundTeamsUsers ?? []);
              }

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
                    getJoinParams(callLocator) +
                    /* @conditional-compile-remove(teams-identity-support) */
                    getIsCTEParam(!!callDetails.teamsToken)
                );
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
          <Dropdown
            label={'Widget Theme'}
            options={[
              {
                key: 'default',
                text: 'Default'
              },
              {
                key: 'pika',
                text: 'Pika'
              }
            ]}
            selectedKey={widgetTheme}
            onChange={(_, item) => {
              setWidgetTheme(item?.key as string);
            }}
          ></Dropdown>
          {widgetAdapterArgs && (
            <Stack id={'wrapper'}>
              <CallingWidgetComposite
                adapterProps={widgetAdapterArgs}
                options={widgetOptions}
                onRenderIdleWidget={widgetTheme === 'pika' ? widgetRenderWaitingStatePika : undefined}
                fluentTheme={widgetTheme === 'pika' ? pikaTheme : undefined}
              />
            </Stack>
          )}
        </Stack>
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
        (!targetCallees && !callLocator)
      ) {
        document.title = `credentials - ${WEB_APP_TITLE}`;
        return <Spinner label={'Getting user credentials from server'} ariaLive="assertive" labelPosition="top" />;
      }
      return (
        <CallScreen
          token={token}
          userId={userId}
          displayName={displayName}
          callLocator={callLocator}
          targetCallees={targetCallees}
          /* @conditional-compile-remove(PSTN-calls) */
          alternateCallerId={alternateCallerId}
          /* @conditional-compile-remove(teams-identity-support) */
          isTeamsIdentityCall={isTeamsCall}
        />
      );
    }
    default:
      document.title = `error - ${WEB_APP_TITLE}`;
      return <>Invalid page</>;
  }
};

/* @conditional-compile-remove(teams-identity-support) */
const getIsCTEParam = (isCTE?: boolean): string => {
  return isCTE ? '&isCTE=true' : '';
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
