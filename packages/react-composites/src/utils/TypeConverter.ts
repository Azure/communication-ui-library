// © Microsoft Corporation. All rights reserved.

import { RemoteParticipant as RemoteParticipantFromSDK } from '@azure/communication-calling';
import { ListParticipant } from '../types/ListParticipant';
import { GalleryParticipant } from '../types/GalleryParticipant';
import { getACSId } from './SDKUtils';

export const convertSdkRemoteParticipantToGalleryParticipant = (
  remoteParticipantFromSDK: RemoteParticipantFromSDK
): GalleryParticipant => {
  const identifier = getACSId(remoteParticipantFromSDK.identifier);
  return {
    userId: identifier,
    displayName: remoteParticipantFromSDK.displayName ?? identifier,
    videoStream: remoteParticipantFromSDK.videoStreams[0]
  };
};

export const convertSdkRemoteParticipantToListParticipant = (
  participant: RemoteParticipantFromSDK,
  onRemove?: () => void,
  onMute?: () => void
): ListParticipant => {
  const isScreenSharing = participant.videoStreams.some(
    (vs) => vs.mediaStreamType === 'ScreenSharing' && vs.isAvailable
  );
  const identifier = getACSId(participant.identifier);
  return {
    key: identifier,
    displayName: participant.displayName ?? identifier,
    state: participant.state,
    isScreenSharing: isScreenSharing,
    isMuted: participant.isMuted,
    onRemove: onRemove,
    onMute: onMute
  };
};
