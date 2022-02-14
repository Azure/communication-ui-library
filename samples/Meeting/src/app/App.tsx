// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { GroupCallLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { CallAndChatLocator } from '@azure/communication-react';
import { setLogLevel } from '@azure/logger';
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
import { CallAndChatScreen } from './views/MeetingScreen';
import { HomeScreen } from './views/HomeScreen';
import { UnsupportedBrowserPage } from './views/UnsupportedBrowserPage';
import { getEndpointUrl } from './utils/getEndpointUrl';
import { joinThread } from './utils/joinThread';
import { getThread } from './utils/getThread';
import { getExistingThreadIdFromURL } from './utils/getThreadId';
import { WEB_APP_TITLE } from './utils/constants';

setLogLevel('warning');
initializeIcons();

interface Credentials {
  userId: CommunicationUserIdentifier;
  token: string;
}
interface CallAndChatArgs {
  credentials: Credentials;
  endpointUrl: string;
  displayName: string;
  locator: CallAndChatLocator | TeamsMeetingLinkLocator;
}
type AppPages = 'home' | 'call' | 'error';

console.log(
  `ACS sample Call and Chat app. Last Updated ${buildTime} Using @azure/communication-calling:${callingSDKVersion} and Using @azure/communication-chat:${chatSDKVersion}`
);

const App = (): JSX.Element => {
  const [page, setPage] = useState<AppPages>('home');
  const [callAndChatArgs, setCallAndChatArgs] = useState<CallAndChatArgs | undefined>(undefined);

  if (isOnIphoneAndNotSafari()) {
    return <UnsupportedBrowserPage />;
  }

  const joiningExistingCallAndChat: boolean =
    (!!getGroupIdFromUrl() && !!getExistingThreadIdFromURL()) || !!getTeamsLinkFromUrl();

  switch (page) {
    case 'home': {
      document.title = `home - ${WEB_APP_TITLE}`;
      return (
        <HomeScreen
          // Show a simplified join home screen if joining an existing call
          joiningExistingCall={joiningExistingCallAndChat}
          startCallHandler={async (homeScreenDetails) => {
            setPage('call');
            try {
              const callAndChatArgs = await generateCallAndChatArgs(
                homeScreenDetails.displayName,
                homeScreenDetails?.teamsLink
              );
              setCallAndChatArgs(callAndChatArgs);
            } catch (e) {
              console.log(e);
              setPage('error');
            }
          }}
        />
      );
    }
    case 'call': {
      if (
        !callAndChatArgs?.credentials?.token ||
        !callAndChatArgs.credentials?.userId ||
        !callAndChatArgs.displayName ||
        !callAndChatArgs.locator ||
        !callAndChatArgs.endpointUrl
      ) {
        document.title = `credentials - ${WEB_APP_TITLE}`;
        return <Spinner label={'Getting user credentials from server'} ariaLive="assertive" labelPosition="top" />;
      }
      return (
        <CallAndChatScreen
          token={callAndChatArgs.credentials.token}
          userId={callAndChatArgs.credentials.userId}
          displayName={callAndChatArgs.displayName}
          locator={callAndChatArgs.locator}
          endpoint={callAndChatArgs.endpointUrl}
        />
      );
    }
    default:
      document.title = `error - ${WEB_APP_TITLE}`;
      return <>Invalid page</>;
  }
};

export default App;

const generateCallAndChatArgs = async (
  displayName: string,
  teamsLink?: TeamsMeetingLinkLocator
): Promise<CallAndChatArgs> => {
  const { token, user } = await fetchTokenResponse();
  const credentials = { userId: user, token: token };
  const endpointUrl = await getEndpointUrl();

  let locator: CallAndChatLocator | TeamsMeetingLinkLocator;

  // Check if we should join a teams meeting, or an ACS CallAndChat
  teamsLink = teamsLink ?? getTeamsLinkFromUrl();
  if (teamsLink) {
    locator = teamsLink;
    ensureJoinableTeamsLinkPushedToUrl(teamsLink);
  } else {
    const callLocator: GroupCallLocator = getGroupIdFromUrl() || createGroupId();
    ensureJoinableCallLocatorPushedToUrl(callLocator);

    const chatThreadId = await getThread();
    await joinThread(chatThreadId, credentials.userId.communicationUserId, displayName);
    ensureJoinableChatThreadPushedToUrl(chatThreadId);

    locator = {
      callLocator,
      chatThreadId
    };
  }

  return {
    displayName,
    endpointUrl,
    credentials,
    locator
  };
};
