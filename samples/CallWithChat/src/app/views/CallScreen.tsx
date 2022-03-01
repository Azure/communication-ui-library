// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import {
  createAzureCommunicationCallWithChatAdapter,
  toFlatCommunicationIdentifier,
  CallAndChatLocator,
  CallWithChatAdapter,
  CallWithChatAdapterState,
  CallWithChatComposite
} from '@azure/communication-react';
import { Spinner } from '@fluentui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useSwitchableFluentTheme } from '../theming/SwitchableFluentThemeProvider';
import { createAutoRefreshingCredential } from '../utils/credential';
import MobileDetect from 'mobile-detect';
import { WEB_APP_TITLE } from '../utils/constants';

const detectMobileSession = (): boolean => !!new MobileDetect(window.navigator.userAgent).mobile();

export interface CallScreenProps {
  token: string;
  userId: CommunicationUserIdentifier;
  displayName: string;
  endpoint: string;
  locator: CallAndChatLocator | TeamsMeetingLinkLocator;
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { token, userId, displayName, endpoint, locator } = props;
  const [adapter, setAdapter] = useState<CallWithChatAdapter>();
  const callIdRef = useRef<string>();
  const adapterRef = useRef<CallWithChatAdapter>();
  const { currentTheme, currentRtl } = useSwitchableFluentTheme();
  const [isMobileSession, setIsMobileSession] = useState<boolean>(detectMobileSession());

  // Whenever the sample is changed from desktop -> mobile using the emulator, make sure we update the formFactor.
  useEffect(() => {
    const updateIsMobile = (): void => {
      // The userAgent string is sometimes not updated synchronously when the `resize` event fires.
      setTimeout(() => {
        setIsMobileSession(detectMobileSession());
      });
    };
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  useEffect(() => {
    (async () => {
      if (!userId || !displayName || !locator || !token || !endpoint) {
        return;
      }

      const adapter = await createAzureCommunicationCallWithChatAdapter({
        userId,
        displayName,
        credential: createAutoRefreshingCredential(toFlatCommunicationIdentifier(userId), token),
        endpoint,
        locator: locator
      });
      adapter.on('callError', (e) => {
        // Error is already acted upon by the Call composite, but the surrounding application could
        // add top-level error handling logic here (e.g. reporting telemetry).
        console.log('Adapter error event:', e);
      });
      adapter.on('chatError', (e) => {
        // Error is already acted upon by the Chat composite, but the surrounding application could
        // add top-level error handling logic here (e.g. reporting telemetry).
        console.log('Adapter error event:', e);
      });
      adapter.onStateChange((state: CallWithChatAdapterState) => {
        const pageTitle = convertPageStateToString(state);
        document.title = `${pageTitle} - ${WEB_APP_TITLE}`;

        if (state?.call?.id && callIdRef.current !== state?.call?.id) {
          callIdRef.current = state?.call?.id;
          console.log(`Call Id: ${callIdRef.current}`);
        }
      });
      setAdapter(adapter);
      adapterRef.current = adapter;
    })();

    return () => {
      adapterRef?.current?.dispose();
    };
  }, [displayName, token, userId, locator, endpoint]);

  if (!adapter) {
    return <Spinner label={'Creating adapter'} ariaLive="assertive" labelPosition="top" />;
  }

  return (
    <CallWithChatComposite
      adapter={adapter}
      fluentTheme={currentTheme.theme}
      rtl={currentRtl}
      joinInvitationURL={window.location.href}
      formFactor={isMobileSession ? 'mobile' : 'desktop'}
    />
  );
};

const convertPageStateToString = (state: CallWithChatAdapterState): string => {
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
