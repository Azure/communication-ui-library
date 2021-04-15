// © Microsoft Corporation. All rights reserved.

import { CallEndedEvent, IncomingCall, IncomingCallEvent } from '@azure/communication-calling';
import React, { createContext, Dispatch, SetStateAction, useState } from 'react';
import { useValidContext } from '../utils';
import { useEffect } from 'react';
import { useCallingContext } from './CallingProvider';

export type IncomingCallsContextType = {
  incomingCalls: IncomingCall[];
  setIncomingCalls: Dispatch<SetStateAction<IncomingCall[]>>;
};

export const IncomingCallsContext = createContext<IncomingCallsContextType | undefined>(undefined);

export const IncomingCallsProvider = (props: { children: React.ReactNode }): JSX.Element => {
  const [incomingCalls, setIncomingCalls] = useState<IncomingCall[]>([]);
  const { callAgent } = useCallingContext();

  // Update `incomingCalls` whenever a new incoming call is added or removed.
  useEffect(() => {
    const onIncomingCall: IncomingCallEvent = (incomingCallEvent: { incomingCall: IncomingCall }): void => {
      setIncomingCalls([...incomingCalls, incomingCallEvent.incomingCall]);

      const onIncomingCallEnded: CallEndedEvent = () => {
        const incomingCallWithEndedOneRemoved: IncomingCall[] = [];
        for (const incomingCall of incomingCalls) {
          if (incomingCall !== incomingCallEvent.incomingCall) {
            incomingCallWithEndedOneRemoved.push(incomingCall);
          }
        }
        setIncomingCalls(incomingCallWithEndedOneRemoved);
      };
      incomingCallEvent.incomingCall.on('callEnded', onIncomingCallEnded);
    };

    callAgent?.on('incomingCall', onIncomingCall);
    return () => callAgent?.off('incomingCall', onIncomingCall);
  }, [callAgent, incomingCalls]);

  return (
    <IncomingCallsContext.Provider value={{ incomingCalls, setIncomingCalls }}>
      {props.children}
    </IncomingCallsContext.Provider>
  );
};

export const useIncomingCallsContext = (): IncomingCallsContextType => useValidContext(IncomingCallsContext);
