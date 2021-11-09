// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { GroupCallLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAdapter,
  CallAdapterState,
  CallComposite,
  createAzureCommunicationCallAdapter,
  toFlatCommunicationIdentifier
} from '@azure/communication-react';
import { Spinner } from '@fluentui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useSwitchableFluentTheme } from '../theming/SwitchableFluentThemeProvider';
import { createAutoRefreshingCredential } from '../utils/credential';
import MobileDetect from 'mobile-detect';

const isMobileSession = !!new MobileDetect(window.navigator.userAgent).mobile();

export interface CallScreenProps {
  token: string;
  userId: CommunicationUserIdentifier;
  callLocator: GroupCallLocator | TeamsMeetingLinkLocator;
  displayName: string;
  webAppTitle: string;
  onCallEnded: () => void;
  onCallError: (e: Error) => void;
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { token, userId, callLocator, displayName, webAppTitle, onCallEnded } = props;
  const [adapter, setAdapter] = useState<CallAdapter>();
  const callIdRef = useRef<string>();
  const adapterRef = useRef<CallAdapter>();
  const { currentTheme, currentRtl } = useSwitchableFluentTheme();

  useEffect(() => {
    if (!callIdRef.current) {
      return;
    }
    console.log(`Call Id: ${callIdRef.current}`);
  }, [callIdRef.current]);

  useEffect(() => {
    (async () => {
      const adapter = await createAzureCommunicationCallAdapter({
        userId,
        displayName,
        credential: createAutoRefreshingCredential(toFlatCommunicationIdentifier(userId), token),
        locator: callLocator
      });
      adapter.on('callEnded', () => {
        onCallEnded();
      });
      adapter.on('error', (e) => {
        // Error is already acted upon by the Call composite, but the surrounding application could
        // add top-level error handling logic here (e.g. reporting telemetry).
        console.log('Adapter error event:', e);
      });
      adapter.onStateChange((state: CallAdapterState) => {
        const pageTitle = convertPageStateToString(state);
        document.title = `${pageTitle} - ${webAppTitle}`;

        callIdRef.current = state?.call?.id;
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
    <CallComposite
      adapter={adapter}
      fluentTheme={currentTheme.theme}
      rtl={currentRtl}
      callInvitationUrl={window.location.href}
      options={{ mobileView: isMobileSession }}
    />
  );
};

const convertPageStateToString = (state: CallAdapterState): string => {
  switch (state.page) {
    case 'accessDeniedTeamsMeeting':
      return 'error';
    case 'leftCall':
      return 'end call';
    case 'removedFromCall':
      return 'end call';
    default:
      return `${state.page}`;
  }
};
