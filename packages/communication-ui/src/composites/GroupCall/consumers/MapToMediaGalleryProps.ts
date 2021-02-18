// © Microsoft Corporation. All rights reserved.

import { useCallContext, useCallingContext } from '../../../providers';
import { useEffect, useState } from 'react';
import { GalleryParticipant, LocalGalleryParticipant } from '../../../types/GalleryParticipant';
import { convertSdkRemoteParticipantToGalleryParticipant } from '../../../utils/TypeConverter';
import { ParticipantStream } from '../../../types/ParticipantStream';

export type MediaGalleryContainerProps = {
  /** Determines the local participant in the media gallery. */
  localParticipant: LocalGalleryParticipant;
  /** Determines the remote participants in the media gallery. */
  remoteParticipants: GalleryParticipant[];
  /** Determines the screen share stream in the media gallery. */
  screenShareStream: ParticipantStream | undefined;
};

export const MapToMediaGalleryProps = (): MediaGalleryContainerProps => {
  const { participants, displayName, screenShareStream, localVideoStream } = useCallContext();
  const { userId } = useCallingContext();
  const [remoteParticipants, setRemoteParticipants] = useState<GalleryParticipant[]>([]);
  const [localParticipant, setLocalParticipant] = useState<LocalGalleryParticipant>({
    userId,
    displayName,
    videoStream: localVideoStream
  });

  // Filter out participants that are in Idle state and map ACS Remote participants to UI SDK RemoteParticipants
  useEffect(() => {
    setRemoteParticipants([
      ...participants
        .filter((participant) => participant.state !== 'Idle')
        .map((participant) => convertSdkRemoteParticipantToGalleryParticipant(participant))
    ]);
  }, [participants]);

  useEffect(() => {
    setLocalParticipant({
      displayName,
      userId,
      videoStream: localVideoStream
    });
  }, [displayName, localVideoStream, userId]);

  // we still want to return local participant and remote participant together because this will reduce the rerendering required
  // At least locally if contoso turn on/off the camera, this will not cause the whole gallery to rerender
  return {
    localParticipant,
    remoteParticipants,
    screenShareStream
  };
};
