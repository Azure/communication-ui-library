// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAdapterLocator,
  CallAdapter,
  CallAdapterState,
  CallComposite,
  toFlatCommunicationIdentifier,
  useAzureCommunicationCallAdapter
} from '@azure/communication-react';
/* @conditional-compile-remove(rooms) */
import { AzureCommunicationCallAdapterOptions } from '@azure/communication-react';
/* @conditional-compile-remove(rooms) */
import { Role } from '@azure/communication-react';
import { Spinner } from '@fluentui/react';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSwitchableFluentTheme } from '../theming/SwitchableFluentThemeProvider';
import { createAutoRefreshingCredential } from '../utils/credential';
import { WEB_APP_TITLE } from '../utils/AppUtils';
import { useIsMobile } from '../utils/useIsMobile';
/* @conditional-compile-remove(call-readiness) */
import { CallCompositeOptions } from '@azure/communication-react';
/* @conditional-compile-remove(unsuspported-browser) */
import { CallAdapterOptionalFeatures } from '@azure/communication-react';

export interface CallScreenProps {
  token: string;
  userId: CommunicationUserIdentifier;
  callLocator: CallAdapterLocator;
  displayName: string;
  /* @conditional-compile-remove(PSTN-calls) */
  alternateCallerId?: string;
  onCallEnded: () => void;
  /* @conditional-compile-remove(rooms) */
  roleHint?: Role;
  /* @conditional-compile-remove(call-readiness) */
  callReadinessOptedIn?: boolean;
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const {
    token,
    userId,
    callLocator,
    displayName,
    onCallEnded,
    /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId,
    /* @conditional-compile-remove(rooms) */ roleHint,
    /* @conditional-compile-remove(call-readiness) */ callReadinessOptedIn
  } = props;
  const callIdRef = useRef<string>();
  const { currentTheme, currentRtl } = useSwitchableFluentTheme();
  const isMobileSession = useIsMobile();
  const afterCreate = useCallback(
    async (adapter: CallAdapter): Promise<CallAdapter> => {
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
        document.title = `${pageTitle} - ${WEB_APP_TITLE}`;

        if (state?.call?.id && callIdRef.current !== state?.call?.id) {
          callIdRef.current = state?.call?.id;
          console.log(`Call Id: ${callIdRef.current}`);
        }
      });
      return adapter;
    },
    [callIdRef, onCallEnded]
  );

  const credential = useMemo(
    () => createAutoRefreshingCredential(toFlatCommunicationIdentifier(userId), token),
    [token, userId]
  );

  /* @conditional-compile-remove(call-readiness) */
  const options: CallCompositeOptions = useMemo(
    () => ({
      callReadinessOptedIn: callReadinessOptedIn,
      onPermissionsTroubleshootingClick,
      onNetworkingTroubleShootingClick,
      unsupportedBrowserOptedIn: false
    }),
    [callReadinessOptedIn]
  );

  /* @conditional-compile-remove(unsuspported-browser) */
  const callingFeatures: CallAdapterOptionalFeatures = {
    unsupportedEnvironment: true
  };
  /* @conditional-compile-remove(rooms) */
  const callAdapterOptions: AzureCommunicationCallAdapterOptions = useMemo(() => ({ roleHint }), [roleHint]);

  const adapter = useAzureCommunicationCallAdapter(
    {
      userId,
      displayName,
      credential,
      locator: callLocator,
      /* @conditional-compile-remove(PSTN-calls) */
      alternateCallerId,
      /* @conditional-compile-remove(unsuspported-browser) */
      features: callingFeatures,
      /* @conditional-compile-remove(rooms) */
      options: callAdapterOptions
    },
    afterCreate
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

  let callInvitationUrl: string | undefined = window.location.href;
  /* @conditional-compile-remove(rooms) */
  // If roleHint is defined then the call is a Rooms call so we should not make call invitation link available
  if (roleHint) {
    callInvitationUrl = undefined;
  }

  return (
    <CallComposite
      adapter={adapter}
      fluentTheme={currentTheme.theme}
      rtl={currentRtl}
      callInvitationUrl={callInvitationUrl}
      formFactor={isMobileSession ? 'mobile' : 'desktop'}
      /* @conditional-compile-remove(call-readiness) */
      options={options}
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

/* @conditional-compile-remove(call-readiness) */
const onPermissionsTroubleshootingClick = (permissionState: {
  camera: PermissionState;
  microphone: PermissionState;
}): void => {
  console.log(permissionState);
  alert('permission troubleshooting clicked');
};

/* @conditional-compile-remove(call-readiness) */
const onNetworkingTroubleShootingClick = (): void => {
  alert('network troubleshooting clicked');
};
