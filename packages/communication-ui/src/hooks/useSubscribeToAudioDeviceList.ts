// © Microsoft Corporation. All rights reserved.
import { AudioDeviceInfo, DeviceManager } from '@azure/communication-calling';
import { useCallingContext } from '../providers';
import { useEffect } from 'react';

export default (): void => {
  const { audioDevicePermission, setAudioDeviceInfo, setAudioDeviceList, deviceManager } = useCallingContext();

  useEffect(() => {
    if (!deviceManager || audioDevicePermission !== 'Granted') return;

    function promptAudioDevices(deviceManager: DeviceManager): void {
      const microphoneList: AudioDeviceInfo[] = deviceManager.getMicrophoneList();
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
