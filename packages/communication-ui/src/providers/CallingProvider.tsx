// © Microsoft Corporation. All rights reserved.

import React, { createContext, useState, Dispatch, SetStateAction, useEffect, useRef } from 'react';
import {
  CallClient,
  CallAgent,
  DeviceManager,
  VideoDeviceInfo,
  AudioDeviceInfo,
  CallClientOptions
} from '@azure/communication-calling';
import { createAzureCommunicationUserCredential, getIdFromToken, propagateError, useValidContext } from '../utils';
import { AbortSignalLike } from '@azure/core-http';
import { ErrorHandlingProps } from './ErrorProvider';
import { WithErrorHandling } from '../utils/WithErrorHandling';
import { CommunicationUiError, CommunicationUiErrorCode } from '../types/CommunicationUiError';
import { DevicePermissionState } from '../types/DevicePermission';

export type CallingContextType = {
  userId: string;
  setUserId: Dispatch<SetStateAction<string>>;
  displayName: string;
  setDisplayName: Dispatch<SetStateAction<string>>;
  callClient: CallClient;
  setCallClient: Dispatch<SetStateAction<CallClient>>;
  callAgent: CallAgent | undefined;
  setCallAgent: Dispatch<SetStateAction<CallAgent | undefined>>;
  deviceManager: DeviceManager | undefined;
  setDeviceManager: Dispatch<SetStateAction<DeviceManager | undefined>>;
  audioDevicePermission: DevicePermissionState;
  setAudioDevicePermission: Dispatch<SetStateAction<DevicePermissionState>>;
  videoDevicePermission: DevicePermissionState;
  setVideoDevicePermission: Dispatch<SetStateAction<DevicePermissionState>>;
  videoDeviceInfo: VideoDeviceInfo | undefined;
  setVideoDeviceInfo: Dispatch<SetStateAction<VideoDeviceInfo | undefined>>;
  videoDeviceList: VideoDeviceInfo[];
  setVideoDeviceList: Dispatch<SetStateAction<VideoDeviceInfo[]>>;
  audioDeviceInfo: AudioDeviceInfo | undefined;
  setAudioDeviceInfo: Dispatch<SetStateAction<AudioDeviceInfo | undefined>>;
  audioDeviceList: AudioDeviceInfo[];
  setAudioDeviceList: Dispatch<SetStateAction<AudioDeviceInfo[]>>;
};

export const CallingContext = createContext<CallingContextType | undefined>(undefined);

interface CallingProviderProps {
  children: React.ReactNode;
  token: string;
  displayName: string;
  callClientOptions?: CallClientOptions;
  refreshTokenCallback?: (abortSignal?: AbortSignalLike) => Promise<string>;
}

const CallingProviderBase = (props: CallingProviderProps & ErrorHandlingProps): JSX.Element => {
  const { token, displayName: initialDisplayName, callClientOptions, refreshTokenCallback, onErrorCallback } = props;

  // if there is no valid token then there is no valid userId
  const userIdFromToken = token ? getIdFromToken(token) : '';
  const [callClient, setCallClient] = useState<CallClient>(new CallClient(callClientOptions));
  const [callAgent, setCallAgent] = useState<CallAgent | undefined>(undefined);
  const [deviceManager, setDeviceManager] = useState<DeviceManager | undefined>(undefined);
  const [userId, setUserId] = useState<string>(userIdFromToken);
  const [displayName, setDisplayName] = useState<string>(initialDisplayName);
  const [audioDevicePermission, setAudioDevicePermission] = useState<DevicePermissionState>('Unknown');
  const [videoDevicePermission, setVideoDevicePermission] = useState<DevicePermissionState>('Unknown');
  const [videoDeviceInfo, setVideoDeviceInfo] = useState<VideoDeviceInfo | undefined>(undefined);
  const [videoDeviceList, setVideoDeviceList] = useState<VideoDeviceInfo[]>([]);
  const [audioDeviceInfo, setAudioDeviceInfo] = useState<AudioDeviceInfo | undefined>(undefined);
  const [audioDeviceList, setAudioDeviceList] = useState<AudioDeviceInfo[]>([]);
  const refreshTokenCallbackRefContainer = useRef(refreshTokenCallback);

  // Update the state if the props change
  useEffect(() => {
    refreshTokenCallbackRefContainer.current = refreshTokenCallback;
  }, [refreshTokenCallback]);

  useEffect(() => {
    (async () => {
      try {
        // Need refactor: to support having ConfigurationScreen separate from GroupCall in Calling Sample, we need to
        // allow DeviceManager to be created but not create CallAgent because ConfigurationScreen depends on
        // DeviceManager but CallAgent depends on ConfigurationScreen displayName. So the CallingProvider used by
        // ConfigurationScreen will pass in undefined token while all other cases like when CallingProvider is used by
        // GroupCall or used in composite, you should pass in the valid token.
        if (token) {
          setCallAgent(
            await callClient.createCallAgent(
              createAzureCommunicationUserCredential(token, refreshTokenCallbackRefContainer.current),
              { displayName: displayName }
            )
          );
        }
        setDeviceManager(await callClient.getDeviceManager());
      } catch (error) {
        throw new CommunicationUiError({
          message: 'Error creating call agent',
          code: CommunicationUiErrorCode.CREATE_CALL_AGENT_ERROR,
          error: error
        });
      }
    })().catch((error) => {
      propagateError(error, onErrorCallback);
    });
  }, [token, callClient, refreshTokenCallbackRefContainer, displayName, onErrorCallback]);

  // Clean up callAgent whenever the callAgent or userTokenCredential is changed. This is required because callAgent itself is a singleton.
  // We need to clean up before creating another one.
  useEffect(() => {
    return () => {
      callAgent?.dispose().catch((error) => {
        const communicationError = new CommunicationUiError({
          message: 'Error disposing call agent',
          code: CommunicationUiErrorCode.DISPOSE_CALL_AGENT_ERROR,
          error: error
        });
        propagateError(communicationError, onErrorCallback);
      });
    };
    // Add CallAgent as part of the dependency list because we need the closure for callAgent
  }, [callAgent, token, onErrorCallback]);

  const initialState: CallingContextType = {
    callClient,
    setCallClient,
    callAgent,
    setCallAgent,
    deviceManager,
    setDeviceManager,
    userId,
    setUserId,
    displayName,
    setDisplayName,
    audioDevicePermission,
    setAudioDevicePermission,
    videoDevicePermission,
    setVideoDevicePermission,
    videoDeviceInfo,
    setVideoDeviceInfo,
    videoDeviceList,
    setVideoDeviceList,
    audioDeviceInfo,
    setAudioDeviceInfo,
    audioDeviceList,
    setAudioDeviceList
  };

  return <CallingContext.Provider value={initialState}>{props.children}</CallingContext.Provider>;
};

export const CallingProvider = (props: CallingProviderProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(CallingProviderBase, props);

export const useCallingContext = (): CallingContextType => useValidContext(CallingContext);
