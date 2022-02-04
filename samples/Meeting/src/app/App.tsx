// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { GroupCallLocator, CallAndChatLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { initializeIcons, Spinner } from '@fluentui/react';
import React, { useState } from 'react';
import {
  buildTime,
  callingSDKVersion,
  chatSDKVersion,
  createGroupId,
  ensureJoinableCallLocatorPushedToUrl,
  ensureJoinableChatThreadPushedToUrl,
  ensureJoinableTeamsLinkPushedToUrl,
  fetchTokenResponse,
  getGroupIdFromUrl,
  getTeamsLinkFromUrl,
  isOnIphoneAndNotSafari
} from './utils/AppUtils';
import { MeetingScreen } from './views/MeetingScreen';
import { HomeScreen } from './views/HomeScreen';
import { UnsupportedBrowserPage } from './views/UnsupportedBrowserPage';
import { getEndpointUrl } from './utils/getEndpointUrl';
import { joinThread } from './utils/joinThread';
import { getThread } from './utils/getThread';
import { getExistingThreadIdFromURL } from './utils/getThreadId';

initializeIcons();

interface Credentials {
  userId: CommunicationUserIdentifier;
  token: string;
}
interface MeetingArgs {
  credentials: Credentials;
  endpointUrl: string;
  displayName: string;
  meetingLocator: CallAndChatLocator | TeamsMeetingLinkLocator;
}
type AppPages = 'home' | 'meeting' | 'error';

const webAppTitle = document.title;

const App = (): JSX.Element => {
  console.log(
    `ACS sample Meeting app. Last Updated ${buildTime} Using @azure/communication-calling:${callingSDKVersion} and Using @azure/communication-chat:${chatSDKVersion}`
  );

  const [page, setPage] = useState<AppPages>('home');
  const [meetingArgs, setMeetingArgs] = useState<MeetingArgs | undefined>(undefined);

  if (isOnIphoneAndNotSafari()) {
    return <UnsupportedBrowserPage />;
  }

  const joiningExistingMeeting: boolean =
    (!!getGroupIdFromUrl() && !!getExistingThreadIdFromURL()) || !!getTeamsLinkFromUrl();

  switch (page) {
    case 'home': {
      document.title = `home - ${webAppTitle}`;
      return (
        <HomeScreen
          // Show a simplified join home screen if joining an existing call
          joiningExistingCall={joiningExistingMeeting}
          startMeetingHandler={async (meetingDetails) => {
            setPage('meeting');
            try {
              const meetingArgs = await generateMeetingArgs(meetingDetails.displayName, meetingDetails?.teamsLink);
              setMeetingArgs(meetingArgs);
            } catch (e) {
              console.log(e);
              setPage('error');
            }
          }}
        />
      );
    }
    case 'meeting': {
      if (
        !meetingArgs?.credentials?.token ||
        !meetingArgs.credentials?.userId ||
        !meetingArgs.displayName ||
        !meetingArgs.meetingLocator ||
        !meetingArgs.endpointUrl
      ) {
        document.title = `credentials - ${webAppTitle}`;
        return <Spinner label={'Getting user credentials from server'} ariaLive="assertive" labelPosition="top" />;
      }
      return (
        <MeetingScreen
          token={meetingArgs.credentials.token}
          userId={meetingArgs.credentials.userId}
          displayName={meetingArgs.displayName}
          meetingLocator={meetingArgs.meetingLocator}
          webAppTitle={webAppTitle}
          endpoint={meetingArgs.endpointUrl}
        />
      );
    }
    default:
      document.title = `error - ${webAppTitle}`;
      return <>Invalid page</>;
  }
};

export default App;

const generateMeetingArgs = async (displayName: string, teamsLink?: TeamsMeetingLinkLocator): Promise<MeetingArgs> => {
  const { token, user } = await fetchTokenResponse();
  const credentials = { userId: user, token: token };
  const endpointUrl = await getEndpointUrl();

  let meetingLocator: CallAndChatLocator | TeamsMeetingLinkLocator;

  // Check if we should join a teams meeting, or an ACS CallAndChat
  teamsLink = teamsLink ?? getTeamsLinkFromUrl();
  if (teamsLink) {
    meetingLocator = teamsLink;
    ensureJoinableTeamsLinkPushedToUrl(teamsLink);
  } else {
    const callLocator: GroupCallLocator = getGroupIdFromUrl() || createGroupId();
    ensureJoinableCallLocatorPushedToUrl(callLocator);

    const chatThreadId = await getThread();
    await joinThread(chatThreadId, credentials.userId.communicationUserId, displayName);
    ensureJoinableChatThreadPushedToUrl(chatThreadId);

    meetingLocator = {
      callLocator,
      chatThreadId
    };
  }

  return {
    displayName,
    endpointUrl,
    credentials,
    meetingLocator
  };
};
