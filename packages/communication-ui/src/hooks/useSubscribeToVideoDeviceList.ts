// © Microsoft Corporation. All rights reserved.
import { DeviceManager, VideoDeviceInfo } from '@azure/communication-calling';
import { useCallingContext } from '../providers';
import { useEffect } from 'react';
import { isSelectedDeviceInList } from '../utils';

export default (): void => {
  const {
    videoDevicePermission,
    videoDeviceInfo,
    setVideoDeviceInfo,
    setVideoDeviceList,
    deviceManager
  } = useCallingContext();

  useEffect(() => {
    if (!deviceManager || videoDevicePermission !== 'Granted') return;

    async function promptVideoDevices(deviceManager: DeviceManager): Promise<void> {
      const cameraList: VideoDeviceInfo[] = await deviceManager.getCameras();
      setVideoDeviceList(cameraList);

      //Reset if the selected video is no longer available or no selected video.
      if (cameraList.length > 0 && (!videoDeviceInfo || !isSelectedDeviceInList(videoDeviceInfo, cameraList))) {
        setVideoDeviceInfo(cameraList[0]);
      }
    }

    promptVideoDevices(deviceManager);

    const onVideoDevicesUpdated = (): void => {
      promptVideoDevices(deviceManager);
    };

    deviceManager.on('videoDevicesUpdated', onVideoDevicesUpdated);
    return () => {
      deviceManager.off('videoDevicesUpdated', onVideoDevicesUpdated);
    };
  }, [deviceManager, videoDevicePermission, videoDeviceInfo, setVideoDeviceList, setVideoDeviceInfo]);
};
