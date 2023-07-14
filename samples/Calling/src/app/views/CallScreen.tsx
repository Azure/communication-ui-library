// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
/* @conditional-compile-remove(teams-identity-support) */
import { MicrosoftTeamsUserIdentifier } from '@azure/communication-common';
import {
  CallAdapterLocator,
  CallAdapterState,
  useAzureCommunicationCallAdapter,
  CommonCallAdapter,
  CallAdapter,
  toFlatCommunicationIdentifier
} from '@azure/communication-react';
/* @conditional-compile-remove(teams-identity-support) */
import { useTeamsCallAdapter, TeamsCallAdapter } from '@azure/communication-react';
/* @conditional-compile-remove(rooms) */
import { AzureCommunicationCallAdapterOptions } from '@azure/communication-react';
/* @conditional-compile-remove(video-background-effects) */
import { TeamsAdapterOptions } from '@azure/communication-react';
/* @conditional-compile-remove(rooms) */
import { Role } from '@azure/communication-react';
import React, { useCallback, useMemo, useRef } from 'react';
import { createAutoRefreshingCredential } from '../utils/credential';
import { WEB_APP_TITLE } from '../utils/AppUtils';
import { CallCompositeContainer } from './CallCompositeContainer';

export interface CallScreenProps {
  token: string;
  userId:
    | CommunicationUserIdentifier
    | /* @conditional-compile-remove(teams-identity-support) */ MicrosoftTeamsUserIdentifier;
  callLocator: CallAdapterLocator;
  displayName: string;
  /* @conditional-compile-remove(PSTN-calls) */
  alternateCallerId?: string;
  /* @conditional-compile-remove(rooms) */
  roleHint?: Role;
  /* @conditional-compile-remove(teams-identity-support) */
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
    /* @conditional-compile-remove(call-transfer) */
    adapter.on('transferRequested', (e) => {
      e.accept();
    });
  }, []);

  const afterCallAdapterCreate = useCallback(
    async (adapter: CallAdapter): Promise<CallAdapter> => {
      subscribeAdapterEvents(adapter);
      return adapter;
    },
    [subscribeAdapterEvents]
  );

  /* @conditional-compile-remove(teams-identity-support) */
  const afterTeamsCallAdapterCreate = useCallback(
    async (adapter: TeamsCallAdapter): Promise<TeamsCallAdapter> => {
      subscribeAdapterEvents(adapter);
      return adapter;
    },
    [subscribeAdapterEvents]
  );

  const credential = useMemo(() => {
    /* @conditional-compile-remove(teams-identity-support) */
    if (isTeamsIdentityCall) {
      return new AzureCommunicationTokenCredential(token);
    }
    return createAutoRefreshingCredential(toFlatCommunicationIdentifier(userId), token);
  }, [token, userId, /* @conditional-compile-remove(teams-identity-support) */ isTeamsIdentityCall]);
  /* @conditional-compile-remove(teams-identity-support) */
  if (isTeamsIdentityCall) {
    return <TeamsCallScreen afterCreate={afterTeamsCallAdapterCreate} credential={credential} {...props} />;
  }

  return <AzureCommunicationCallScreen afterCreate={afterCallAdapterCreate} credential={credential} {...props} />;
};

/* @conditional-compile-remove(teams-identity-support) */
type TeamsCallScreenProps = CallScreenProps & {
  afterCreate?: (adapter: TeamsCallAdapter) => Promise<TeamsCallAdapter>;
  credential: AzureCommunicationTokenCredential;
};

/* @conditional-compile-remove(teams-identity-support) */
const TeamsCallScreen = (props: TeamsCallScreenProps): JSX.Element => {
  const { afterCreate, callLocator: locator, userId, ...adapterArgs } = props;
  if (!('meetingLink' in locator)) {
    throw new Error('A teams meeting locator must be provided for Teams Identity Call.');
  }

  if (!('microsoftTeamsUserId' in userId)) {
    throw new Error('A MicrosoftTeamsUserIdentifier must be provided for Teams Identity Call.');
  }

  /* @conditional-compile-remove(video-background-effects) */
  const teamsAdapterOptions: TeamsAdapterOptions = useMemo(
    () => ({
      videoBackgroundImages
    }),
    []
  );

  const adapter = useTeamsCallAdapter(
    {
      ...adapterArgs,
      userId,
      locator,
      /* @conditional-compile-remove(video-background-effects) */ options: teamsAdapterOptions
    },
    afterCreate
  );
  return <CallCompositeContainer {...props} adapter={adapter} />;
};

type AzureCommunicationCallScreenProps = CallScreenProps & {
  afterCreate?: (adapter: CallAdapter) => Promise<CallAdapter>;
  credential: AzureCommunicationTokenCredential;
};

const AzureCommunicationCallScreen = (props: AzureCommunicationCallScreenProps): JSX.Element => {
  const { afterCreate, callLocator: locator, userId, ...adapterArgs } = props;
  /* @conditional-compile-remove(rooms) */
  const { roleHint } = props;

  if (!('communicationUserId' in userId)) {
    throw new Error('A MicrosoftTeamsUserIdentifier must be provided for Teams Identity Call.');
  }

  /* @conditional-compile-remove(rooms) */ /* @conditional-compile-remove(video-background-effects) */
  const callAdapterOptions: AzureCommunicationCallAdapterOptions = useMemo(() => {
    return {
      /* @conditional-compile-remove(rooms) */
      roleHint,
      /* @conditional-compile-remove(video-background-effects) */
      videoBackgroundImages
    };
  }, [/* @conditional-compile-remove(rooms) */ roleHint]);

  const adapter = useAzureCommunicationCallAdapter(
    {
      ...adapterArgs,
      userId,
      locator,
      /* @conditional-compile-remove(rooms) */ /* @conditional-compile-remove(unsupported-browser) */ /* @conditional-compile-remove(video-background-effects) */
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

/* @conditional-compile-remove(video-background-effects) */
const videoBackgroundImages = [
  {
    key: 'ab1',
    url: '/backgrounds/contoso.png',
    tooltipText: 'Custom Background'
  },
  {
    key: 'ab2',
    url: '/backgrounds/abstract2.jpg',
    tooltipText: 'Custom Background'
  },
  {
    key: 'ab3',
    url: '/backgrounds/abstract3.jpg',
    tooltipText: 'Custom Background'
  },
  {
    key: 'ab4',
    url: '/backgrounds/room1.jpg',
    tooltipText: 'Custom Background'
  },
  {
    key: 'ab5',
    url: '/backgrounds/room2.jpg',
    tooltipText: 'Custom Background'
  },
  {
    key: 'ab6',
    url: '/backgrounds/room3.jpg',
    tooltipText: 'Custom Background'
  },
  {
    key: 'ab7',
    url: '/backgrounds/room4.jpg',
    tooltipText: 'Custom Background'
  }
];
