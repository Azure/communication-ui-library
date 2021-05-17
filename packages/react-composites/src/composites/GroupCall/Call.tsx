// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallingProvider, CallProvider, ErrorProvider } from '../../providers';
import React, { useEffect, useState } from 'react';
import { CallScreen } from './CallScreen';
import { ConfigurationScreen } from './ConfigurationScreen';
import { CallClientOptions } from '@azure/communication-calling';
import { AbortSignalLike } from '@azure/core-http';
import { callContainer } from './styles/Call.styles';
import { Stack } from '@fluentui/react';
import { CommunicationUiErrorInfo } from '../../types';
import { v1 as createGUID } from 'uuid';

export type CallCompositeProps = {
  /** Display name in the group call */
  displayName: string;
  /** User Id */
  userId: string;
  /** Group Id */
  groupId: string;
  /** ACS access token for the  */
  token: string;
  /** Optional options for setting up the call client  */
  callClientOptions?: CallClientOptions;
  /** Optional callback to refresh token once it's expired */
  refreshTokenCallback?: (abortSignal?: AbortSignalLike) => Promise<string>;
  /** Optional callback when call is ended */
  onEndCall?: () => void;
  /** Optional callback to call when error is detected */
  onErrorCallback?: (error: CommunicationUiErrorInfo) => void;
};

type compositePageSubType = 'configuration' | 'call';

export const Call = (props: CallCompositeProps): JSX.Element => {
  const [page, setPage] = useState<compositePageSubType>('configuration');
  const [screenWidth, setScreenWidth] = useState(window?.innerWidth ?? 0);
  useEffect(() => {
    const setWindowWidth = (): void => {
      const width = typeof window !== 'undefined' ? window.innerWidth : 0;
      setScreenWidth(width);
    };
    setWindowWidth();
    window.addEventListener('resize', setWindowWidth);
    return () => window.removeEventListener('resize', setWindowWidth);
  }, []);
  const [callProviderKey, setCallProviderKey] = useState<string>(createGUID());

  const { displayName, groupId, token, callClientOptions, refreshTokenCallback, onEndCall, onErrorCallback } = props;

  return (
    <ErrorProvider onErrorCallback={onErrorCallback}>
      <CallingProvider
        token={token}
        displayName={displayName}
        callClientOptions={callClientOptions}
        refreshTokenCallback={refreshTokenCallback}
      >
        <Stack className={callContainer} grow>
          {(() => {
            switch (page) {
              case 'configuration': {
                return (
                  <CallProvider key={'configuration-call-provider-key'}>
                    <ConfigurationScreen
                      screenWidth={screenWidth}
                      startCallHandler={(): void => setPage('call')}
                      groupId={groupId}
                    />
                  </CallProvider>
                );
              }
              case 'call': {
                return (
                  <CallProvider key={callProviderKey}>
                    <CallScreen
                      endCallHandler={(): void => {
                        if (onEndCall) {
                          onEndCall();
                        } else {
                          setPage('configuration');
                          setCallProviderKey(createGUID());
                        }
                      }}
                      screenWidth={screenWidth}
                      groupId={groupId}
                    />
                  </CallProvider>
                );
              }
            }
          })()}
        </Stack>
      </CallingProvider>
    </ErrorProvider>
  );
};
