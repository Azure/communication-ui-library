// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useRef } from 'react';
import { smartDominantSpeakerParticipants } from '../../../gallery';
import { VideoGalleryParticipant, VideoGalleryRemoteParticipant } from '../../../types';
import { ReactionResources } from '../../..';
import { VideoGalleryLayout } from '../../VideoGallery';

/**
 * Arguments used to determine a {@link OrganizedParticipantsResult}
 * @private
 */
export interface OrganizedParticipantsArgs {
  remoteParticipants: VideoGalleryRemoteParticipant[];
  localParticipant?: VideoGalleryParticipant;
  dominantSpeakers?: string[];
  maxGridParticipants?: number;
  maxOverflowGalleryDominantSpeakers?: number;
  isScreenShareActive?: boolean;
  pinnedParticipantUserIds?: string[];
  layout?: VideoGalleryLayout;
  spotlightedParticipantUserIds?: string[];
  previousGridParticipants?: VideoGalleryRemoteParticipant[];
  previousOverflowParticipants?: VideoGalleryRemoteParticipant[];
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
const DEFAULT_MAX_VIDEO_SREAMS = 4;
/**
 * @private
 */
export const MAX_GRID_PARTICIPANTS_NOT_LARGE_GALLERY = 9;

const getOrganizedParticipants = (props: OrganizedParticipantsArgs): OrganizedParticipantsResult => {
  const {
    remoteParticipants = [],
    dominantSpeakers = [],
    maxGridParticipants = DEFAULT_MAX_VIDEO_SREAMS,
    maxOverflowGalleryDominantSpeakers = DEFAULT_MAX_OVERFLOW_GALLERY_DOMINANT_SPEAKERS,
    layout,
    previousGridParticipants = [],
    previousOverflowParticipants = []
  } = props;

  const remoteParticipantsOrdered = putVideoParticipantsFirst(remoteParticipants);
  const videoParticipants = remoteParticipants.filter((p) => p.videoStream?.isAvailable);
  const participants =
    layout === 'floatingLocalVideo' && videoParticipants.length > 0 ? videoParticipants : remoteParticipantsOrdered;

  let newGridParticipants = smartDominantSpeakerParticipants({
    participants: participants,
    dominantSpeakers,
    currentParticipants: previousGridParticipants,
    maxDominantSpeakers: maxGridParticipants
  }).slice(0, maxGridParticipants);

  const dominantSpeakerToGrid =
    layout === 'speaker'
      ? dominantSpeakers && dominantSpeakers[0]
        ? newGridParticipants.filter((p) => p.userId === dominantSpeakers[0])
        : [newGridParticipants[0]]
      : [];

  if (dominantSpeakerToGrid[0]) {
    newGridParticipants = dominantSpeakerToGrid;
  }

  const gridParticipantSet = new Set(newGridParticipants.map((p) => p.userId));

  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const callingParticipants = remoteParticipantsOrdered.filter((p) => p.state === ('Connecting' || 'Ringing'));
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const callingParticipantsSet = new Set(callingParticipants.map((p) => p.userId));

  const newOverflowGalleryParticipants = smartDominantSpeakerParticipants({
    participants: remoteParticipantsOrdered.filter(
      (p) =>
        !gridParticipantSet.has(p.userId) &&
        /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ !callingParticipantsSet.has(
          p.userId
        )
    ),
    dominantSpeakers: dominantSpeakers,
    currentParticipants: previousOverflowParticipants,
    maxDominantSpeakers: maxOverflowGalleryDominantSpeakers
  });

  let gridParticipants = newGridParticipants;
  let overflowGalleryParticipants = newOverflowGalleryParticipants;
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  if (gridParticipants.length + callingParticipants.length <= maxGridParticipants) {
    gridParticipants = gridParticipants.concat(callingParticipants);
  } else {
    overflowGalleryParticipants = overflowGalleryParticipants.concat(callingParticipants);
  }

  return { gridParticipants, overflowGalleryParticipants };
};

interface SortedRemoteParticipants {
  [key: string]: VideoGalleryRemoteParticipant;
}

/**
 * Hook to determine which participants should be in grid and overflow gallery and their order respectively
 * @private
 */
export const useOrganizedParticipants = (props: OrganizedParticipantsArgs): OrganizedParticipantsResult => {
  // map remote participants by userId
  const remoteParticipantMap = props.remoteParticipants.reduce((map, remoteParticipant) => {
    map[remoteParticipant.userId] = remoteParticipant;
    return map;
  }, {} as SortedRemoteParticipants);

  const spotlightedParticipantUserIds = props.spotlightedParticipantUserIds ?? [];
  const pinnedParticipantUserIds = props.pinnedParticipantUserIds ?? [];
  // declare set of focused participant user ids as spotlighted participants user ids followed by
  // pinned participants user ids which is deduplicated while maintaining order
  const focusedParticipantUserIdSet = new Set(
    spotlightedParticipantUserIds.concat(pinnedParticipantUserIds).filter((p) => remoteParticipantMap[p])
  );
  // get focused participants from map of remote participants in the order of the user ids
  const focusedParticipants: VideoGalleryRemoteParticipant[] = [...focusedParticipantUserIdSet].map(
    (p) => remoteParticipantMap[p]
  );

  const currentGridParticipants = useRef<VideoGalleryRemoteParticipant[]>([]);
  const currentOverflowGalleryParticipants = useRef<VideoGalleryRemoteParticipant[]>([]);

  const unfocusedParticipants = props.remoteParticipants.filter((p) => !focusedParticipantUserIdSet.has(p.userId));

  const useOrganizedParticipantsProps: OrganizedParticipantsArgs = {
    ...props,
    // if there are focused participants then leave no room in the grid by setting maxGridParticipants to 0
    maxGridParticipants: focusedParticipants.length > 0 || props.isScreenShareActive ? 0 : props.maxGridParticipants,
    remoteParticipants: unfocusedParticipants,
    previousGridParticipants: currentGridParticipants.current,
    previousOverflowParticipants: currentOverflowGalleryParticipants.current
  };

  const useOrganizedParticipantsResult = getOrganizedParticipants(useOrganizedParticipantsProps);

  currentGridParticipants.current = useOrganizedParticipantsResult.gridParticipants;
  currentOverflowGalleryParticipants.current = useOrganizedParticipantsResult.overflowGalleryParticipants;

  return focusedParticipants.length > 0
    ? {
        gridParticipants: props.isScreenShareActive ? [] : focusedParticipants,
        overflowGalleryParticipants: props.isScreenShareActive
          ? focusedParticipants.concat(useOrganizedParticipantsResult.overflowGalleryParticipants)
          : useOrganizedParticipantsResult.overflowGalleryParticipants
      }
    : useOrganizedParticipantsResult;
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
 * @private
 */
export const getEmojiResource = (reactionName: string, reactionResources: ReactionResources): string | undefined => {
  switch (reactionName) {
    case 'like':
      return reactionResources.likeReaction?.url;
    case 'heart':
      return reactionResources.heartReaction?.url;
    case 'laugh':
      return reactionResources.laughReaction?.url;
    case 'applause':
      return reactionResources.applauseReaction?.url;
    case 'surprised':
      return reactionResources.surprisedReaction?.url;
  }
  return undefined;
};

/**
 * @private
 */
export const getEmojiFrameCount = (reactionName: string, reactionResources: ReactionResources): number => {
  switch (reactionName) {
    case 'like':
      return reactionResources.likeReaction?.frameCount ?? 0;
    case 'heart':
      return reactionResources.heartReaction?.frameCount ?? 0;
    case 'laugh':
      return reactionResources.laughReaction?.frameCount ?? 0;
    case 'applause':
      return reactionResources.applauseReaction?.frameCount ?? 0;
    case 'surprised':
      return reactionResources.surprisedReaction?.frameCount ?? 0;
    default:
      return 0;
  }
};
