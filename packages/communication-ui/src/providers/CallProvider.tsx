// © Microsoft Corporation. All rights reserved.

import React, { createContext, useState, Dispatch, SetStateAction } from 'react';
import { Call, CallState, LocalVideoStream, RemoteParticipant } from '@azure/communication-calling';
import { ParticipantStream } from '../types/ParticipantStream';
import { useValidContext } from '../utils';
import { WithErrorHandling } from '../utils/WithErrorHandling';
import { ErrorHandlingProps } from './ErrorProvider';

export type CallContextType = {
  call: Call | undefined;
  setCall: Dispatch<SetStateAction<Call | undefined>>;
  callState: CallState;
  setCallState: Dispatch<SetStateAction<CallState>>;
  participants: RemoteParticipant[];
  setParticipants: Dispatch<SetStateAction<RemoteParticipant[]>>;
  screenShareStream: ParticipantStream | undefined;
  setScreenShareStream: Dispatch<SetStateAction<ParticipantStream | undefined>>;
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
}

export const CallContext = createContext<CallContextType | undefined>(undefined);

const CallProviderBase = (props: CallProvider): JSX.Element => {
  const { children } = props;

  const [call, setCall] = useState<Call | undefined>(undefined);
  const [callState, setCallState] = useState<CallState>('None');
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);
  const [screenShareStream, setScreenShareStream] = useState<ParticipantStream | undefined>(undefined);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState<boolean>(false);
  const [localScreenShareActive, setLocalScreenShare] = useState<boolean>(false);
  const [localVideoStream, setLocalVideoStream] = useState<LocalVideoStream | undefined>(undefined);
  const [isLocalVideoRendererBusy, setLocalVideoRendererBusy] = useState<boolean>(false);
  const [isLocalVideoOn, setLocalVideoOn] = useState<boolean>(false);

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
