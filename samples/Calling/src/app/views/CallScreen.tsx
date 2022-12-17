// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAdapterLocator,
  CallAdapterState,
  toFlatCommunicationIdentifier,
  useAzureCommunicationCallAdapter,
  useAzureCommunicationTeamsCallAdapter,
  CommonCallAdapter,
  CallAdapter,
  TeamsCallAdapter
} from '@azure/communication-react';
/* @conditional-compile-remove(rooms) */
import { AzureCommunicationCallAdapterOptions } from '@azure/communication-react';
/* @conditional-compile-remove(rooms) */
import { Role } from '@azure/communication-react';
import React, { useCallback, useMemo, useRef } from 'react';
import { createAutoRefreshingCredential } from '../utils/credential';
import { WEB_APP_TITLE } from '../utils/AppUtils';
/* @conditional-compile-remove(call-readiness) */
import { CallCompositeContainer } from './CallCompositeContainer';

export interface CallScreenProps {
  token: string;
  userId: CommunicationUserIdentifier;
  callLocator: CallAdapterLocator;
  displayName: string;
  /* @conditional-compile-remove(PSTN-calls) */
  alternateCallerId?: string;
  /* @conditional-compile-remove(rooms) */
  roleHint?: Role;
  /* @conditional-compile-remove(call-readiness) */
  callReadinessOptedIn?: boolean;
  isTeamsIdentityCall?: boolean;
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { token, userId, /* @conditional-compile-remove(teams-identity-support) */ isTeamsIdentityCall } = props;
  const callIdRef = useRef<string>();

  const subscribeAdapterEvents = useCallback((adapter: CommonCallAdapter) => {
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
  }, []);

  const afterCallAdapterCreate = useCallback(
    async (adapter: CallAdapter): Promise<CallAdapter> => {
      subscribeAdapterEvents(adapter);
      return adapter;
    },
    [subscribeAdapterEvents]
  );

  const afterTeamsCallAdapterCreate = useCallback(
    async (adapter: TeamsCallAdapter): Promise<TeamsCallAdapter> => {
      subscribeAdapterEvents(adapter);
      return adapter;
    },
    [subscribeAdapterEvents]
  );

  const credential = useMemo(
    () =>
      isTeamsIdentityCall
        ? new AzureCommunicationTokenCredential(token)
        : createAutoRefreshingCredential(toFlatCommunicationIdentifier(userId), token),
    [isTeamsIdentityCall, token, userId]
  );

  return isTeamsIdentityCall ? (
    <TeamsCallScreen afterCreate={afterTeamsCallAdapterCreate} credential={credential} {...props} />
  ) : (
    <AzureCommunicationCallScreen afterCreate={afterCallAdapterCreate} credential={credential} {...props} />
  );
};

type TeamsCallScreenProps = CallScreenProps & {
  afterCreate?: (adapter: TeamsCallAdapter) => Promise<TeamsCallAdapter>;
  credential: AzureCommunicationTokenCredential;
};

const TeamsCallScreen = (props: TeamsCallScreenProps): JSX.Element => {
  const { afterCreate, ...adapterArgs } = props;
  const adapter = useAzureCommunicationTeamsCallAdapter(adapterArgs, afterCreate);
  return <CallCompositeContainer {...props} adapter={adapter} />;
};

type AzureCommunicationCallScreenProps = CallScreenProps & {
  afterCreate?: (adapter: CallAdapter) => Promise<CallAdapter>;
  credential: AzureCommunicationTokenCredential;
};

const AzureCommunicationCallScreen = (props: AzureCommunicationCallScreenProps): JSX.Element => {
  const { roleHint, afterCreate, ...adapterArgs } = props;

  /* @conditional-compile-remove(rooms) */ /* @conditional-compile-remove(unsupported-browser) */
  const callAdapterOptions: AzureCommunicationCallAdapterOptions = useMemo(
    () => ({
      roleHint,
      features: { unsupportedEnvironment: true }
    }),
    [roleHint]
  );
  const adapter = useAzureCommunicationCallAdapter(
    {
      ...adapterArgs,
      /* @conditional-compile-remove(rooms) */ /* @conditional-compile-remove(unsupported-browser) */
      options: callAdapterOptions
    },
    afterCreate
  );
  return <CallCompositeContainer {...props} adapter={adapter} />;
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
