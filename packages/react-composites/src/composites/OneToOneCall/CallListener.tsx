// © Microsoft Corporation. All rights reserved.
import { IncomingCall } from '@azure/communication-calling';
import { Stack } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { IncomingCallToast, IncomingCallToastProps } from './IncomingCallAlerts';
import { useIncomingCall, useMicrophone } from '../../hooks';
import { useCallingContext, IncomingCallsProvider } from '../../providers';

export type IncomingCallProps = {
  onIncomingCallAccepted?: () => void;
  onIncomingCallRejected?: () => void;
};

const IncomingCallAlertACSWrapper = (props: IncomingCallToastProps & { call: IncomingCall }): JSX.Element => {
  const { call } = props;
  const [callerName, setCallerName] = useState<string | undefined>(undefined);

  useEffect(() => {
    setCallerName(call.callerInfo.displayName);
  }, [call]);

  return <IncomingCallToast {...props} callerName={callerName} />;
};

const IncomingCallContainer = (props: IncomingCallProps): JSX.Element => {
  // todo: move to mapper:
  const { accept, reject, incomingCalls } = useIncomingCall();
  const { unmute } = useMicrophone();

  if (!(incomingCalls && incomingCalls.length > 0)) return <></>;
  else {
    return (
      <Stack>
        {incomingCalls.map((call) => (
          <div style={{ marginTop: '8px', marginBottom: '8px' }} key={call.id}>
            <IncomingCallAlertACSWrapper
              call={call}
              onClickReject={async () => {
                await reject(call);
                props.onIncomingCallRejected && props.onIncomingCallRejected();
              }}
              onClickAccept={async () => {
                await accept(call);
                await unmute();
                props.onIncomingCallAccepted && props.onIncomingCallAccepted();
              }}
            />
          </div>
        ))}
      </Stack>
    );
  }
};

export const CallListener = (props: IncomingCallProps): JSX.Element => {
  const { callAgent, deviceManager } = useCallingContext();
  return callAgent && deviceManager ? (
    <IncomingCallsProvider>
      <IncomingCallContainer
        onIncomingCallAccepted={props.onIncomingCallAccepted}
        onIncomingCallRejected={props.onIncomingCallRejected}
      />
    </IncomingCallsProvider>
  ) : (
    <></>
  );
};
