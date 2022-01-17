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

interface CallArgs {
  callLocator: GroupLocator | TeamsMeetingLinkLocator;
  displayName: string;
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
  const [credentials, setCredentials] = useState<Credentials | undefined>(undefined);

  // Call details to join a call - these are collected from the user on the home screen
  const [callArgs, setCallArgs] = useState<CallArgs | undefined>({ displayName: '', callLocator: createGroupId() });

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
    (async () => {
      if (callArgs?.displayName && credentials !== undefined) {
        const newThreadId = await getThread();
        const result = await joinThread(newThreadId, credentials.userId.communicationUserId, callArgs.displayName);
        if (!result) {
          alert(ALERT_TEXT_TRY_AGAIN);
          return;
        }
        setEndpointUrl(await getEndpointUrl());
        setThreadId(newThreadId);
        pushQSPUrl({ name: 'threadId', value: newThreadId });
      }
    })();
  }, [callArgs?.displayName, credentials?.userId.communicationUserId]);

  if (isOnIphoneAndNotSafari()) {
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
            const isTeamsMeeting = !!callDetails.teamsLink;
            setCallArgs({
              displayName: callDetails.displayName,
              callLocator: callDetails.teamsLink || getTeamsLinkFromUrl() || getGroupIdFromUrl() || createGroupId()
            });

            // Update window URL to have a joinable link

            if (!joiningExistingMeeting) {
              const joinParam = isTeamsMeeting
                ? {
                    name: 'teamsLink',
                    value: encodeURIComponent((callArgs?.callLocator as TeamsMeetingLinkLocator).meetingLink)
                  }
                : { name: 'groupId', value: (callArgs?.callLocator as GroupCallLocator).groupId };
              pushQSPUrl(joinParam);
            }
            setPage('meeting');
          }}
        />
      );
    }
    case 'meeting': {
      if (
        !credentials?.token ||
        !credentials?.userId ||
        !callArgs?.displayName ||
        !callArgs.callLocator ||
        !endpointUrl ||
        !threadId
      ) {
        document.title = `credentials - ${webAppTitle}`;
        return <Spinner label={'Getting user credentials from server'} ariaLive="assertive" labelPosition="top" />;
      }
      return (
        <MeetingScreen
          token={credentials.token}
          userId={credentials.userId}
          displayName={callArgs.displayName}
          callLocator={callArgs.callLocator}
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
