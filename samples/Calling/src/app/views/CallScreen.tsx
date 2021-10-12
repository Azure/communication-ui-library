// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { GroupCallLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAdapter,
  CallAdapterState,
  CallComposite,
  createAzureCommunicationCallAdapter
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
  const adapterRef = useRef<CallAdapter>();
  const { currentTheme, currentRtl } = useSwitchableFluentTheme();

  useEffect(() => {
    (async () => {
      const adapter = await createAzureCommunicationCallAdapter({
        userId: { communicationUserId: userId.communicationUserId },
        displayName: displayName,
        credential: createAutoRefreshingCredential(userId.communicationUserId, token),
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
        if (document.title.includes('end call')) {
          // CallComposite sets page to 'configuration' when ending call
          // End call is handled at the App level, so no need to change the title again here
          return;
        }
        document.title = `${state.page} - ${webAppTitle}`;
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
