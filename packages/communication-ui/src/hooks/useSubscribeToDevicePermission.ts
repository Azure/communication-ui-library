// © Microsoft Corporation. All rights reserved.
import { PermissionType, PermissionState as DevicePermissionState, DeviceAccess } from '@azure/communication-calling';
import { CallingContext } from '../providers';
import { useContext, useEffect, useState } from 'react';
import { CommunicationUiErrorCode, CommunicationUiError } from '../types/CommunicationUiError';
import { useTriggerOnErrorCallback } from '../providers/ErrorProvider';
import { propagateError } from '../utils/SDKUtils';

// uses the device manager which abstracts away the HTML5 permission system
// device manager will be able to get the initial real state
// at some time later (useEffect) we will have the real default value
// if the real value was prompt, then we can call askPermission again to get a Granted or Denied value
export default (permissionType: PermissionType): void => {
  const context = useContext(CallingContext);
  const onErrorCallback = useTriggerOnErrorCallback();
  if (!context) {
    throw new CommunicationUiError({
      message: 'CallingContext is undefined',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR
    });
  }
  const { deviceManager, setAudioDevicePermission, setVideoDevicePermission } = context;
  const [permissionState, setPermissionState] = useState<DevicePermissionState>('Unknown');

  useEffect(() => {
    if (!deviceManager || permissionState === 'Granted' || permissionState === 'Denied') return;

    const queryPermissionState = async (): Promise<void> => {
      let state: DevicePermissionState;
      try {
        state = await deviceManager.getPermissionState(permissionType);
      } catch (error) {
        throw new CommunicationUiError({
          message: 'Error getting permission state',
          code: CommunicationUiErrorCode.QUERY_PERMISSIONS_ERROR,
          error: error
        });
      }
      if (state === 'Unknown' || state === 'Prompt') {
        let access: DeviceAccess;
        try {
          access = await deviceManager.askDevicePermission(
            permissionType === 'Microphone',
            permissionType === 'Camera'
          );
        } catch (error) {
          throw new CommunicationUiError({
            message: 'Error asking permissions',
            code: CommunicationUiErrorCode.ASK_PERMISSIONS_ERROR,
            error
          });
        }
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

    queryPermissionState().catch((error) => {
      propagateError(error, onErrorCallback);
    });

    deviceManager.on('permissionStateChanged', queryPermissionState);

    return () => {
      deviceManager.off('permissionStateChanged', queryPermissionState);
    };
  }, [
    deviceManager,
    permissionType,
    permissionState,
    setAudioDevicePermission,
    setVideoDevicePermission,
    onErrorCallback
  ]);
};
