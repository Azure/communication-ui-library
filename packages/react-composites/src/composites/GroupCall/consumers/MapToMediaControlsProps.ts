// © Microsoft Corporation. All rights reserved.

import { HangUpOptions } from '@azure/communication-calling';
import { useCallContext, useCallingContext } from '../../../providers';
import useSubscribeToDevicePermission from '../../../hooks/useSubscribeToDevicePermission';
import useLocalVideo from '../../../hooks/useLocalVideo';
import { useMicrophone } from '../../../hooks/useMicrophone';
import useScreenShare from '../../../hooks/useScreenShare';
import useSubscribeToVideoDeviceList from '../../../hooks/useSubscribeToVideoDeviceList';
import { isMobileSession } from '../../../utils';
import { useGroupCall } from '../../../hooks';
import { CommunicationUiErrorCode, CommunicationUiError } from '../../../types/CommunicationUiError';
import { useCallback } from 'react';
import { DevicePermissionState } from '../../../types/DevicePermission';

export type MediaControlsContainerProps = {
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
  /** Determines if screen share is supported by browser. */
  isLocalScreenShareSupportedInBrowser(): boolean;
  /** Callback when leaving the call.  */
  leaveCall: (hangupCallOptions: HangUpOptions) => Promise<void>;
};

export const MapToMediaControlsProps = (): MediaControlsContainerProps => {
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

  // Only support Desktop -- Chrome | Edge (Chromium) | Safari
  const isLocalScreenShareSupportedInBrowser = (): boolean => {
    return (
      !isMobileSession() &&
      (/chrome/i.test(navigator.userAgent.toLowerCase()) || /safari/i.test(navigator.userAgent.toLowerCase()))
    );
  };

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
    isLocalScreenShareSupportedInBrowser,
    leaveCall: async (hangupCallOptions: HangUpOptions): Promise<void> => {
      await leave(hangupCallOptions);
    }
  };
};
