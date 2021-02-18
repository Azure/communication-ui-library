// © Microsoft Corporation. All rights reserved.

import React, { createContext, useState, Dispatch, SetStateAction, useEffect } from 'react';
import { Call, CallState, LocalVideoStream, RemoteParticipant } from '@azure/communication-calling';
import { ParticipantStream } from '../types/ParticipantStream';
import { useValidContext } from '../utils';
import { WithErrorHandling } from '../utils/WithErrorHandling';
import { ErrorHandlingProps } from './ErrorProvider';
import { useCallingContext } from './CallingProvider';

export type CallContextType = {
  call: Call | undefined;
  setCall: Dispatch<SetStateAction<Call | undefined>>;
  callState: CallState;
  setCallState: Dispatch<SetStateAction<CallState>>;
  participants: RemoteParticipant[];
  setParticipants: Dispatch<SetStateAction<RemoteParticipant[]>>;
  screenShareStream: ParticipantStream | undefined;
  setScreenShareStream: Dispatch<SetStateAction<ParticipantStream | undefined>>;
  displayName: string; // can remove when we update to 1.0.0-beta.3
  setDisplayName: Dispatch<SetStateAction<string>>; // can remove when we update to 1.0.0-beta.3
  isMicrophoneEnabled: boolean;
  setIsMicrophoneEnabled: Dispatch<SetStateAction<boolean>>;
  localScreenShareActive: boolean;
  setLocalScreenShare: Dispatch<SetStateAction<boolean>>;
  localVideoStream: LocalVideoStream | undefined;
  setLocalVideoStream: Dispatch<SetStateAction<LocalVideoStream | undefined>>;
  isLocalVideoRendererBusy: boolean;
  setLocalVideoRendererBusy: Dispatch<SetStateAction<boolean>>;
  isLocalVideoOn: boolean;
  setLocalVideoOn: Dispatch<SetStateAction<boolean>>;
};

export interface CallProvider {
  children: React.ReactNode;
  displayName: string;
}

export const CallContext = createContext<CallContextType | undefined>(undefined);

const CallProviderBase = (props: CallProvider): JSX.Element => {
  const { displayName: defaultDisplayName, children } = props;

  const [call, setCall] = useState<Call | undefined>(undefined);
  const [callState, setCallState] = useState<CallState>('None');
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);
  const [screenShareStream, setScreenShareStream] = useState<ParticipantStream | undefined>(undefined);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState<boolean>(false);
  const [localScreenShareActive, setLocalScreenShare] = useState<boolean>(false);
  const [localVideoStream, setLocalVideoStream] = useState<LocalVideoStream | undefined>(undefined);
  const [isLocalVideoRendererBusy, setLocalVideoRendererBusy] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>(defaultDisplayName); // can remove when we update to 1.0.0-beta.3
  const [isLocalVideoOn, setLocalVideoOn] = useState<boolean>(false);
  const { callAgent } = useCallingContext();

  // this will be not needed once we update to beta3, a little bit ugly now that we have two useEffect
  useEffect(() => {
    callAgent?.updateDisplayName(displayName);
  }, [displayName, callAgent]);

  const initialState: CallContextType = {
    call,
    setCall,
    callState,
    setCallState,
    participants,
    setParticipants,
    screenShareStream,
    setScreenShareStream,
    isMicrophoneEnabled,
    setIsMicrophoneEnabled,
    localScreenShareActive,
    setLocalScreenShare,
    displayName, // can remove when we update to 1.0.0-beta.3
    setDisplayName, // can remove when we update to 1.0.0-beta.3
    localVideoStream,
    setLocalVideoStream,
    isLocalVideoRendererBusy,
    setLocalVideoRendererBusy,
    isLocalVideoOn,
    setLocalVideoOn
  };

  return <CallContext.Provider value={initialState}>{children}</CallContext.Provider>;
};

export const CallProvider = (props: CallProvider & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(CallProviderBase, props);

export const useCallContext = (): CallContextType => useValidContext(CallContext);
