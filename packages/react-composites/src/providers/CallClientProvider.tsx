// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallClientOptions } from '@azure/communication-calling';
import { AbortSignalLike } from '@azure/core-http';
import { createStatefulCallClient, StatefulCallClient, StatefulDeviceManager } from 'calling-stateful-client';
import React, { createContext, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { CommunicationUiError, CommunicationUiErrorCode } from '../types/CommunicationUiError';
import { DevicePermissionState } from '../types/DevicePermission';
import { getIdFromToken, useValidContext } from '../utils';

export type CallClientContextType = {
  userId: string;
  setUserId: Dispatch<SetStateAction<string>>;
  displayName: string;
  setDisplayName: Dispatch<SetStateAction<string>>;
  callClient: StatefulCallClient;
  setCallClient: Dispatch<SetStateAction<StatefulCallClient>>;
  deviceManager: StatefulDeviceManager | undefined;
  setDeviceManager: Dispatch<SetStateAction<StatefulDeviceManager | undefined>>;
  audioDevicePermission: DevicePermissionState;
  setAudioDevicePermission: Dispatch<SetStateAction<DevicePermissionState>>;
  videoDevicePermission: DevicePermissionState;
  setVideoDevicePermission: Dispatch<SetStateAction<DevicePermissionState>>;

  isCallStartedWithCameraOn?: boolean;
  setIsCallStartedWithCameraOn: Dispatch<SetStateAction<boolean>>;
};

export const CallClientContext = createContext<CallClientContextType | undefined>(undefined);

interface CallClientProvider {
  children: React.ReactNode;
  token: string;
  displayName: string;
  callClientOptions?: CallClientOptions;
  refreshTokenCallback?: (abortSignal?: AbortSignalLike) => Promise<string>;
}

const CallClientProviderBase = (props: CallClientProvider): JSX.Element => {
  const { token, callClientOptions, displayName: initialDisplayName, refreshTokenCallback } = props;

  // if there is no valid token then there is no valid userId
  const userIdFromToken = token ? getIdFromToken(token) : '';

  const [callClient, setCallClient] = useState<StatefulCallClient>(
    createStatefulCallClient({ userId: userIdFromToken }, callClientOptions)
  );
  const [deviceManager, setDeviceManager] = useState<StatefulDeviceManager | undefined>(undefined);
  const [userId, setUserId] = useState<string>(userIdFromToken);
  const [displayName, setDisplayName] = useState<string>(initialDisplayName);
  const [audioDevicePermission, setAudioDevicePermission] = useState<DevicePermissionState>('Unknown');
  const [videoDevicePermission, setVideoDevicePermission] = useState<DevicePermissionState>('Unknown');
  const [isCallStartedWithCameraOn, setIsCallStartedWithCameraOn] = useState(false);
  const refreshTokenCallbackRefContainer = useRef(refreshTokenCallback);

  // Update the state if the props change
  useEffect(() => {
    refreshTokenCallbackRefContainer.current = refreshTokenCallback;
  }, [refreshTokenCallback]);

  useEffect(() => {
    setUserId(userIdFromToken);
  }, [userIdFromToken]);

  /**
   * Initialize the DeviceManager inside CallClientState
   */
  useEffect(() => {
    callClient
      .getDeviceManager()
      .then((manager) => {
        manager.getCameras();
        manager.getMicrophones();
        manager.getSpeakers();
        setDeviceManager(manager as StatefulDeviceManager);
      })
      .catch((error) => {
        throw new CommunicationUiError({
          message: 'Error creating device manager',
          code: CommunicationUiErrorCode.CREATE_DEVICE_MANAGER_ERROR,
          error: error
        });
      });
  }, [callClient]);

  const initialState: CallClientContextType = {
    callClient,
    setCallClient,
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
    isCallStartedWithCameraOn,
    setIsCallStartedWithCameraOn
  };

  return <CallClientContext.Provider value={initialState}>{props.children}</CallClientContext.Provider>;
};

export const CallClientProvider = (props: CallClientProvider): JSX.Element => <CallClientProviderBase {...props} />;

export const useCallClientContext = (): CallClientContextType => useValidContext(CallClientContext);

export const useCallClient = (): StatefulCallClient => {
  return useValidContext(CallClientContext).callClient;
};

export const useDeviceManager = (): StatefulDeviceManager | undefined => {
  return useValidContext(CallClientContext).deviceManager;
};

export const useIdentifier = (): string | undefined => {
  return useValidContext(CallClientContext).userId;
};
