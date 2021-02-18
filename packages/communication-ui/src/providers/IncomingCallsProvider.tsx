// © Microsoft Corporation. All rights reserved.

import { Call, CollectionUpdatedEvent } from '@azure/communication-calling';
import React, { createContext, useState } from 'react';
import { useValidContext } from '../utils';
import { useEffect } from 'react';
import { useCallContext, useCallingContext } from '../providers';

export type IncomingCallsContextType = {
  incomingCalls: Call[];
};

export const IncomingCallsContext = createContext<IncomingCallsContextType | undefined>(undefined);

export const IncomingCallsProvider = (props: { children: React.ReactNode }): JSX.Element => {
  const [incomingCalls, setIncomingCalls] = useState<Call[]>([]);
  const { callAgent } = useCallingContext();
  const { call } = useCallContext();

  // Update incomingCalls whenever a new call is added or removed.
  useEffect(() => {
    const onCallsUpdate: CollectionUpdatedEvent<Call> = () => {
      setIncomingCalls(callAgent?.calls.filter((c: Call) => c.isIncoming) ?? []);
    };

    callAgent?.on('callsUpdated', onCallsUpdate);
    return () => callAgent?.off('callsUpdated', onCallsUpdate);
  }, [callAgent, setIncomingCalls]);

  // Remove the active call from incomingCalls.
  useEffect(() => {
    if (call) {
      setIncomingCalls(callAgent?.calls.filter((c: Call) => c.isIncoming && c !== call) ?? []);
    }
  }, [call, callAgent, setIncomingCalls]);

  return <IncomingCallsContext.Provider value={{ incomingCalls }}>{props.children}</IncomingCallsContext.Provider>;
};

export const useIncomingCallsContext = (): IncomingCallsContextType => useValidContext(IncomingCallsContext);
