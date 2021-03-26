// © Microsoft Corporation. All rights reserved.

import { Call, CollectionUpdatedEvent } from '@azure/communication-calling';
import React, { createContext, useState } from 'react';
import { useValidContext } from '../utils';
import { useEffect } from 'react';
import { useCallingContext } from './CallingProvider';

export type IncomingCallsContextType = {
  incomingCalls: Call[];
};

export const IncomingCallsContext = createContext<IncomingCallsContextType | undefined>(undefined);

export const IncomingCallsProvider = (props: { children: React.ReactNode }): JSX.Element => {
  const [incomingCalls, setIncomingCalls] = useState<Call[]>([]);
  const { callAgent } = useCallingContext();

  // Update `incomingCalls` whenever a new call is added or removed.
  // Also configures an event on each call so that it removes itself from
  // active calls.
  useEffect(() => {
    const onCallsUpdate: CollectionUpdatedEvent<Call> = () => {
      const validCalls = callAgent?.calls.filter((c: Call) => c.isIncoming) ?? [];
      setIncomingCalls(validCalls);
      validCalls.forEach((c) => {
        c.on('callStateChanged', () => {
          if (c.state !== 'Incoming') {
            validCalls.splice(validCalls.indexOf(c), 1);
            setIncomingCalls(validCalls);
          }
        });
      });
    };

    callAgent?.on('callsUpdated', onCallsUpdate);
    return () => callAgent?.off('callsUpdated', onCallsUpdate);
  }, [callAgent, setIncomingCalls]);

  return <IncomingCallsContext.Provider value={{ incomingCalls }}>{props.children}</IncomingCallsContext.Provider>;
};

export const useIncomingCallsContext = (): IncomingCallsContextType => useValidContext(IncomingCallsContext);
