// © Microsoft Corporation. All rights reserved.
import { PermissionType, PermissionState as DevicePermissionState } from '@azure/communication-calling';
import { CallingContext } from '../providers';
import { useContext, useEffect, useState } from 'react';

// uses the device manager which abstracts away the HTML5 permission system
// device manager will be able to get the initial real state
// at some time later (useEffect) we will have the real default value
// if the real value was prompt, then we can call askPermission again to get a Granted or Denied value
export default (permissionType: PermissionType): void => {
  const context = useContext(CallingContext);
  if (!context) {
    throw new Error('Calling Context does not exist');
  }
  const { deviceManager, setAudioDevicePermission, setVideoDevicePermission } = context;
  const [permissionState, setPermissionState] = useState<DevicePermissionState>('Unknown');

  useEffect(() => {
    if (!deviceManager || permissionState === 'Granted' || permissionState === 'Denied') return;

    const queryPermissionState = async (): Promise<void> => {
      let state: DevicePermissionState = await deviceManager.getPermissionState(permissionType);
      if (state === 'Unknown' || state === 'Prompt') {
        const access = await deviceManager.askDevicePermission(
          permissionType === 'Microphone',
          permissionType === 'Camera'
        );
        if (permissionType === 'Camera') {
          state = access.video ? 'Granted' : 'Denied';
        }
        if (permissionType === 'Microphone') {
          state = access.audio ? 'Granted' : 'Denied';
        }
      }
      setPermissionState(state);

      if (permissionType === 'Camera') setVideoDevicePermission(state);
      else setAudioDevicePermission(state);
    };

    queryPermissionState();
    deviceManager.on('permissionStateChanged', queryPermissionState);

    return () => {
      deviceManager.off('permissionStateChanged', queryPermissionState);
    };
  }, [deviceManager, permissionType, permissionState, setAudioDevicePermission, setVideoDevicePermission]);
};
