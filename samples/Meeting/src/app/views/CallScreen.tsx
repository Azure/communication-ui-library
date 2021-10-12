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

const isMobileSession = !!new MobileDetect(window.navigator.userAgent).mobile();

export interface CallScreenProps {
  token: string;
  userId: CommunicationUserIdentifier;
  callLocator: GroupCallLocator | TeamsMeetingLinkLocator;
  displayName: string;
  endpointUrl: string;
  onCallEnded: () => void;
  onCallError: (e: Error) => void;
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { token, userId, callLocator, displayName, onCallEnded } = props;

  const { currentTheme } = useSwitchableFluentTheme();

  const [meetingAdapter, setMeetingAdapter] = useState<MeetingAdapter | undefined>(undefined);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      const credential = createAutoRefreshingCredential(userId.communicationUserId, token);
      const adapter = await createAzureCommunicationMeetingAdapter({
        userId,
        displayName,
        credential,
        callLocator,
        props.endpointUrl,
        chatThreadId: 'TODO: ACS thread ID'
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
