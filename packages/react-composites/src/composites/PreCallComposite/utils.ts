// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DeviceManager } from '@azure/communication-calling';

/** @private */
export const requestPermissionsNativeAPI = async (): Promise<PermissionState> => {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    mediaStream.getTracks().forEach((track) => track.stop());
    return 'granted';
  } catch (error) {
    console.error(error);
    return 'denied';
  }
};

/** @private */
export const requestPermissionsDeviceManagerAPI = async (deviceManager?: DeviceManager): Promise<PermissionState> => {
  if (!deviceManager) {
    throw new Error('DeviceManager is required');
  }
  try {
    const result = await deviceManager.askDevicePermission({ video: true, audio: true });
    console.log('deviceManager.askDevicePermission result:', result);
    return result.audio && result.video ? 'granted' : 'denied';
  } catch (error) {
    console.error(error);
    return 'denied';
  }
};

/** @private */
// export const requestPermissionsPreCallDiagnosticsAPI = async (
//   callClient: CallClient | undefined,
//   credential: AzureCommunicationTokenCredential | undefined
// ): Promise<PermissionState> => {
//   if (!callClient || !credential) {
//     throw new Error('CallClient and Credential are required');
//   }
//   try {
//     const runningTest = await callClient?.feature(Features.PreCallDiagnostics).startTest(credential);
//     const result = await runningTest.deviceAccess;
//     return result.audio && result.video ? 'granted' : 'denied';
//   } catch (error) {
//     console.error(error);
//     return 'denied';
//   }
// };
