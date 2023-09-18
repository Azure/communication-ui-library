// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useCallback, useRef } from 'react';
import { smartDominantSpeakerParticipants } from '../../../gallery';
import { VideoGalleryParticipant, VideoGalleryRemoteParticipant } from '../../../types';
/* @conditional-compile-remove(gallery-layouts) */
import { VideoGalleryLayout } from '../../VideoGallery';

/**
 * Arguments used to determine a {@link OrganizedParticipantsResult}
 * @private
 */
export interface OrganizedParticipantsArgs {
  remoteParticipants: VideoGalleryRemoteParticipant[];
  localParticipant?: VideoGalleryParticipant;
  dominantSpeakers?: string[];
  maxRemoteVideoStreams?: number;
  maxOverflowGalleryDominantSpeakers?: number;
  isScreenShareActive?: boolean;
  pinnedParticipantUserIds?: string[];
  /* @conditional-compile-remove(gallery-layouts) */
  layout?: VideoGalleryLayout;
}

/**
 * A result that defines grid participants and overflow gallery participants in the VideoGallery
 * @private
 */
export interface OrganizedParticipantsResult {
  gridParticipants: VideoGalleryParticipant[];
  overflowGalleryParticipants: VideoGalleryParticipant[];
}

const DEFAULT_MAX_OVERFLOW_GALLERY_DOMINANT_SPEAKERS = 6;

const LARGE_GALLERY_MAX_GRID_PARTICIPANTS = 48;

const _useOrganizedParticipants = (props: OrganizedParticipantsArgs): OrganizedParticipantsResult => {
  const visibleGridParticipants = useRef<VideoGalleryRemoteParticipant[]>([]);
  const visibleOverflowGalleryParticipants = useRef<VideoGalleryRemoteParticipant[]>([]);

  const {
    remoteParticipants = [],
    localParticipant,
    dominantSpeakers = [],
    maxRemoteVideoStreams,
    maxOverflowGalleryDominantSpeakers = DEFAULT_MAX_OVERFLOW_GALLERY_DOMINANT_SPEAKERS,
    isScreenShareActive = false,
    pinnedParticipantUserIds = [],
    /* @conditional-compile-remove(gallery-layouts) */
    layout
  } = props;

  const videoParticipants = remoteParticipants.filter((p) => p.videoStream?.isAvailable);

  const participantsToSortTrampoline = (): VideoGalleryRemoteParticipant[] => {
    /* @conditional-compile-remove(gallery-layouts) */
    return layout !== 'speaker' && layout !== 'largeGallery'
      ? videoParticipants
      : putVideoParticipantsFirst(remoteParticipants);
    return videoParticipants;
  };

  visibleGridParticipants.current =
    pinnedParticipantUserIds.length > 0 || isScreenShareActive
      ? []
      : smartDominantSpeakerParticipants({
          participants: participantsToSortTrampoline(),
          dominantSpeakers,
          lastVisibleParticipants: visibleGridParticipants.current,
          maxDominantSpeakers:
            layout !== 'largeGallery' ? (maxRemoteVideoStreams as number) : LARGE_GALLERY_MAX_GRID_PARTICIPANTS
        }).slice(
          0,
          layout !== 'largeGallery' ? (maxRemoteVideoStreams as number) : LARGE_GALLERY_MAX_GRID_PARTICIPANTS
        );

  /* @conditional-compile-remove(gallery-layouts) */
  const dominantSpeakerToGrid =
    layout === 'speaker'
      ? dominantSpeakers && dominantSpeakers[0]
        ? visibleGridParticipants.current.filter((p) => p.userId === dominantSpeakers[0])
        : [visibleGridParticipants.current[0]]
      : [];
  /* @conditional-compile-remove(gallery-layouts) */
  if (dominantSpeakerToGrid[0]) {
    visibleGridParticipants.current = dominantSpeakerToGrid;
  }

  const visibleGridParticipantsSet = new Set(visibleGridParticipants.current.map((p) => p.userId));

  const remoteParticipantsOrdered = putVideoParticipantsFirst(remoteParticipants);

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const callingParticipants = remoteParticipantsOrdered.filter((p) => p.state === ('Connecting' || 'Ringing'));
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const callingParticipantsSet = new Set(callingParticipants.map((p) => p.userId));

  visibleOverflowGalleryParticipants.current = smartDominantSpeakerParticipants({
    participants: remoteParticipantsOrdered.filter(
      (p) =>
        !visibleGridParticipantsSet.has(p.userId) &&
        /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ !callingParticipantsSet.has(
          p.userId
        )
    ),
    dominantSpeakers: dominantSpeakers,
    lastVisibleParticipants: visibleOverflowGalleryParticipants.current,
    maxDominantSpeakers: maxOverflowGalleryDominantSpeakers
  });

  const getGridParticipants = useCallback((): VideoGalleryRemoteParticipant[] => {
    if (isScreenShareActive) {
      return [];
    }

    /* @conditional-compile-remove(gallery-layouts) */
    if (layout === 'largeGallery') {
      return visibleGridParticipants.current.length > 0
        ? visibleGridParticipants.current
        : visibleOverflowGalleryParticipants.current.length > (LARGE_GALLERY_MAX_GRID_PARTICIPANTS as number)
        ? visibleOverflowGalleryParticipants.current.slice(0, LARGE_GALLERY_MAX_GRID_PARTICIPANTS as number)
        : visibleOverflowGalleryParticipants.current
            .slice(0, LARGE_GALLERY_MAX_GRID_PARTICIPANTS as number)
            .concat(callingParticipants);
    }

    // if we have no video participants we need to cap the max number of audio participants in the grid
    // we will use the max streams provided to the function to find the max participants that can go in the grid
    // if there are less participants than max streams then we will use all participants including joining in the grid
    /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
    return visibleGridParticipants.current.length > 0
      ? visibleGridParticipants.current
      : visibleOverflowGalleryParticipants.current.length > (maxRemoteVideoStreams as number)
      ? visibleOverflowGalleryParticipants.current.slice(0, maxRemoteVideoStreams as number)
      : visibleOverflowGalleryParticipants.current
          .slice(0, maxRemoteVideoStreams as number)
          .concat(callingParticipants);
    return visibleGridParticipants.current.length > 0
      ? visibleGridParticipants.current
      : visibleOverflowGalleryParticipants.current.slice(0, maxRemoteVideoStreams as number);
  }, [
    /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ callingParticipants,
    isScreenShareActive,
    maxRemoteVideoStreams,
    /* @conditional-compile-remove(gallery-layouts) */
    layout
  ]);

  const gridParticipants = getGridParticipants();

  const getOverflowGalleryRemoteParticipants = useCallback((): (
    | VideoGalleryParticipant
    | VideoGalleryRemoteParticipant
  )[] => {
    if (isScreenShareActive && localParticipant) {
      const localParticipantPlusOverflow = [localParticipant].concat(
        visibleGridParticipants.current.concat(visibleOverflowGalleryParticipants.current)
      );
      // If screen sharing is active, assign video and audio participants as overflow gallery participants
      /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
      return localParticipantPlusOverflow.concat(callingParticipants);
      return localParticipantPlusOverflow;
    } else if (isScreenShareActive) {
      // If screen sharing is active, assign video and audio participants as overflow gallery participants
      /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
      return visibleGridParticipants.current.concat(
        visibleOverflowGalleryParticipants.current.concat(callingParticipants)
      );
      return visibleGridParticipants.current.concat(visibleOverflowGalleryParticipants.current);
    } else {
      /* @conditional-compile-remove(gallery-layouts) */
      if (layout === 'largeGallery') {
        return visibleGridParticipants.current.length > 0
          ? visibleOverflowGalleryParticipants.current.concat(callingParticipants)
          : visibleOverflowGalleryParticipants.current.length > (LARGE_GALLERY_MAX_GRID_PARTICIPANTS as number)
          ? visibleOverflowGalleryParticipants.current
              .slice(LARGE_GALLERY_MAX_GRID_PARTICIPANTS as number)
              .concat(callingParticipants)
          : [];
      }
      // If screen sharing is not active, then assign all video tiles as grid tiles.
      // If there are no video tiles, then assign audio tiles as grid tiles.
      // if there are more overflow tiles than max streams then find the tiles that don't fit in the grid and put them in overflow
      // overflow should be empty if total participants including calling participants is less than max streams
      /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
      return visibleGridParticipants.current.length > 0
        ? visibleOverflowGalleryParticipants.current.concat(callingParticipants)
        : visibleOverflowGalleryParticipants.current.length > (maxRemoteVideoStreams as number)
        ? visibleOverflowGalleryParticipants.current.slice(maxRemoteVideoStreams as number).concat(callingParticipants)
        : [];
      return visibleGridParticipants.current.length > 0
        ? visibleOverflowGalleryParticipants.current
        : visibleOverflowGalleryParticipants.current.slice(maxRemoteVideoStreams as number);
    }
  }, [
    /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ callingParticipants,
    isScreenShareActive,
    localParticipant,
    maxRemoteVideoStreams,
    /* @conditional-compile-remove(gallery-layouts) */
    layout
  ]);

  const overflowGalleryParticipants = getOverflowGalleryRemoteParticipants();

  return { gridParticipants, overflowGalleryParticipants: overflowGalleryParticipants };
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

  // get pinned participants in the same order of pinned participant user ids using remoteParticipantMap
  const pinnedParticipants: VideoGalleryRemoteParticipant[] = [];
  props.pinnedParticipantUserIds?.forEach((id) => {
    const pinnedParticipant = remoteParticipantMap[id];
    if (pinnedParticipant) {
      pinnedParticipants.push(pinnedParticipant);
    }
  });

  // get unpinned participants by filtering all remote participants using a set of pinned participant user ids
  const pinnedParticipantUserIdSet = new Set(props.pinnedParticipantUserIds);
  const unpinnedParticipants = props.remoteParticipants.filter((p) => !pinnedParticipantUserIdSet.has(p.userId));

  const useOrganizedParticipantsProps = {
    ...props,
    // if there are pinned participants then we should only consider unpinned participants
    remoteParticipants: unpinnedParticipants
  };

  const useOrganizedParticipantsResult = _useOrganizedParticipants(useOrganizedParticipantsProps);

  if (pinnedParticipants.length === 0) {
    return useOrganizedParticipantsResult;
  }

  return {
    gridParticipants: props.isScreenShareActive ? [] : pinnedParticipants,
    overflowGalleryParticipants: props.isScreenShareActive
      ? pinnedParticipants.concat(useOrganizedParticipantsResult.overflowGalleryParticipants)
      : useOrganizedParticipantsResult.gridParticipants.concat(
          useOrganizedParticipantsResult.overflowGalleryParticipants
        )
  };
};

const putVideoParticipantsFirst = (
  remoteParticipants: VideoGalleryRemoteParticipant[]
): VideoGalleryRemoteParticipant[] => {
  const videoParticipants: VideoGalleryRemoteParticipant[] = [];
  const audioParticipants: VideoGalleryRemoteParticipant[] = [];
  remoteParticipants.forEach((p) => {
    if (p.videoStream?.isAvailable) {
      videoParticipants.push(p);
    } else {
      audioParticipants.push(p);
    }
  });
  const remoteParticipantSortedByVideo = videoParticipants.concat(audioParticipants);
  return remoteParticipantSortedByVideo;
};

/**
 * Hook to determine which participants should be in grid and overflow gallery and their order respectively
 * @private
 */
export const useOrganizedParticipants = (args: OrganizedParticipantsArgs): OrganizedParticipantsResult => {
  /* @conditional-compile-remove(pinned-participants) */
  return _useOrganizedParticipantsWithPinnedParticipants(args);
  return _useOrganizedParticipants(args);
};
