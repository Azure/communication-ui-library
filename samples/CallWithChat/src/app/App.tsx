// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { GroupCallLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { TeamsMeetingIdLocator } from '@azure/communication-calling';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { CallAndChatLocator } from '@azure/communication-react';
import { setLogLevel } from '@azure/logger';
import { initializeIcons, Spinner } from '@fluentui/react';
import React, { useState } from 'react';
import {
  buildTime,
  callingSDKVersion,
  chatSDKVersion,
  commitID,
  communicationReactSDKVersion,
  createGroupId,
  ensureJoinableCallLocatorPushedToUrl,
  ensureJoinableChatThreadPushedToUrl,
  ensureJoinableTeamsLinkPushedToUrl,
  fetchTokenResponse,
  getGroupIdFromUrl,
  getTeamsLinkFromUrl,
  isOnIphoneAndNotSafari
} from './utils/AppUtils';
import { ensureJoinableMeetingIdPushedToUrl, getMeetingIdFromUrl } from './utils/AppUtils';
import { CallScreen } from './views/CallScreen';
import { HomeScreen } from './views/HomeScreen';
import { UnsupportedBrowserPage } from './views/UnsupportedBrowserPage';
import { getEndpointUrl } from './utils/getEndpointUrl';
import { joinThread } from './utils/joinThread';
import { getThread } from './utils/getThread';
import { getExistingThreadIdFromURL } from './utils/getThreadId';
import { WEB_APP_TITLE } from './utils/constants';
/* @conditional-compile-remove(call-participants-locator) */
import { CallParticipantsLocator } from '@azure/communication-react';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';

setLogLevel('error');
initializeIcons();
initializeFileTypeIcons();

interface Credentials {
  userId: CommunicationUserIdentifier;
  token: string;
}
interface CallWithChatArgs {
  credentials: Credentials;
  endpointUrl: string;
  displayName: string;
  locator: CallAndChatLocator | TeamsMeetingLinkLocator | TeamsMeetingIdLocator;
  alternateCallerId?: string;
  /* @conditional-compile-remove(rich-text-editor-composite-support) */ isRichTextEditorEnabled?: boolean;
}
type AppPages = 'home' | 'call' | 'error';

console.log(
  `ACS sample Call with Chat app. Last Updated ${buildTime} with CommitID:${commitID} using @azure/communication-calling:${callingSDKVersion}, @azure/communication-chat:${chatSDKVersion}, and @azure/communication-react:${communicationReactSDKVersion}`
);

const App = (): JSX.Element => {
  const [page, setPage] = useState<AppPages>('home');
  const [callWithChatArgs, setCallWithChatArgs] = useState<CallWithChatArgs | undefined>(undefined);

  if (isOnIphoneAndNotSafari()) {
    return <UnsupportedBrowserPage />;
  }

  const joiningExistingCallWithChat: boolean =
    (!!getGroupIdFromUrl() && !!getExistingThreadIdFromURL()) || !!getTeamsLinkFromUrl() || !!getMeetingIdFromUrl();

  switch (page) {
    case 'home': {
      document.title = `home - ${WEB_APP_TITLE}`;
      return (
        <HomeScreen
          // Show a simplified join home screen if joining an existing call
          joiningExistingCall={joiningExistingCallWithChat}
          startCallHandler={async (homeScreenDetails) => {
            setPage('call');
            try {
              const callWithChatArgs = await generateCallWithChatArgs(
                homeScreenDetails.displayName,
                homeScreenDetails?.meetingLocator,
                homeScreenDetails.alternateCallerId,
                homeScreenDetails.outboundParticipants,
                /* @conditional-compile-remove(rich-text-editor-composite-support) */ homeScreenDetails.isRichTextEditorEnabled
              );
              setCallWithChatArgs(callWithChatArgs);
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
        !callWithChatArgs?.credentials?.token ||
        !callWithChatArgs.credentials?.userId ||
        !callWithChatArgs.displayName ||
        !callWithChatArgs.locator ||
        !callWithChatArgs.endpointUrl
      ) {
        document.title = `credentials - ${WEB_APP_TITLE}`;
        return <Spinner label={'Getting user credentials from server'} ariaLive="assertive" labelPosition="top" />;
      }
      return (
        <CallScreen
          token={callWithChatArgs.credentials.token}
          userId={callWithChatArgs.credentials.userId}
          displayName={callWithChatArgs.displayName}
          locator={callWithChatArgs.locator}
          endpoint={callWithChatArgs.endpointUrl}
          alternateCallerId={callWithChatArgs.alternateCallerId}
          /* @conditional-compile-remove(rich-text-editor-composite-support) */
          isRichTextEditorEnabled={callWithChatArgs.isRichTextEditorEnabled}
        />
      );
    }
    default:
      document.title = `error - ${WEB_APP_TITLE}`;
      return <>Invalid page</>;
  }
};

export default App;

const generateCallWithChatArgs = async (
  displayName: string,
  teamsLocator?: TeamsMeetingLinkLocator | TeamsMeetingIdLocator,
  alternateCallerId?: string,
  outboundParticipants?: string[],
  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  isRichTextEditorEnabled?: boolean
): Promise<CallWithChatArgs> => {
  const { token, user } = await fetchTokenResponse();
  const credentials = { userId: user, token: token };
  const endpointUrl = await getEndpointUrl();

  let locator: CallAndChatLocator | TeamsMeetingLinkLocator | TeamsMeetingIdLocator;

  // Check if we should join a teams meeting, or an ACS CallWithChat
  teamsLocator = teamsLocator ?? getTeamsLinkFromUrl() ?? getMeetingIdFromUrl();
  if (teamsLocator) {
    locator =
      getTeamsLocator(teamsLocator) ??
      (() => {
        throw new Error('Invalid teams meeting locator, must be a meeting link or meeting id');
      })();
    if ('meetingLink' in teamsLocator) {
      ensureJoinableTeamsLinkPushedToUrl(teamsLocator);
    }
    if ('meetingId' in teamsLocator) {
      ensureJoinableMeetingIdPushedToUrl(teamsLocator);
    }
  } else {
    const callLocator = callLocatorGen(outboundParticipants);

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
    locator,
    alternateCallerId,
    /* @conditional-compile-remove(rich-text-editor-composite-support) */ isRichTextEditorEnabled
  };
};

const callLocatorGen = (
  outBoundParticipants?: string[]
): GroupCallLocator | /* @conditional-compile-remove(call-participants-locator) */ CallParticipantsLocator => {
  /* @conditional-compile-remove(call-participants-locator) */
  if (outBoundParticipants) {
    return { participantIds: outBoundParticipants };
  }
  const callLocator = getGroupIdFromUrl() || createGroupId();
  ensureJoinableCallLocatorPushedToUrl(callLocator);
  return callLocator;
};

const getTeamsLocator = (
  teamsLocator: TeamsMeetingLinkLocator | TeamsMeetingIdLocator
): TeamsMeetingLinkLocator | TeamsMeetingIdLocator | undefined => {
  if ('meetingLink' in teamsLocator) {
    return teamsLocator;
  }
  if ('meetingId' in teamsLocator) {
    return teamsLocator;
  }
  return undefined;
};
