// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useCallback, useRef } from 'react';
import { smartDominantSpeakerParticipants } from '../../../gallery';
import { VideoGalleryParticipant, VideoGalleryRemoteParticipant } from '../../../types';

/**
 * Arguments used to determine a {@link OrganizedParticipantsResult}
 * @private
 */
export interface OrganizedParticipantsArgs {
  remoteParticipants: VideoGalleryRemoteParticipant[];
  dominantSpeakers?: string[];
  maxRemoteVideoStreams?: number;
  maxAudioDominantSpeakers?: number;
  isScreenShareActive?: boolean;
  /* @conditional-compile-remove(pinned-participants) */ pinnedParticipantUserIds?: string[];
}

/**
 * A result that defines grid participants and horizontal participants in the VideoGallery
 * @private
 */
export interface OrganizedParticipantsResult {
  gridParticipants: VideoGalleryParticipant[];
  horizontalGalleryParticipants: VideoGalleryParticipant[];
}

const DEFAULT_MAX_REMOTE_VIDEOSTREAMS = 4;

const DEFAULT_MAX_AUDIO_DOMINANT_SPEAKERS = 6;

const _useOrganizedParticipants = (props: OrganizedParticipantsArgs): OrganizedParticipantsResult => {
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

/* @conditional-compile-remove(pinned-participants) */
const _useOrganizedParticipantsWithPinnedParticipants = (
  props: OrganizedParticipantsArgs
): OrganizedParticipantsResult => {
  // map remote participants by userId
  const remoteParticipantMap = props.remoteParticipants.reduce((map, remoteParticipant) => {
    map[remoteParticipant.userId] = remoteParticipant;
    return map;
  }, {});

  // count pinned participants with video
  let pinnedParticipantsWithVideoOnCount = 0;

  // get pinned participants in the same order of pinned participant user ids using remoteParticipantMap
  const pinnedParticipants: VideoGalleryRemoteParticipant[] = [];
  props.pinnedParticipantUserIds?.forEach((id) => {
    const pinnedParticipant = remoteParticipantMap[id];
    if (pinnedParticipant) {
      pinnedParticipants.push(pinnedParticipant);
      if (pinnedParticipant.videoStream?.isAvailable) {
        pinnedParticipantsWithVideoOnCount++;
      }
    }
  });

  // get unpinned participants by filtering all remote participants using a set of pinned participant user ids
  const pinnedParticipantUserIdSet = new Set(props.pinnedParticipantUserIds);
  const unpinnedParticipants = props.remoteParticipants.filter((p) => !pinnedParticipantUserIdSet.has(p.userId));

  const useOrganizedParticipantsProps = {
    ...props,
    // if there are pinned participants then we should only consider unpinned participants
    remoteParticipants: unpinnedParticipants,
    // if there is a maximum of remote video streams we need to subtract pinned participants with video
    maxRemoteVideoStreams: props.maxRemoteVideoStreams
      ? props.maxRemoteVideoStreams - pinnedParticipantsWithVideoOnCount
      : undefined
  };

  const useOrganizedParticipantsResult = _useOrganizedParticipants(useOrganizedParticipantsProps);

  if (pinnedParticipants.length === 0) {
    return useOrganizedParticipantsResult;
  }

  return {
    gridParticipants: props.isScreenShareActive ? [] : pinnedParticipants,
    horizontalGalleryParticipants: props.isScreenShareActive
      ? pinnedParticipants.concat(useOrganizedParticipantsResult.horizontalGalleryParticipants)
      : useOrganizedParticipantsResult.gridParticipants.concat(
          useOrganizedParticipantsResult.horizontalGalleryParticipants
        )
  };
};

/**
 * Hook to determine which participants should be in grid and horizontal gallery and their order respectively
 * @private
 */
export const useOrganizedParticipants = (args: OrganizedParticipantsArgs): OrganizedParticipantsResult => {
  /* @conditional-compile-remove(pinned-participants) */
  return _useOrganizedParticipantsWithPinnedParticipants(args);
  return _useOrganizedParticipants(args);
};
