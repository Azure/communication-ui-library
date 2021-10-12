// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { GroupCallLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { createAzureCommunicationMeetingAdapter, MeetingAdapter, MeetingComposite } from '@azure/communication-react';
import { Spinner } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { useSwitchableFluentTheme } from '../theming/SwitchableFluentThemeProvider';
import { createAutoRefreshingCredential } from '../utils/credential';
import MobileDetect from 'mobile-detect';
import { ACSMeetingLocator } from 'app/utils/AppUtils';

const isMobileSession = !!new MobileDetect(window.navigator.userAgent).mobile();

export interface CallScreenProps {
  token: string;
  userId: CommunicationUserIdentifier;
  callLocator: ACSMeetingLocator | TeamsMeetingLinkLocator;
  displayName: string;
  endpointUrl: string;
  onCallEnded: () => void;
  onCallError: (e: Error) => void;
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { token, userId, callLocator, displayName, endpointUrl, onCallEnded } = props;

  const { currentTheme } = useSwitchableFluentTheme();

  const [meetingAdapter, setMeetingAdapter] = useState<MeetingAdapter | undefined>(undefined);

  let meetingCallLocator: GroupCallLocator | TeamsMeetingLinkLocator;
  let threadId = '';
  if (callLocator['threadId'] !== undefined) {
    meetingCallLocator = callLocator['groupLocator'];
    threadId = callLocator['threadId'];
  } else {
    meetingCallLocator = callLocator as TeamsMeetingLinkLocator;
  }

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      const credential = createAutoRefreshingCredential(userId.communicationUserId, token);
      const adapter = await createAzureCommunicationMeetingAdapter({
        userId,
        displayName,
        credential,
        callLocator: meetingCallLocator,
        chatThreadId: threadId,
        endpointUrl
      });
      adapter.on('meetingEnded', () => {
        onCallEnded();
      });
      setMeetingAdapter(adapter);
    };

    initialize();

    return () => {
      meetingAdapter && meetingAdapter.dispose();
    };
  }, []);

  if (!meetingAdapter) {
    return <Spinner label={'Creating adapter'} ariaLive="assertive" labelPosition="top" />;
  }

  return (
    <div style={{ position: 'fixed', width: '100%', height: '100%' }}>
      <MeetingComposite
        fluentTheme={currentTheme.theme}
        // rtl={currentRtl}
        meetingInvitationURL={window.location.href}
        options={{ mobileView: isMobileSession }}
        meetingAdapter={meetingAdapter}
      />
    </div>
  );
};
