// © Microsoft Corporation. All rights reserved.

import { useCallingContext, useCallContext } from '../providers';
import { useState, useEffect } from 'react';
import { ListParticipant } from '../types/ListParticipant';
import { convertSdkRemoteParticipantToListParticipant } from '../utils/TypeConverter';

type ParticipantListContainerProps = {
  remoteParticipants: ListParticipant[];
  isScreenSharingOn: boolean;
  userId: string;
  displayName: string;
  isMuted: boolean;
};

export const MapToParticipantListProps = (): ParticipantListContainerProps => {
  const { userId } = useCallingContext();
  const { call, participants, displayName } = useCallContext();
  const [remoteParticipants, setRemoteParticipants] = useState<ListParticipant[]>([]);

  useEffect(() => {
    setRemoteParticipants([
      ...participants.map((p) =>
        convertSdkRemoteParticipantToListParticipant(p, call ? () => call.removeParticipant(p.identifier) : undefined)
      )
    ]);
  }, [participants, call]);

  return {
    remoteParticipants: remoteParticipants,
    isScreenSharingOn: call?.isScreenSharingOn ?? false,
    displayName: displayName,
    userId: userId,
    isMuted: call?.isMicrophoneMuted ?? false
  };
};
