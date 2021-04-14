// © Microsoft Corporation. All rights reserved.

import { LocalVideoStream } from '@azure/communication-calling';
import { useEffect, useState } from 'react';
import { useCallContext, useCallingContext } from '../../../providers';
import { GalleryParticipant } from '../../../types/GalleryParticipant';
import { convertSdkRemoteParticipantToGalleryParticipant } from '../../../utils/TypeConverter';

export type MediaGallery1To1ContainerProps = {
  /** Determines the local participant label and avatar. */
  localParticipantName?: string;
  /** Determines the remote participant in the media gallery. */
  remoteParticipant: GalleryParticipant | undefined;
  /** Local Video Stream (Not a video stream element) */
  localVideoStream: LocalVideoStream | undefined;
};

export const MapToMediaGallery1To1Props = (): MediaGallery1To1ContainerProps => {
  const { call, localVideoStream } = useCallContext();
  const { displayName } = useCallingContext();
  const [remoteParticipant, setRemoteParticipant] = useState<GalleryParticipant | undefined>();

  useEffect(() => {
    if (call && call.remoteParticipants.length > 0) {
      setRemoteParticipant(convertSdkRemoteParticipantToGalleryParticipant(call.remoteParticipants[0]));
    }
  }, [call]);

  return {
    localParticipantName: displayName,
    remoteParticipant: remoteParticipant,
    localVideoStream: localVideoStream
  };
};
