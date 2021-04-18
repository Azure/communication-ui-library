// © Microsoft Corporation. All rights reserved.

import { HangUpOptions } from '@azure/communication-calling';
import { useCallContext, useCallingContext } from '../../../providers';
import { CommunicationUiErrorCode, CommunicationUiError, DevicePermissionState } from '../../../types';
import {
  useSubscribeToDevicePermission,
  useLocalVideo,
  useMicrophone,
  useScreenShare,
  useSubscribeToVideoDeviceList,
  useGroupCall
} from '../../../hooks';

import { useCallback } from 'react';

export type CallControlBarContainerProps = {
  /** Determines icon for mic toggle button. */
  isMicrophoneActive: boolean;
  /** Callback when microphone is unmuted. */
  unmuteMicrophone: () => Promise<void>;
  /** Callback when microphone is muted. */
  muteMicrophone: () => Promise<void>;
  /** Callback when microphone is toggled. */
  toggleMicrophone: () => Promise<void>;
  /** Determines icon for video toggle button. */
  localVideoEnabled: boolean;
  /** Determines if video toggle button should be disabled. */
  localVideoBusy: boolean;
  /** Callback when video is turned on. */
  startLocalVideo: () => Promise<void>;
  /** Callback when video is turned off. */
  stopLocalVideo: () => Promise<void>;
  /** Callback when video is toggled. */
  toggleLocalVideo: () => Promise<void>;
  /** Determines icon for screen share button. */
  isLocalScreenShareActive: boolean;
  /** Determines if screen share toggle button should be shown. */
  isRemoteScreenShareActive: boolean;
  /** Callback when screen share is turned on. */
  startScreenShare: () => Promise<void>;
  /** Callback when screen share is turned off. */
  stopScreenShare: () => Promise<void>;
  /** Callback when screen share is toggled. */
  toggleScreenShare: () => Promise<void>;
  /** Determines camera permission. */
  cameraPermission: DevicePermissionState;
  /** Determines mic permission. */
  micPermission: DevicePermissionState;
  /** Callback when leaving the call.  */
  leaveCall: (hangupCallOptions: HangUpOptions) => Promise<void>;
};

export const MapToCallControlBarProps = (): CallControlBarContainerProps => {
  const { videoDevicePermission, audioDevicePermission, videoDeviceInfo } = useCallingContext();
  const {
    localVideoStream,
    isLocalVideoOn,
    isLocalVideoRendererBusy,
    screenShareStream,
    isMicrophoneEnabled,
    localScreenShareActive
  } = useCallContext();
  const { unmute, mute, toggle } = useMicrophone();
  const { startLocalVideo, stopLocalVideo } = useLocalVideo();
  const { startScreenShare, stopScreenShare, toggleScreenShare } = useScreenShare();
  const isRemoteScreenShareActive = !!screenShareStream;
  const { leave } = useGroupCall();
  useSubscribeToDevicePermission('Camera');
  useSubscribeToDevicePermission('Microphone');
  useSubscribeToVideoDeviceList();

  const startLocalVideoInternal = useCallback((): Promise<void> => {
    if (videoDeviceInfo) {
      return startLocalVideo(videoDeviceInfo);
    } else {
      throw new CommunicationUiError({
        message: 'Cannot start local video - no video device info',
        code: CommunicationUiErrorCode.START_VIDEO_ERROR
      });
    }
  }, [startLocalVideo, videoDeviceInfo]);

  const toggleLocalVideo = async (): Promise<void> =>
    await (isLocalVideoOn ? stopLocalVideo(localVideoStream) : startLocalVideoInternal());

  return {
    isMicrophoneActive: isMicrophoneEnabled,
    unmuteMicrophone: unmute,
    muteMicrophone: mute,
    toggleMicrophone: toggle,
    localVideoEnabled: isLocalVideoOn,
    localVideoBusy: isLocalVideoRendererBusy,
    startLocalVideo: startLocalVideoInternal,
    stopLocalVideo: (): Promise<void> => stopLocalVideo(localVideoStream),
    toggleLocalVideo,
    isLocalScreenShareActive: localScreenShareActive,
    isRemoteScreenShareActive: isRemoteScreenShareActive,
    startScreenShare,
    stopScreenShare,
    toggleScreenShare,
    cameraPermission: videoDevicePermission,
    micPermission: audioDevicePermission,
    leaveCall: async (hangupCallOptions: HangUpOptions): Promise<void> => {
      await leave(hangupCallOptions);
    }
  };
};
