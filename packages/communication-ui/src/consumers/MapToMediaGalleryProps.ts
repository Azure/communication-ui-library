// © Microsoft Corporation. All rights reserved.

import { useCallContext } from '../providers';
import { useEffect, useState } from 'react';
import { GalleryParticipant } from '../types/GalleryParticipant';
import { convertSdkRemoteParticipantToGalleryParticipant } from '../utils/TypeConverter';

export type MediaGalleryContainerProps = {
  /** Determines the local participant label. */
  localParticipantLabel: string;
  /** Determines the remote participants in the media gallery. */
  remoteParticipants: GalleryParticipant[];
};

export const MapToMediaGalleryProps = (): MediaGalleryContainerProps => {
  const { participants, displayName } = useCallContext();
  const [remoteParticipants, setRemoteParticipants] = useState<GalleryParticipant[]>([]);
  // Filter out participants that are in Idle state and map ACS Remote participants to UI SDK RemoteParticipants
  useEffect(() => {
    setRemoteParticipants([
      ...participants
        .filter((participant) => participant.state !== 'Idle')
        .map((participant) => convertSdkRemoteParticipantToGalleryParticipant(participant))
    ]);
  }, [participants]);

  return {
    localParticipantLabel: displayName,
    remoteParticipants: remoteParticipants
  };
};
