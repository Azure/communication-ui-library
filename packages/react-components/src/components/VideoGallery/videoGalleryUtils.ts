// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useCallback, useRef } from 'react';
import { smartDominantSpeakerParticipants } from '../../gallery';
import { VideoGalleryParticipant, VideoGalleryRemoteParticipant } from '../../types';

interface UseFloatingLocalVideoLayoutArgs {
  remoteParticipants: VideoGalleryRemoteParticipant[];
  dominantSpeakers?: string[];
  maxRemoteVideoStreams?: number;
  maxAudioDominantSpeakers?: number;
  isScreenShareActive?: boolean;
}

interface LayoutResult {
  gridParticipants: VideoGalleryParticipant[];
  horizontalGalleryParticipants: VideoGalleryParticipant[];
}

const DEFAULT_MAX_REMOTE_VIDEOSTREAMS = 4;

const DEFAULT_MAX_AUDIO_DOMINANT_SPEAKERS = 6;

/**
 * @private
 */
export const useFloatingLocalVideoLayout = (props: UseFloatingLocalVideoLayoutArgs): LayoutResult => {
  const visibleVideoParticipants = useRef<VideoGalleryRemoteParticipant[]>([]);
  const visibleAudioParticipants = useRef<VideoGalleryRemoteParticipant[]>([]);

  const {
    remoteParticipants,
    dominantSpeakers,
    maxRemoteVideoStreams = DEFAULT_MAX_REMOTE_VIDEOSTREAMS,
    maxAudioDominantSpeakers = DEFAULT_MAX_AUDIO_DOMINANT_SPEAKERS,
    isScreenShareActive = false
  } = props;

  visibleVideoParticipants.current = smartDominantSpeakerParticipants({
    participants: remoteParticipants?.filter((p) => p.videoStream?.isAvailable) ?? [],
    dominantSpeakers,
    lastVisibleParticipants: visibleVideoParticipants.current,
    maxDominantSpeakers: maxRemoteVideoStreams
  }).slice(0, maxRemoteVideoStreams);

  const visibleVideoParticipantsSet = new Set(visibleVideoParticipants.current.map((p) => p.userId));

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const callingParticipants = remoteParticipants.filter((p) => p.state === ('Connecting' || 'Ringing'));
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const callingParticipantsSet = new Set(callingParticipants.map((p) => p.userId));

  visibleAudioParticipants.current = smartDominantSpeakerParticipants({
    participants:
      remoteParticipants?.filter(
        (p) =>
          !visibleVideoParticipantsSet.has(p.userId) &&
          /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ !callingParticipantsSet.has(
            p.userId
          )
      ) ?? [],
    dominantSpeakers,
    lastVisibleParticipants: visibleAudioParticipants.current,
    maxDominantSpeakers: maxAudioDominantSpeakers
  });

  const getGridParticipants = useCallback((): VideoGalleryRemoteParticipant[] => {
    if (isScreenShareActive) {
      return [];
    }
    /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
    return visibleVideoParticipants.current.length > 0
      ? visibleVideoParticipants.current
      : visibleAudioParticipants.current.concat(callingParticipants);
    return visibleVideoParticipants.current.length > 0
      ? visibleVideoParticipants.current
      : visibleAudioParticipants.current;
  }, [
    /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ callingParticipants,
    isScreenShareActive
  ]);

  const gridParticipants = getGridParticipants();

  const getHorizontalGalleryRemoteParticipants = useCallback((): VideoGalleryRemoteParticipant[] => {
    if (isScreenShareActive) {
      // If screen sharing is active, assign video and audio participants as horizontal gallery participants
      /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
      return visibleVideoParticipants.current.concat(visibleAudioParticipants.current.concat(callingParticipants));
      return visibleVideoParticipants.current.concat(visibleAudioParticipants.current);
    } else {
      // If screen sharing is not active, then assign all video tiles as grid tiles.
      // If there are no video tiles, then assign audio tiles as grid tiles.
      /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
      return visibleVideoParticipants.current.length > 0
        ? visibleAudioParticipants.current.concat(callingParticipants)
        : [];
      return visibleVideoParticipants.current.length > 0 ? visibleAudioParticipants.current : [];
    }
  }, [
    /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ callingParticipants,
    isScreenShareActive
  ]);

  const horizontalGalleryParticipants = getHorizontalGalleryRemoteParticipants();

  return { gridParticipants, horizontalGalleryParticipants };
};

interface UsePinnedParticipantLayoutArgs extends UseFloatingLocalVideoLayoutArgs {
  pinnedParticipantUserIds: string[];
}

/**
 * @private
 */
export const usePinnedParticipantLayout = (props: UsePinnedParticipantLayoutArgs): LayoutResult => {
  const pinnedParticipants: VideoGalleryRemoteParticipant[] = [];
  const remoteParticpantMap = props.remoteParticipants.reduce((map, remoteParticipant) => {
    map[remoteParticipant.userId] = remoteParticipant;
    return map;
  }, {});
  let pinnedParticipantsWithVideoOnCount = 0;
  props.pinnedParticipantUserIds.forEach((id) => {
    const pinnedParticipant = remoteParticpantMap[id];
    if (pinnedParticipant) {
      pinnedParticipants.push(pinnedParticipant);
      if (pinnedParticipant.videoStream?.isAvailable) {
        pinnedParticipantsWithVideoOnCount++;
      }
    }
  });
  const pinnedParticipantUserIdSet = new Set(props.pinnedParticipantUserIds);
  const unpinnedParticipants = props.remoteParticipants.filter((p) => !pinnedParticipantUserIdSet.has(p.userId));

  const floatingLocalVideoLayout = useFloatingLocalVideoLayout({
    ...props,
    remoteParticipants: unpinnedParticipants,
    maxRemoteVideoStreams: props.maxRemoteVideoStreams
      ? props.maxRemoteVideoStreams - pinnedParticipantsWithVideoOnCount
      : undefined
  });

  return {
    gridParticipants: props.isScreenShareActive
      ? []
      : pinnedParticipants.length > 0
      ? pinnedParticipants
      : floatingLocalVideoLayout.gridParticipants,
    horizontalGalleryParticipants: props.isScreenShareActive
      ? pinnedParticipants.concat(floatingLocalVideoLayout.horizontalGalleryParticipants)
      : pinnedParticipants.length > 0
      ? floatingLocalVideoLayout.gridParticipants.concat(floatingLocalVideoLayout.horizontalGalleryParticipants)
      : floatingLocalVideoLayout.horizontalGalleryParticipants
  };
};
