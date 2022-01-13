// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { GroupCallLocator, GroupLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { initializeIcons, Spinner } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import {
  buildTime,
  callingSDKVersion,
  createGroupId,
  fetchTokenResponse,
  getGroupIdFromUrl,
  getTeamsLinkFromUrl,
  isMobileSession,
  isOnIphoneAndNotSafari,
  isSmallScreen,
  navigateToHomePage
} from './utils/AppUtils';
import { CallError } from './views/CallError';
import { MeetingScreen } from './views/MeetingScreen';
import { EndCall } from './views/EndCall';
import { HomeScreen } from './views/HomeScreen';
import { UnsupportedBrowserPage } from './views/UnsupportedBrowserPage';
import { getThreadId } from './utils/getThreadId';
import { createThread } from './utils/createThread';
import { checkThreadValid } from './utils/checkThreadValid';
import { getEndpointUrl } from './utils/getEndpointUrl';
import { joinThread } from './utils/joinThread';

console.log(
  `ACS sample Meeting app. Last Updated ${buildTime} Using @azure/communication-calling:${callingSDKVersion}`
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

  const ERROR_TEXT_THREAD_NOT_RECORDED = 'Thread id is not recorded in server';
  const ALERT_TEXT_TRY_AGAIN = "You can't be added at this moment. Please wait at least 60 seconds to try again.";

  const onCreateThread = async (): Promise<string> => {
    const exisitedThreadId = await getThreadId();
    if (exisitedThreadId && exisitedThreadId.length > 0) {
      if (!(await checkThreadValid(exisitedThreadId))) {
        throw new Error(ERROR_TEXT_THREAD_NOT_RECORDED);
      }
      return exisitedThreadId;
    }

    const threadId = await createThread();
    if (!threadId) {
      console.error('Failed to create a thread, returned threadId is undefined or empty string');
      return '';
    } else {
      return threadId;
    }
  };

  useEffect(() => {
    const internalSetupAndJoinChatThread = async (): Promise<void> => {
      if (displayName && userId) {
        const newThreadId = await onCreateThread(); // change name of onCreateThread
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

  if (isMobileSession() || isSmallScreen()) {
    console.log('ACS Meeting sample: This is experimental behaviour');
  }

  switch (page) {
    case 'home': {
      document.title = `home - ${webAppTitle}`;
      // Show a simplified join home screen if joining an existing call
      const joiningExistingCall: boolean = !!getGroupIdFromUrl() || !!getTeamsLinkFromUrl();
      return (
        <HomeScreen
          joiningExistingCall={joiningExistingCall}
          startMeetingHandler={(callDetails) => {
            setDisplayName(callDetails.displayName);
            const isTeamsCall = !!callDetails.teamsLink;
            const callLocator =
              callDetails.teamsLink || getTeamsLinkFromUrl() || getGroupIdFromUrl() || createGroupId();
            setCallLocator(callLocator);

            // Update window URL to have a joinable link

            if (!joiningExistingCall) {
              const joinParam = isTeamsCall
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
