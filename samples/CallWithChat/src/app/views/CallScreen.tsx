// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import {
  toFlatCommunicationIdentifier,
  useAzureCommunicationCallWithChatAdapter,
  CallAndChatLocator,
  CallWithChatAdapterState,
  CallWithChatComposite,
  CallWithChatAdapter
} from '@azure/communication-react';
import { Spinner } from '@fluentui/react';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSwitchableFluentTheme } from '../theming/SwitchableFluentThemeProvider';
import { createAutoRefreshingCredential } from '../utils/credential';
import { WEB_APP_TITLE } from '../utils/constants';
import { useIsMobile } from '../utils/useIsMobile';

export interface CallScreenProps {
  token: string;
  userId: CommunicationUserIdentifier;
  displayName: string;
  endpoint: string;
  locator: CallAndChatLocator | TeamsMeetingLinkLocator;
  /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId?: string;
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const {
    token,
    userId,
    displayName,
    endpoint,
    locator,
    /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId
  } = props;

  // Disables pull down to refresh. Prevents accidental page refresh when scrolling through chat messages
  // Another alternative: set body style touch-action to 'none'. Achieves same result.
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'null';
    };
  }, []);

  const callIdRef = useRef<string>();
  const { currentTheme, currentRtl } = useSwitchableFluentTheme();
  const isMobileSession = useIsMobile();

  const credential = useMemo(
    () => createAutoRefreshingCredential(toFlatCommunicationIdentifier(userId), token),
    [userId, token]
  );

  const afterAdapterCreate = useCallback(
    async (adapter: CallWithChatAdapter): Promise<CallWithChatAdapter> => {
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
      return adapter;
    },
    [callIdRef]
  );

  const adapter = useAzureCommunicationCallWithChatAdapter(
    {
      userId,
      displayName,
      credential,
      endpoint,
      locator,
      /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId
    },
    afterAdapterCreate
  );

  // Dispose of the adapter in the window's before unload event.
  // This ensures the service knows the user intentionally left the call if the user
  // closed the browser tab during an active call.
  useEffect(() => {
    const disposeAdapter = (): void => adapter?.dispose();
    window.addEventListener('beforeunload', disposeAdapter);
    return () => window.removeEventListener('beforeunload', disposeAdapter);
  }, [adapter]);

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
