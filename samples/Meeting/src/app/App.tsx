// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { GroupCallLocator, GroupLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { initializeIcons, Spinner } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import {
  buildTime,
  callingSDKVersion,
  chatSDKVersion,
  createGroupId,
  fetchTokenResponse,
  getGroupIdFromUrl,
  getTeamsLinkFromUrl,
  isOnIphoneAndNotSafari,
  navigateToHomePage
} from './utils/AppUtils';
import { CallError } from './views/CallError';
import { MeetingScreen } from './views/MeetingScreen';
import { HomeScreen } from './views/HomeScreen';
import { UnsupportedBrowserPage } from './views/UnsupportedBrowserPage';
import { getEndpointUrl } from './utils/getEndpointUrl';
import { joinThread } from './utils/joinThread';
import { getThread } from './utils/getThread';
import { pushQSPUrl } from './utils/pushQSPUrl';

const ALERT_TEXT_TRY_AGAIN = "You can't be added at this moment. Please wait at least 60 seconds to try again.";

interface Credentials {
  userId: CommunicationUserIdentifier;
  token: string;
}

const App = (): JSX.Element => {
  console.log(
    `ACS sample Meeting app. Last Updated ${buildTime} Using @azure/communication-calling:${callingSDKVersion} and Using @azure/communication-chat:${chatSDKVersion}`
  );

  initializeIcons();

  type AppPages = 'home' | 'meeting' | 'error';

  const webAppTitle = document.title;
  const [page, setPage] = useState<AppPages>('home');

  // User credentials to join a call with - these are retrieved from the server
  const [token, setToken] = useState<string>();
  const [credentials, setCredentials] = useState<Credentials | undefined>(undefined);
  const [userCredentialFetchError, setUserCredentialFetchError] = useState<boolean>(false);

  // Call details to join a call - these are collected from the user on the home screen
  const [callLocator, setCallLocator] = useState<GroupLocator | TeamsMeetingLinkLocator>(createGroupId());
  const [displayName, setDisplayName] = useState<string>('');

  // Chat endpoint and thread id
  const [endpointUrl, setEndpointUrl] = useState('');
  const [threadId, setThreadId] = useState('');

  // Get Azure Communications Service token from the server
  useEffect(() => {
    (async () => {
      try {
        const { token, user } = await fetchTokenResponse();
        setCredentials({ userId: user, token: token });
      } catch (e) {
        console.error(e);
        setPage('error');
      }
    })();
  }, []);

  useEffect(() => {
    const internalSetupAndJoinChatThread = async (): Promise<void> => {
      if (displayName && credentials !== undefined) {
        const newThreadId = await getThread(); // change name of onCreateThread
        const result = await joinThread(newThreadId, credentials.userId.communicationUserId, displayName);
        if (!result) {
          alert(ALERT_TEXT_TRY_AGAIN);
          return;
        }
        setEndpointUrl(await getEndpointUrl());
        setThreadId(newThreadId);
        pushQSPUrl({ name: 'threadId', value: newThreadId });
      }
    };
    internalSetupAndJoinChatThread();
  }, [displayName, credentials?.userId.communicationUserId]);

  const supportedBrowser = !isOnIphoneAndNotSafari();
  if (!supportedBrowser) {
    return <UnsupportedBrowserPage />;
  }

  switch (page) {
    case 'home': {
      document.title = `home - ${webAppTitle}`;
      // Show a simplified join home screen if joining an existing call
      const joiningExistingMeeting: boolean = !!getGroupIdFromUrl() || !!getTeamsLinkFromUrl();
      return (
        <HomeScreen
          joiningExistingCall={joiningExistingMeeting}
          startMeetingHandler={(callDetails) => {
            setDisplayName(callDetails.displayName);
            const isTeamsMeeting = !!callDetails.teamsLink;
            const callLocator =
              callDetails.teamsLink || getTeamsLinkFromUrl() || getGroupIdFromUrl() || createGroupId();
            setCallLocator(callLocator);

            // Update window URL to have a joinable link

            if (!joiningExistingMeeting) {
              const joinParam = isTeamsMeeting
                ? {
                    name: 'teamsLink',
                    value: encodeURIComponent((callLocator as TeamsMeetingLinkLocator).meetingLink)
                  }
                : { name: 'groupId', value: (callLocator as GroupCallLocator).groupId };

              pushQSPUrl(joinParam);
            }
            setPage('meeting');
          }}
        />
      );
    }
    case 'meeting': {
      if (!credentials?.token || !credentials?.userId || !displayName || !callLocator || !endpointUrl || !threadId) {
        document.title = `credentials - ${webAppTitle}`;
        return <Spinner label={'Getting user credentials from server'} ariaLive="assertive" labelPosition="top" />;
      }
      return (
        <MeetingScreen
          token={credentials.token}
          userId={credentials.userId}
          displayName={displayName}
          callLocator={callLocator}
          webAppTitle={webAppTitle}
          endpoint={endpointUrl}
          threadId={threadId}
        />
      );
    }
    case 'error': {
      document.title = `error - ${webAppTitle}`;
      return (
        <CallError
          title="Error getting user credentials from server"
          reason="Ensure the sample server is running."
          rejoinHandler={() => setPage('meeting')}
          homeHandler={navigateToHomePage}
        />
      );
    }
    default:
      document.title = `error - ${webAppTitle}`;
      return <>Invalid page</>;
  }
};

export default App;
