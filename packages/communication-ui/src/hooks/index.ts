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

export { useFetchMessage } from './useFetchMessage';
export { useFetchMessages } from './useFetchMessages';
export { useFetchReadReceipts } from './useFetchReadReceipts';
export { useFetchThread } from './useFetchThread';
export { useFetchThreadMembers } from './useFetchThreadMembers';
export { useGroupCall } from './useGroupCall';
export { useIsMessageSeen } from './useIsMessageSeen';
export { useMicrophone } from './useMicrophone';
export { useOutgoingCall } from './useOutgoingCall';
export { useRemoveThreadMember } from './useRemoveThreadMember';
export { useSendMessage } from './useSendMessage';
export type { ChatMessageWithClientMessageId } from './useSendMessage';
export { useSendReadReceipt } from './useSendReadReceipt';
export { useSendTypingNotification } from './useSendTypingNotification';
export { useSubscribeMessage } from './useSubscribeMessage';
export { useSubscribeReadReceipt } from './useSubscribeReadReceipt';
export { useSubscribeTypingNotification } from './useSubscribeTypingNotification';
export { useTeamsCall } from './useTeamsCall';
export { useTypingUsers } from './useTypingUsers';
export { useUpdateThreadTopicName } from './useUpdateThreadTopicName';
export { useIncomingCall } from './useIncomingCall';
