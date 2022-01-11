// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { GroupCallLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { MeetingAdapterState, MeetingComposite, toFlatCommunicationIdentifier } from '@azure/communication-react';
import { Spinner } from '@fluentui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useSwitchableFluentTheme } from '../theming/SwitchableFluentThemeProvider';
import { createAutoRefreshingCredential } from '../utils/credential';
import MobileDetect from 'mobile-detect';
import { createAzureCommunicationMeetingAdapter } from '@azure/communication-react';
import { MeetingAdapter } from '@internal/react-composites';
import { getEndpointUrl } from '../utils/getEndpointUrl';

const detectMobileSession = (): boolean => !!new MobileDetect(window.navigator.userAgent).mobile();

export interface MeetingScreenProps {
  token: string;
  userId: CommunicationUserIdentifier;
  callLocator: GroupCallLocator | TeamsMeetingLinkLocator;
  displayName: string;
  webAppTitle: string;
  onCallEnded: () => void;
  endpoint: string;
  threadId: string;
}

export const MeetingScreen = (props: MeetingScreenProps): JSX.Element => {
  const { token, userId, callLocator, displayName, webAppTitle, onCallEnded, threadId } = props;
  const [adapter, setAdapter] = useState<MeetingAdapter>();
  const callIdRef = useRef<string>();
  const adapterRef = useRef<MeetingAdapter>();
  const { currentTheme, currentRtl } = useSwitchableFluentTheme();
  const [isMobileSession, setIsMobileSession] = useState<boolean>(detectMobileSession());

  useEffect(() => {
    if (!callIdRef.current) {
      return;
    }
    console.log(`Call Id: ${callIdRef.current}`);
  }, [callIdRef.current]);

  // Whenever the sample is changed from desktop -> mobile using the emulator, make sure we update the formFactor.
  useEffect(() => {
    const updateIsMobile = (): void => setIsMobileSession(detectMobileSession());
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  useEffect(() => {
    (async () => {
      console.log('we are making meeting adapter.');
      const adapter = await createAzureCommunicationMeetingAdapter({
        userId,
        displayName,
        credential: createAutoRefreshingCredential(toFlatCommunicationIdentifier(userId), token),
        callLocator: callLocator,
        endpoint: await getEndpointUrl(),
        chatThreadId: threadId
      });
      adapter.on('meetingEnded', () => {
        onCallEnded();
      });
      adapter.on('error', (e) => {
        // Error is already acted upon by the Call composite, but the surrounding application could
        // add top-level error handling logic here (e.g. reporting telemetry).
        console.log('Adapter error event:', e);
      });
      adapter.onStateChange((state: MeetingAdapterState) => {
        const pageTitle = convertPageStateToString(state);
        document.title = `${pageTitle} - ${webAppTitle}`;

        callIdRef.current = state?.meeting?.id;
      });
      setAdapter(adapter);
      adapterRef.current = adapter;
    })();

    return () => {
      adapterRef?.current?.dispose();
    };
  }, [callLocator, displayName, token, userId, onCallEnded]);

  if (!adapter) {
    return <Spinner label={'Creating adapter'} ariaLive="assertive" labelPosition="top" />;
  }

  return (
    <MeetingComposite
      meetingAdapter={adapter}
      fluentTheme={currentTheme.theme}
      rtl={currentRtl}
      meetingInvitationURL={window.location.href}
      formFactor={isMobileSession ? 'mobile' : 'desktop'}
    />
  );
};

const convertPageStateToString = (state: MeetingAdapterState): string => {
  switch (state.page) {
    case 'accessDeniedTeamsMeeting':
      return 'error';
    case 'leftMeeting':
      return 'end call';
    case 'removedFromMeeting':
      return 'end call';
    default:
      return `${state.page}`;
  }
};
