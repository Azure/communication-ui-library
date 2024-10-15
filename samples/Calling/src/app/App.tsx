// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAdapter,
  createAzureCommunicationCallAdapter,
  toFlatCommunicationIdentifier
} from '@azure/communication-react';
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
import { getRoomIdFromUrl } from './utils/AppUtils';
import { useIsMobile } from './utils/useIsMobile';
import { CallError } from './views/CallError';
import { HomeScreen } from './views/HomeScreen';
import { UnsupportedBrowserPage } from './views/UnsupportedBrowserPage';
import { getMeetingIdFromUrl } from './utils/AppUtils';
import { createAutoRefreshingCredential } from './utils/credential';
import { CallCompositeContainer } from './views/CallCompositeContainer';

setLogLevel('error');

console.log(
  `ACS sample calling app. Last Updated ${buildTime} with CommitID:${commitID} using @azure/communication-calling:${callingSDKVersion} and @azure/communication-react:${communicationReactSDKVersion}`
);

initializeIcons();

type AppPages = 'home' | 'call';

const App = (): JSX.Element => {
  const [page, setPage] = useState<AppPages>('home');
  const [adapter, setAdapter] = useState<CallAdapter>();

  // User credentials to join a call with - these are retrieved from the server
  const [token, setToken] = useState<string>();
  const [userId, setUserId] = useState<CommunicationUserIdentifier>();
  const [userCredentialFetchError, setUserCredentialFetchError] = useState<boolean>(false);

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
            if (!userId) {
              console.error('User identity not set');
              return;
            }
            if (!token) {
              console.error('Token not set');
              return;
            }
            const callLocator: CallAdapterLocator | undefined = createGroupId();
            const credential = createAutoRefreshingCredential(toFlatCommunicationIdentifier(userId), token);

            const adapter = await createAzureCommunicationCallAdapter({
              userId,
              credential,
              displayName: callDetails.displayName,
              locator: callLocator
            });
            adapter.startCall(['stub-mri']);
            setAdapter(adapter);

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

      if (!adapter) {
        document.title = `credentials - ${WEB_APP_TITLE}`;
        return (
          <Stack horizontalAlign="center" verticalAlign="center" styles={{ root: { height: '100%' } }}>
            <Spinner label={'Getting user credentials from server'} ariaLive="assertive" labelPosition="top" />
          </Stack>
        );
      }
      return <CallCompositeContainer adapter={adapter} userId={userId!.communicationUserId} />;
    }
    default:
      document.title = `error - ${WEB_APP_TITLE}`;
      return <>Invalid page</>;
  }
};

export default App;
