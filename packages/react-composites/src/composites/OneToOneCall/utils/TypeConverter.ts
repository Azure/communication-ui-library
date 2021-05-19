// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { RemoteParticipant as RemoteParticipantFromSDK } from '@azure/communication-calling';
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
