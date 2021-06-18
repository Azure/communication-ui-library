// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import { Spinner } from '@fluentui/react';
import { GroupCallLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { CallAdapter, CallComposite, createAzureCommunicationCallAdapter } from '@azure/communication-react';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { refreshTokenAsync } from '../utils/refreshToken';
import { useSwitchableFluentTheme } from '../theming/SwitchableFluentThemeProvider';

export interface CallScreenProps {
  token: string;
  userId: CommunicationUserIdentifier;
  callLocator: GroupCallLocator | TeamsMeetingLinkLocator;
  displayName: string;
  onCallEnded: () => void;
  onCallError: (e: Error) => void;
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { token, userId, callLocator, displayName, onCallEnded, onCallError } = props;
  const [adapter, setAdapter] = useState<CallAdapter>();
  const { currentTheme } = useSwitchableFluentTheme();

  useEffect(() => {
    (async () => {
      console.log('creating adapter');
      const adapter = await createAzureCommunicationCallAdapter(
        userId,
        token,
        callLocator,
        displayName,
        refreshTokenAsync(userId.communicationUserId)
      );
      adapter.on('callEnded', () => {
        onCallEnded();
      });
      adapter.on('error', (e) => {
        console.error(e);
        onCallError(e);
      });
      setAdapter(adapter);
    })();
  }, [callLocator, displayName, token, userId, onCallEnded, onCallError]);

  if (!adapter) {
    return <Spinner label={'Creating adapter'} ariaLive="assertive" labelPosition="top" />;
  }

  return <CallComposite adapter={adapter} fluentTheme={currentTheme.theme} callInvitationURL={window.location.href} />;
};
