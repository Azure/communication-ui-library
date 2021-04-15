// © Microsoft Corporation. All rights reserved.

import { CallingContext, CallingContextType } from '../providers/CallingProvider';
import React, { useState } from 'react';
import {
  AudioDeviceInfo,
  CallAgent,
  CallClient,
  CallClientOptions,
  DeviceManager,
  VideoDeviceInfo
} from '@azure/communication-calling';
import { DevicePermissionState } from '../types/DevicePermission';
import { ErrorHandlingProps } from '../providers/ErrorProvider';
import { AbortSignalLike } from '@azure/core-http';

interface CallingProviderProps {
  children: React.ReactNode;
  token: string;
  displayName: string;
  callClientOptions?: CallClientOptions;
  refreshTokenCallback?: (abortSignal?: AbortSignalLike) => Promise<string>;
}

/**
 * MockCallingProvider just provides some empty default values and default functions to avoid the useEffect being called
 * in tests.
 *
 * @param props
 * @returns
 */
export const MockCallingProvider = (props: CallingProviderProps & ErrorHandlingProps): JSX.Element => {
  const [callClient, setCallClient] = useState<CallClient>(new CallClient());
  const [callAgent, setCallAgent] = useState<CallAgent | undefined>(undefined);
  const [deviceManager, setDeviceManager] = useState<DeviceManager | undefined>(undefined);
  const [userId, setUserId] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [audioDevicePermission, setAudioDevicePermission] = useState<DevicePermissionState>('Unknown');
  const [videoDevicePermission, setVideoDevicePermission] = useState<DevicePermissionState>('Unknown');
  const [videoDeviceInfo, setVideoDeviceInfo] = useState<VideoDeviceInfo | undefined>(undefined);
  const [videoDeviceList, setVideoDeviceList] = useState<VideoDeviceInfo[]>([]);
  const [audioDeviceInfo, setAudioDeviceInfo] = useState<AudioDeviceInfo | undefined>(undefined);
  const [audioDeviceList, setAudioDeviceList] = useState<AudioDeviceInfo[]>([]);

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
