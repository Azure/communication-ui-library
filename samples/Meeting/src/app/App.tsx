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
import { EndCall } from './views/EndCall';
import { HomeScreen } from './views/HomeScreen';
import { UnsupportedBrowserPage } from './views/UnsupportedBrowserPage';
import { getEndpointUrl } from './utils/getEndpointUrl';
import { joinThread } from './utils/joinThread';
import { getThread } from './utils/getThread';

const ALERT_TEXT_TRY_AGAIN = "You can't be added at this moment. Please wait at least 60 seconds to try again.";

console.log(
  `ACS sample Meeting app. Last Updated ${buildTime} Using @azure/communication-calling:${callingSDKVersion} and Using @azure/communication-chat:${chatSDKVersion}`
);

initializeIcons();

type AppPages = 'home' | 'meeting' | 'endMeeting';

const webAppTitle = document.title;

const App = (): JSX.Element => {
  const [page, setPage] = useState<AppPages>('home');

  // User credentials to join a call with - these are retrieved from the server
  const [token, setToken] = useState<string>();
  const [userId, setCallUserId] = useState<CommunicationUserIdentifier>();
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
        setToken(token);
        setCallUserId(user);
      } catch (e) {
        console.error(e);
        setUserCredentialFetchError(true);
      }
    })();
  }, []);

  useEffect(() => {
    const internalSetupAndJoinChatThread = async (): Promise<void> => {
      if (displayName && userId) {
        const newThreadId = await getThread(); // change name of onCreateThread
        const result = await joinThread(newThreadId, userId.communicationUserId, displayName);
        if (!result) {
          alert(ALERT_TEXT_TRY_AGAIN);
          return;
        }
        setEndpointUrl(await getEndpointUrl());
        setThreadId(newThreadId);
        window.history.pushState({}, document.title, window.location + `&threadId=${newThreadId}`);
      }
    };
    internalSetupAndJoinChatThread();
  }, [displayName, userId]);

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
                ? '?teamsLink=' + encodeURIComponent((callLocator as TeamsMeetingLinkLocator).meetingLink)
                : '?groupId=' + (callLocator as GroupCallLocator).groupId;

              window.history.pushState({}, document.title, window.location.origin + joinParam);
            }
            setPage('meeting');
          }}
        />
      );
    }
    case 'endMeeting': {
      document.title = `end meeting - ${webAppTitle}`;
      return <EndCall rejoinHandler={() => setPage('meeting')} homeHandler={navigateToHomePage} />;
    }
    case 'meeting': {
      if (userCredentialFetchError) {
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

      if (!token || !userId || !displayName || !callLocator || !endpointUrl || !threadId) {
        document.title = `credentials - ${webAppTitle}`;
        return <Spinner label={'Getting user credentials from server'} ariaLive="assertive" labelPosition="top" />;
      }
      return (
        <MeetingScreen
          token={token}
          userId={userId}
          displayName={displayName}
          callLocator={callLocator}
          onMeetingEnded={() => setPage('endMeeting')}
          webAppTitle={webAppTitle}
          endpoint={endpointUrl}
          threadId={threadId}
        />
      );
    }
    default:
      document.title = `error - ${webAppTitle}`;
      return <>Invalid page</>;
  }
};

export default App;
