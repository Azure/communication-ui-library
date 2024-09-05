// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Call, CallAgent, IncomingCall, IncomingCallEvent } from '@azure/communication-calling';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { CallClientState } from '@azure/communication-react';
import { Stack, Text, TextField, IStackTokens, mergeStyles } from '@fluentui/react';
import React, { useEffect, useRef, useState } from 'react';
import { IncomingCallToast } from './IncomingCallAlerts';

export interface HomeScreenProps {
  callState: CallClientState;
  callAgent: CallAgent;
  userId?: CommunicationUserIdentifier;
  onAcceptIncomingCall(call: Call): void;
}

export const HomeScreen = (props: HomeScreenProps): JSX.Element => {
  const { callState, callAgent, userId, onAcceptIncomingCall } = props;
  const headerTitle = 'Inbound Azure Communication User Sample';

  const [incomingCall, setIncomingCall] = useState<IncomingCall>();
  const interval = useRef<NodeJS.Timeout>();

  // @TODO: Add a method in declarative callAgent to get a declarative Incoming Call Object. Use that object here.
  console.log('incoming calls', callState.incomingCalls);

  /**
   * Subscribe to incoming call events.
   */
  useEffect(() => {
    const incomingCallListener: IncomingCallEvent = ({ incomingCall }) => {
      setIncomingCall(incomingCall);
    };
    callAgent.on('incomingCall', incomingCallListener);
    return () => {
      callAgent.off('incomingCall', incomingCallListener);
    };
  }, [callAgent]);

  /**
   * Incoming Call Ringtone
   */
  useEffect(() => {
    if (incomingCall) {
      const audio = new Audio('https://cdn.freesound.org/previews/29/29621_98464-lq.mp3');
      interval.current = setInterval(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.play();
      }, 3000);
    } else {
      if (interval.current) {
        clearInterval(interval.current);
      }
    }
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [incomingCall]);

  const onRejectCall = (): void => {
    if (incomingCall) {
      incomingCall.reject();
    }
    setIncomingCall(undefined);
  };

  const onAcceptCall = async (): Promise<void> => {
    if (incomingCall) {
      const call = await incomingCall.accept();
      onAcceptIncomingCall(call);
    }
    setIncomingCall(undefined);
  };

  return (
    <>
      {incomingCall && (
        <Stack style={{ position: 'absolute', bottom: '2rem', right: '2rem' }}>
          <IncomingCallToast
            callerName={incomingCall.callerInfo.displayName}
            onClickAccept={onAcceptCall}
            onClickReject={onRejectCall}
          />
        </Stack>
      )}
      <Stack horizontal wrap horizontalAlign="center" verticalAlign="center" className={containerStyle}>
        <Stack className={infoContainerStyle}>
          <Text role={'heading'} aria-level={1} className={headerStyle}>
            {headerTitle}
          </Text>
          <Stack className={configContainerStyle} tokens={configContainerStackTokens}>
            <TextField readOnly contentEditable={false} label="Your User ID" value={userId?.communicationUserId} />
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

const infoContainerStyle = mergeStyles({
  padding: '0.5rem',
  width: '20rem'
});
const containerStyle = mergeStyles({
  height: '100%',
  width: '100% '
});
const configContainerStyle = mergeStyles({
  minWidth: '10rem',
  width: 'auto',
  height: 'auto'
});
const configContainerStackTokens: IStackTokens = {
  childrenGap: '1.25rem'
};
const headerStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '1.25rem', // 20px
  lineHeight: '1.75rem', // 28px
  width: '20rem',
  marginBottom: '1.5rem'
});
