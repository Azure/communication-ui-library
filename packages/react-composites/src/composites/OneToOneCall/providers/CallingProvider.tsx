// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createStatefulCallClient, StatefulCallClient, StatefulDeviceManager } from 'calling-stateful-client';
import { AudioDeviceInfo, CallAgent, CallClientOptions, VideoDeviceInfo } from '@azure/communication-calling';
import { AbortSignalLike } from '@azure/core-http';
import React, { createContext, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { CommunicationUiError, CommunicationUiErrorCode } from '../../../types/CommunicationUiError';
import { DevicePermissionState } from '../../../types/DevicePermission';
import { createAzureCommunicationUserCredential, getIdFromToken, propagateError } from '../../../utils';
import { ErrorHandlingProps } from './ErrorProvider';
import { WithErrorHandling } from '../utils/WithErrorHandling';
import { useValidContext } from '../utils/ValidContext';

export type CallingContextType = {
  userId: string;
  setUserId: Dispatch<SetStateAction<string>>;
  displayName: string;
  setDisplayName: Dispatch<SetStateAction<string>>;
  callClient: StatefulCallClient;
  setCallClient: Dispatch<SetStateAction<StatefulCallClient>>;
  callAgent: CallAgent | undefined;
  setCallAgent: Dispatch<SetStateAction<CallAgent | undefined>>;
  deviceManager: StatefulDeviceManager | undefined;
  setDeviceManager: Dispatch<SetStateAction<StatefulDeviceManager | undefined>>;
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
  const [callClient, setCallClient] = useState<StatefulCallClient>(
    createStatefulCallClient({ userId: userIdFromToken }, callClientOptions)
  );
  const [callAgent, setCallAgent] = useState<CallAgent | undefined>(undefined);
  const [deviceManager, setDeviceManager] = useState<StatefulDeviceManager | undefined>(undefined);
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
    setUserId(userIdFromToken);
  }, [userIdFromToken]);

  useEffect(() => {
    (async () => {
      try {
        // Need refactor: to support having ConfigurationScreen separate from CallScreen in Calling Sample, we need to
        // allow DeviceManager to be created but not create CallAgent because ConfigurationScreen depends on
        // DeviceManager but CallAgent depends on ConfigurationScreen displayName. So the CallingProvider used by
        // ConfigurationScreen will pass in undefined token while all other cases like when CallingProvider is used by
        // CallScreen or used in composite, you should pass in the valid token.
        if (token) {
          setCallAgent(
            await callClient.createCallAgent(
              createAzureCommunicationUserCredential(token, refreshTokenCallbackRefContainer.current),
              { displayName: displayName }
            )
          );
        }

        /**
         * Initialize the DeviceManager state.
         */
        const statefulDeviceManager = (await callClient.getDeviceManager()) as StatefulDeviceManager;
        statefulDeviceManager.getCameras();
        statefulDeviceManager.getMicrophones();
        statefulDeviceManager.getSpeakers();
        setDeviceManager(statefulDeviceManager);
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

export const useCallClient = (): StatefulCallClient => {
  return useValidContext(CallingContext).callClient;
};

export const useDeviceManager = (): StatefulDeviceManager | undefined => {
  return useValidContext(CallingContext).deviceManager;
};

export const useIdentifier = (): string | undefined => {
  return useValidContext(CallingContext).userId;
};

export const useDisplayName = (): string | undefined => {
  return useValidContext(CallingContext).displayName;
};
