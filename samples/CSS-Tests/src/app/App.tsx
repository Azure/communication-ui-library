// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { GroupCallLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import {
  AzureCommunicationCallAdapterArgs,
  CallComposite,
  useAzureCommunicationCallAdapter
} from '@azure/communication-react';
import { setLogLevel } from '@azure/logger';
import { initializeIcons } from '@fluentui/react';
import React, { useEffect, useMemo, useState } from 'react';
import {
  buildTime,
  callingSDKVersion,
  commitID,
  communicationReactSDKVersion,
  createGroupId,
  fetchTokenResponse,
  getGroupIdFromUrl,
  getTeamsLinkFromUrl
} from './utils/AppUtils';
import { useIsMobile } from './utils/useIsMobile';
import { createAutoRefreshingCredential } from './utils/credential';

type SupportedLocators = GroupCallLocator | TeamsMeetingLinkLocator;

setLogLevel('error');

console.log(
  `ACS sample calling app. Last Updated ${buildTime} with CommitID:${commitID} using @azure/communication-calling:${callingSDKVersion} and @azure/communication-react:${communicationReactSDKVersion}`
);

initializeIcons();

const randomDisplayName = 'user' + Math.ceil(Math.random() * 1000);
const callLocator: SupportedLocators = getTeamsLinkFromUrl() || getGroupIdFromUrl() || createGroupId();

const App = (): JSX.Element => {
  // User credentials to join a call with - these are retrieved from the server
  const [credential, setCredential] = useState<AzureCommunicationTokenCredential>();
  const [userId, setUserId] = useState<CommunicationUserIdentifier>();

  // Get Azure Communications Service token from the server
  useEffect(() => {
    (async () => {
      try {
        const { token, user } = await fetchTokenResponse();
        setCredential(createAutoRefreshingCredential(user.communicationUserId, token));
        setUserId(user);
      } catch (e) {
        console.error(e);
        alert('Failed to fetch token');
      }
    })();
  }, []);

  // Update joinable link
  useEffect(() => {
    updateBrowserWithLocator(callLocator);
  }, []);

  const adapterArgs: Partial<AzureCommunicationCallAdapterArgs> = useMemo(
    () => ({
      userId,
      credential,
      displayName: randomDisplayName,
      locator: callLocator
    }),
    [userId, credential]
  );
  const adapter = useAzureCommunicationCallAdapter(adapterArgs);

  const isMobileSession = useIsMobile();

  if (!adapter) {
    return <>Initializing</>;
  }

  return <CallComposite adapter={adapter} formFactor={isMobileSession ? 'mobile' : 'desktop'} />;
};

const updateBrowserWithLocator = (locator: SupportedLocators): void => {
  window.history.pushState({}, document.title, window.location.origin + getJoinParams(locator));
};

const getJoinParams = (locator: SupportedLocators): string => {
  if ('meetingLink' in locator) {
    return '?teamsLink=' + encodeURIComponent(locator.meetingLink);
  } else if ('groupId' in locator) {
    return '?groupId=' + encodeURIComponent(locator.groupId);
  }

  throw new Error('Unsupported locator');
};

export default App;
