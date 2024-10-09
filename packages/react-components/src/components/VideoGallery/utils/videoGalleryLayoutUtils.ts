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

  const callingParticipants = remoteParticipants.filter((p) => p.state === ('Connecting' || 'Ringing'));

  const callingParticipantsSet = new Set(callingParticipants.map((p) => p.userId));

  const connectedParticipants = remoteParticipants.filter((p) => !callingParticipantsSet.has(p.userId));

  const remoteParticipantsOrdered = putVideoParticipantsFirst(connectedParticipants);
  const videoParticipants = remoteParticipants.filter((p) => p.videoStream?.isAvailable);
  const participantsForGrid =
    layout === 'floatingLocalVideo' && videoParticipants.length > 0 ? videoParticipants : remoteParticipantsOrdered;

  let newGridParticipants = smartDominantSpeakerParticipants({
    participants: participantsForGrid,
    dominantSpeakers,
    currentParticipants: previousGridParticipants,
    maxDominantSpeakers: maxGridParticipants
  }).slice(0, maxGridParticipants);

  if (layout === 'speaker') {
    if (dominantSpeakers?.[0]) {
      newGridParticipants = newGridParticipants.filter((p) => p.userId === dominantSpeakers[0]);
    } else {
      newGridParticipants = newGridParticipants.slice(1);
    }
  }

  const gridParticipantSet = new Set(newGridParticipants.map((p) => p.userId));

  const newOverflowGalleryParticipants = smartDominantSpeakerParticipants({
    participants: remoteParticipantsOrdered.filter((p) => !gridParticipantSet.has(p.userId)),
    dominantSpeakers: dominantSpeakers,
    currentParticipants: previousOverflowParticipants,
    maxDominantSpeakers: maxOverflowGalleryDominantSpeakers
  });

  let gridParticipants = newGridParticipants;
  let overflowGalleryParticipants = newOverflowGalleryParticipants;
  if (gridParticipants.length + callingParticipants.length <= maxGridParticipants) {
    gridParticipants = gridParticipants.concat(callingParticipants);
  } else {
    overflowGalleryParticipants = overflowGalleryParticipants.concat(callingParticipants);
  }

  return { gridParticipants, overflowGalleryParticipants };
};

/**
 * Hook to determine which participants should be in grid and overflow gallery and their order respectively
 * @private
 */
export const useOrganizedParticipants = (props: OrganizedParticipantsArgs): OrganizedParticipantsResult => {
  const spotlightedParticipantUserIds = props.spotlightedParticipantUserIds ?? [];
  const pinnedParticipantUserIds = props.pinnedParticipantUserIds ?? [];

  // Focussed participants are the participants that are either spotlighted or pinned. Ordered by spotlighted first and then pinned.
  // A set is used to dedupe participants.
  const focusedParticipantUserIdSet = new Set(spotlightedParticipantUserIds.concat(pinnedParticipantUserIds));
  const focusedParticipants: VideoGalleryRemoteParticipant[] = [...focusedParticipantUserIdSet]
    .map((userId) => props.remoteParticipants.find((p) => p.userId === userId))
    .filter((p) => p !== undefined) as VideoGalleryRemoteParticipant[];

  // Unfocused participants are the rest of the participants
  const unfocusedParticipants = props.remoteParticipants.filter((p) => !focusedParticipantUserIdSet.has(p.userId));

  const currentGridParticipants = useRef<VideoGalleryRemoteParticipant[]>([]);
  const currentOverflowGalleryParticipants = useRef<VideoGalleryRemoteParticipant[]>([]);

  const organizedParticipantsArgs: OrganizedParticipantsArgs = {
    ...props,
    // if there are focused participants then leave no room in the grid by setting maxGridParticipants to 0
    maxGridParticipants: focusedParticipants.length > 0 || props.isScreenShareActive ? 0 : props.maxGridParticipants,
    remoteParticipants: unfocusedParticipants,
    previousGridParticipants: currentGridParticipants.current,
    previousOverflowParticipants: currentOverflowGalleryParticipants.current
  };

  const organizedParticipants = getOrganizedParticipants(organizedParticipantsArgs);

  currentGridParticipants.current = organizedParticipants.gridParticipants;
  currentOverflowGalleryParticipants.current = organizedParticipants.overflowGalleryParticipants;

  return focusedParticipants.length > 0
    ? {
        gridParticipants: props.isScreenShareActive ? [] : focusedParticipants,
        overflowGalleryParticipants: props.isScreenShareActive
          ? focusedParticipants.concat(organizedParticipants.overflowGalleryParticipants)
          : organizedParticipants.overflowGalleryParticipants
      }
    : organizedParticipants;
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
export const renderTiles = (
  gridParticipants: VideoGalleryParticipant[],
  onRenderRemoteParticipant: (participant: VideoGalleryRemoteParticipant, isVideoParticipant?: boolean) => JSX.Element,
  maxRemoteVideoStreams: number,
  indexesToRender: number[],
  overflowGalleryParticipants: VideoGalleryParticipant[],
  dominantSpeakers?: string[]
): { gridTiles: JSX.Element[]; overflowGalleryTiles: JSX.Element[] } => {
  const _dominantSpeakers = dominantSpeakers ?? [];
  let streamsLeftToRender = maxRemoteVideoStreams;

  // Render the grid participants
  const participantWithStreamsToRenderInGrid = gridParticipants.filter((p) => p?.videoStream?.isAvailable);
  const dominantSpeakerWithStreamsToRenderInGrid = _dominantSpeakers
    .filter((userId) => participantWithStreamsToRenderInGrid.find((p) => p?.userId === userId))
    .slice(0, streamsLeftToRender);
  streamsLeftToRender = streamsLeftToRender - dominantSpeakerWithStreamsToRenderInGrid.length;
  const gridTiles = gridParticipants.map((p) => {
    return onRenderRemoteParticipant(
      p,
      dominantSpeakerWithStreamsToRenderInGrid.includes(p.userId) ||
        (p.videoStream?.isAvailable && streamsLeftToRender-- > 0)
    );
  });

  // Render the overflow participants
  const participantWithStreamsToRenderInOverflow = indexesToRender
    .map((i) => {
      return overflowGalleryParticipants.at(i);
    })
    .filter((p) => p?.videoStream?.isAvailable);
  const dominantSpeakerWithStreamsToRenderInOverflow = _dominantSpeakers
    .filter((userId) => participantWithStreamsToRenderInOverflow.find((p) => p?.userId === userId))
    .slice(0, streamsLeftToRender);
  streamsLeftToRender = streamsLeftToRender - dominantSpeakerWithStreamsToRenderInOverflow.length;
  const overflowGalleryTiles = overflowGalleryParticipants.map((p) => {
    return onRenderRemoteParticipant(
      p,
      dominantSpeakerWithStreamsToRenderInOverflow.includes(p.userId) ||
        (p.videoStream?.isAvailable && streamsLeftToRender-- > 0)
    );
  });

  return { gridTiles, overflowGalleryTiles };
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
