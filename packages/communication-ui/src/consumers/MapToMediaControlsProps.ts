// © Microsoft Corporation. All rights reserved.

import { HangupCallOptions, PermissionState as DevicePermissionState } from '@azure/communication-calling';
import { useCallContext, useCallingContext } from '../providers';
import useSubscribeToDevicePermission from '../hooks/useSubscribeToDevicePermission';
import useLocalVideo from '../hooks/useLocalVideo';
import { useMicrophone } from '../hooks/useMicrophone';
import useScreenShare from '../hooks/useScreenShare';
import useSubscribeToVideoDeviceList from '../hooks/useSubscribeToVideoDeviceList';
import { isMobileSession } from '../utils';
import { useGroupCall } from '../hooks';

export type MediaControlsContainerProps = {
  /** Determines icon for mic toggle button. */
  isMicrophoneActive: boolean;
  /** Callback when microphone is unmuted. */
  unmuteMicrophone: () => void;
  /** Callback when microphone is muted. */
  muteMicrophone: () => void;
  /** Callback when microphone is toggled. */
  toggleMicrophone: () => void;
  /** Determines icon for video toggle button. */
  localVideoEnabled: boolean;
  /** Determines if video toggle button should be disabled. */
  localVideoBusy: boolean;
  /** Callback when video is turned on. */
  startLocalVideo: () => void;
  /** Callback when video is turned off. */
  stopLocalVideo: () => void;
  /** Callback when video is toggled. */
  toggleLocalVideo: () => void;
  /** Determines icon for screen share button. */
  isLocalScreenShareActive: boolean;
  /** Determines if screen share toggle button should be shown. */
  isRemoteScreenShareActive: boolean;
  /** Callback when screen share is turned on. */
  startScreenShare: () => void;
  /** Callback when screen share is turned off. */
  stopScreenShare: () => void;
  /** Callback when screen share is toggled. */
  toggleScreenShare: () => void;
  /** Determines camera permission. */
  cameraPermission: DevicePermissionState;
  /** Determines mic permission. */
  micPermission: DevicePermissionState;
  /** Determines if screen share is supported by browser. */
  isLocalScreenShareSupportedInBrowser(): boolean;
  /** Callback when leaving the call.  */
  leaveCall: (hangupCallOptions: HangupCallOptions) => Promise<void>;
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

  const toggleLocalVideo = async (): Promise<void> =>
    await (isLocalVideoOn ? stopLocalVideo(localVideoStream) : videoDeviceInfo && startLocalVideo(videoDeviceInfo));

  return {
    isMicrophoneActive: isMicrophoneEnabled,
    unmuteMicrophone: unmute,
    muteMicrophone: mute,
    toggleMicrophone: toggle,
    localVideoEnabled: isLocalVideoOn,
    localVideoBusy: isLocalVideoRendererBusy,
    startLocalVideo: () => videoDeviceInfo && startLocalVideo(videoDeviceInfo),
    stopLocalVideo: () => stopLocalVideo(localVideoStream),
    toggleLocalVideo,
    isLocalScreenShareActive: localScreenShareActive,
    isRemoteScreenShareActive: isRemoteScreenShareActive,
    startScreenShare,
    stopScreenShare,
    toggleScreenShare,
    cameraPermission: videoDevicePermission,
    micPermission: audioDevicePermission,
    isLocalScreenShareSupportedInBrowser,
    leaveCall: async (hangupCallOptions: HangupCallOptions) => {
      await leave(hangupCallOptions);
    }
  };
};
