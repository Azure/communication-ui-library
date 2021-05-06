// © Microsoft Corporation. All rights reserved.
import { AudioDeviceInfo, DeviceManager } from '@azure/communication-calling';
import { useCallingContext } from '../providers';
import { useEffect } from 'react';

export default (): void => {
  const { audioDevicePermission, setAudioDeviceInfo, setAudioDeviceList, deviceManager } = useCallingContext();

  useEffect(() => {
    if (!deviceManager || audioDevicePermission !== 'Granted') return;

    async function promptAudioDevices(deviceManager: DeviceManager): Promise<void> {
      const microphoneList: AudioDeviceInfo[] = await deviceManager.getMicrophones();
      setAudioDeviceList(microphoneList);
      if (microphoneList.length > 0) setAudioDeviceInfo(microphoneList[0]);
    }
    promptAudioDevices(deviceManager);

    const onAudioDevicesUpdated = (): void => {
      promptAudioDevices(deviceManager);
    };

    deviceManager.on('audioDevicesUpdated', onAudioDevicesUpdated);
    return () => {
      deviceManager.off('audioDevicesUpdated', onAudioDevicesUpdated);
    };
  }, [deviceManager, audioDevicePermission, setAudioDeviceInfo, setAudioDeviceList]);
};
