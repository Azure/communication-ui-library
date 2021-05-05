// © Microsoft Corporation. All rights reserved.

import { CallingProvider, CallProvider } from '../../providers';
import React, { useCallback, useEffect, useState } from 'react';
import { CallClientOptions } from '@azure/communication-calling';
import { AbortSignalLike } from '@azure/core-http';
import { MakeCallScreen } from './MakeCallScreen';
import CallScreen from './CallScreen';
import { CallEndScreen } from './CallEndScreen';
import { getIdFromToken } from '../../utils';
import { CallListener } from './CallListener';
import { incomingCallHost } from './styles/App.styles';
import { ErrorProvider } from '../../providers';
import { CommunicationUiErrorInfo } from '../../types';

export type OneToOneCallCompositeProps = {
  /** Display name in the call */
  displayName: string;
  /** Id of the user to call */
  calleeId?: string;
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

type compositePageSubType = 'landing' | 'callEnd' | 'call';

export const OneToOneCall = (props: OneToOneCallCompositeProps): JSX.Element => {
  const [page, setPage] = useState<compositePageSubType>('landing');
  const [screenWidth, setScreenWidth] = useState(window?.innerWidth ?? 0);
  const { displayName, calleeId, token, callClientOptions, refreshTokenCallback, onEndCall, onErrorCallback } = props;

  const callerId = useCallback(() => getIdFromToken(token), [token])();

  useEffect(() => {
    const setWindowWidth = (): void => {
      const width = typeof window !== 'undefined' ? window.innerWidth : 0;
      setScreenWidth(width);
    };
    setWindowWidth();
    window.addEventListener('resize', setWindowWidth);
    return () => window.removeEventListener('resize', setWindowWidth);
  }, []);

  const goToCall: () => void = () => {
    setPage('call');
  };

  const goToLanding: () => void = () => {
    setPage('landing');
  };

  return (
    <ErrorProvider onErrorCallback={onErrorCallback}>
      <CallingProvider
        token={token}
        displayName={displayName}
        callClientOptions={callClientOptions}
        refreshTokenCallback={refreshTokenCallback}
      >
        <CallProvider>
          {(() => {
            switch (page) {
              case 'landing': {
                return <MakeCallScreen callerId={callerId} calleeId={calleeId} onStartCall={goToCall} />;
              }
              case 'callEnd': {
                return <CallEndScreen acknowledgeCallback={goToLanding} />;
              }
              case 'call': {
                return (
                  <CallScreen
                    callFailedHandler={() => setPage('callEnd')}
                    endCallHandler={(): void => (onEndCall ? onEndCall() : setPage('callEnd'))}
                    screenWidth={screenWidth}
                  />
                );
              }
            }
          })()}
          <div className={incomingCallHost}>
            <CallListener onIncomingCallAccepted={() => setPage('call')} />
          </div>
        </CallProvider>
      </CallingProvider>
    </ErrorProvider>
  );
};
