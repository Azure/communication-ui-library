// © Microsoft Corporation. All rights reserved.

import { useState, useEffect } from 'react';
import {
  useCallingContext,
  useCallContext,
  ListParticipant,
  convertSdkRemoteParticipantToListParticipant
} from '@azure/communication-ui';

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
