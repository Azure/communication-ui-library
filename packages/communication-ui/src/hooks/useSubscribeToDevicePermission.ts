// © Microsoft Corporation. All rights reserved.
import { CallingContext } from '../providers';
import { useContext, useEffect, useRef, useState } from 'react';
import { CommunicationUiErrorCode, CommunicationUiError } from '../types/CommunicationUiError';
import { useTriggerOnErrorCallback } from '../providers/ErrorProvider';
import { propagateError } from '../utils/SDKUtils';
import { DevicePermissionState, DevicePermissionType } from '../types/DevicePermission';

// uses the device manager which abstracts away the HTML5 permission system
// device manager will be able to get the initial real state
// at some time later (useEffect) we will have the real default value
// if the real value was prompt, then we can call askPermission again to get a Granted or Denied value
export default (permissionType: DevicePermissionType): void => {
  const context = useContext(CallingContext);
  const onErrorCallback = useTriggerOnErrorCallback();
  if (!context) {
    throw new CommunicationUiError({
      message: 'CallingContext is undefined',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR
    });
  }
  const { deviceManager, setAudioDevicePermission, setVideoDevicePermission } = context;
  const [devicePermissionState, setDevicePermissionState] = useState<DevicePermissionState>('Unknown');
  const mounted = useRef(false);

  // With new SDK, the permissions all happen async. Make sure not up try to update state if the component was already
  // unmounted.
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  });

  useEffect(() => {
    if (!deviceManager || devicePermissionState === 'Granted' || devicePermissionState === 'Denied') return;

    const queryPermissionState = async (): Promise<void> => {
      if (devicePermissionState === 'Unknown') {
        try {
          if (permissionType === 'Microphone') {
            const access = await deviceManager.askDevicePermission({ video: false, audio: true });
            if (!mounted.current) {
              return;
            }
            const permissionState = access.audio ? 'Granted' : 'Denied';
            setDevicePermissionState(permissionState);
            setAudioDevicePermission(permissionState);
          } else if (permissionType === 'Camera') {
            const access = await deviceManager.askDevicePermission({ video: true, audio: false });
            if (!mounted.current) {
              return;
            }
            const permissionState = access.video ? 'Granted' : 'Denied';
            setDevicePermissionState(permissionState);
            setVideoDevicePermission(permissionState);
          } else {
            throw new Error('invalid device type specified');
          }
        } catch (error) {
          throw new CommunicationUiError({
            message: 'Error asking permissions',
            code: CommunicationUiErrorCode.ASK_PERMISSIONS_ERROR,
            error
          });
        }
      }
    };

    queryPermissionState().catch((error) => {
      propagateError(error, onErrorCallback);
    });
  }, [
    deviceManager,
    permissionType,
    setAudioDevicePermission,
    setVideoDevicePermission,
    onErrorCallback,
    devicePermissionState
  ]);
};
