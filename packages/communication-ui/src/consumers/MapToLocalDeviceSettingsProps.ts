// © Microsoft Corporation. All rights reserved.

import { AudioDeviceInfo, LocalVideoStream, VideoDeviceInfo } from '@azure/communication-calling';
import useSubscribeToDevicePermission from '../hooks/useSubscribeToDevicePermission';
import useSubscribeToAudioDeviceList from '../hooks/useSubscribeToAudioDeviceList';
import useSubscribeToVideoDeviceList from '../hooks/useSubscribeToVideoDeviceList';
import { useCallingContext } from '../providers/CallingProvider';
import { useCallContext } from '../providers';
import { CommunicationUiErrorCode, CommunicationUiError } from '../types/CommunicationUiError';
import { useTriggerOnErrorCallback } from '../providers/ErrorProvider';
import { propagateError } from '../utils/SDKUtils';

export type LocalDeviceSettingsContainerProps = {
  /** List of video devices from which to select */
  videoDeviceList: VideoDeviceInfo[];
  /** List of audio devices from which to select */
  audioDeviceList: AudioDeviceInfo[];
  /** (Optional) Initial selected video device  */
  videoDeviceInfo?: VideoDeviceInfo;
  /** (Optional) Initial selected audio device */
  audioDeviceInfo?: AudioDeviceInfo;
  /** Callback when the video device selected is updated  */
  updateLocalVideoStream: (source: VideoDeviceInfo) => void;
  /** Callback when the audio device selected is updated */
  updateAudioDeviceInfo: (source: AudioDeviceInfo) => void;
};

export const MapToLocalDeviceSettingsProps = (): LocalDeviceSettingsContainerProps => {
  // Set or request device permission state before querying device lists.
  const {
    deviceManager,
    audioDeviceInfo,
    audioDeviceList,
    setAudioDeviceInfo,
    videoDeviceInfo,
    videoDeviceList,
    setVideoDeviceInfo
  } = useCallingContext();
  const { call, localVideoStream, setLocalVideoStream } = useCallContext();
  useSubscribeToDevicePermission('Camera');
  useSubscribeToDevicePermission('Microphone');
  useSubscribeToVideoDeviceList();
  useSubscribeToAudioDeviceList();
  const onErrorCallback = useTriggerOnErrorCallback();

  const updateLocalVideoStream = (source: VideoDeviceInfo): void => {
    setVideoDeviceInfo(source);
    if (localVideoStream) {
      const newLocalVideoStream = new LocalVideoStream(source);
      setLocalVideoStream(newLocalVideoStream);
      // if we have a call we want to switch the source and associate the video device info to the call's localVideoStream
      // I am assuming we only have one localVideoStream for this call
      call?.localVideoStreams[0].switchSource(source).catch((error) => {
        const uiError = new CommunicationUiError({
          message: 'Error switching local video source',
          code: CommunicationUiErrorCode.SWITCH_VIDEO_SOURCE_ERROR,
          error: error
        });
        propagateError(uiError, onErrorCallback);
      });
    }
  };

  const updateAudioDeviceInfo = (source: AudioDeviceInfo): void => {
    if (source) {
      setAudioDeviceInfo(source);
      deviceManager?.selectMicrophone(source);
    }
  };

  return {
    videoDeviceInfo,
    videoDeviceList,
    audioDeviceInfo,
    audioDeviceList,
    updateLocalVideoStream,
    updateAudioDeviceInfo
  };
};
