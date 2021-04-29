// © Microsoft Corporation. All rights reserved.

// Todo: move these away from default exports
import useSubscribeToAudioDeviceList from './useSubscribeToAudioDeviceList';
import useCallAgent from './useCallAgent';
import useLocalVideo from './useLocalVideo';
import useSubscribeToDevicePermission from './useSubscribeToDevicePermission';
import useLocalVideoStreamRenderer from './useLocalVideoStreamRenderer';
import useRemoteVideoStreamRenderer from './useRemoteVideoStreamRenderer';
import useScreenShare from './useScreenShare';
import useSubscribeToVideoDeviceList from './useSubscribeToVideoDeviceList';

export {
  useSubscribeToAudioDeviceList,
  useCallAgent,
  useLocalVideo,
  useSubscribeToDevicePermission,
  useLocalVideoStreamRenderer,
  useRemoteVideoStreamRenderer,
  useScreenShare,
  useSubscribeToVideoDeviceList
};

export { useGroupCall } from './useGroupCall';
export { useMicrophone } from './useMicrophone';
export { useOutgoingCall } from './useOutgoingCall';
export { useTeamsCall } from './useTeamsCall';
export { useIncomingCall } from './useIncomingCall';
