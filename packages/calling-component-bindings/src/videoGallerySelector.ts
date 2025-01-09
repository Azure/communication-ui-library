// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { CallClientState, RemoteParticipantState } from '@internal/calling-stateful-client';
import { VideoGalleryRemoteParticipant, VideoGalleryLocalParticipant } from '@internal/react-components';
/* @conditional-compile-remove(together-mode) */
import {
  VideoGalleryTogetherModeStreams,
  VideoGalleryTogetherModeParticipantPosition
} from '@internal/react-components';
import { createSelector } from 'reselect';
import {
  CallingBaseSelectorProps,
  getDisplayName,
  getDominantSpeakers,
  getIdentifier,
  getIsMuted,
  getIsScreenSharingOn,
  getLocalVideoStreams,
  getRole,
  getScreenShareRemoteParticipant
} from './baseSelectors';
/* @conditional-compile-remove(together-mode) */
import { getTogetherModeCallFeature } from './baseSelectors';
import { isHideAttendeeNamesEnabled } from './baseSelectors';
import { getOptimalVideoCount } from './baseSelectors';
import { _updateUserDisplayNames } from './utils/callUtils';
import { checkIsSpeaking } from './utils/SelectorUtils';
import {
  _videoGalleryRemoteParticipantsMemo,
  _dominantSpeakersWithFlatId,
  convertRemoteParticipantToVideoGalleryRemoteParticipant,
  memoizeLocalParticipant,
  /* @conditional-compile-remove(together-mode) */ memoizeTogetherModeStreams
} from './utils/videoGalleryUtils';
import { memoizeSpotlightedParticipantIds } from './utils/videoGalleryUtils';
import { getLocalParticipantRaisedHand } from './baseSelectors';
import { getLocalParticipantReactionState } from './baseSelectors';
import { memoizedConvertToVideoTileReaction } from './utils/participantListSelectorUtils';
import { getRemoteParticipantsExcludingConsumers } from './getRemoteParticipantsExcludingConsumers';
import { getSpotlightCallFeature, getCapabilities } from './baseSelectors';

/**
 * Selector type for {@link VideoGallery} component.
 *
 * @public
 */
export type VideoGallerySelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  screenShareParticipant?: VideoGalleryRemoteParticipant;
  localParticipant: VideoGalleryLocalParticipant;
  remoteParticipants: VideoGalleryRemoteParticipant[];
  dominantSpeakers?: string[];
  optimalVideoCount?: number;
  spotlightedParticipants?: string[];
  maxParticipantsToSpotlight?: number;
  /* @conditional-compile-remove(together-mode) */
  isTogetherModeActive?: boolean;
  /* @conditional-compile-remove(together-mode) */
  startTogetherModeEnabled?: boolean;
  /* @conditional-compile-remove(together-mode) */
  togetherModeStreams?: VideoGalleryTogetherModeStreams;
  /* @conditional-compile-remove(together-mode) */
  togetherModeSeatingCoordinates?: VideoGalleryTogetherModeParticipantPosition;
};

/**
 * Provides data attributes to {@link VideoGallery} component.
 * @public
 */
export const videoGallerySelector: VideoGallerySelector = createSelector(
  [
    getScreenShareRemoteParticipant,
    getRemoteParticipantsExcludingConsumers,
    getLocalVideoStreams,
    getIsMuted,
    getIsScreenSharingOn,
    getDisplayName,
    getIdentifier,
    getDominantSpeakers,
    getOptimalVideoCount,
    getRole,
    getLocalParticipantRaisedHand,
    isHideAttendeeNamesEnabled,
    getLocalParticipantReactionState,
    getSpotlightCallFeature,
    getCapabilities,
    /* @conditional-compile-remove(together-mode) */
    getTogetherModeCallFeature
  ],
  (
    screenShareRemoteParticipantId,
    remoteParticipants,
    localVideoStreams,
    isMuted,
    isScreenSharingOn,
    displayName: string | undefined,
    identifier: string,
    dominantSpeakers,
    optimalVideoCount,
    role,
    raisedHand,
    isHideAttendeeNamesEnabled,
    localParticipantReaction,
    spotlightCallFeature,
    capabilities,
    /* @conditional-compile-remove(together-mode) */
    togetherModeCallFeature
  ) => {
    const screenShareRemoteParticipant =
      screenShareRemoteParticipantId && remoteParticipants
        ? remoteParticipants[screenShareRemoteParticipantId]
        : undefined;
    const localVideoStream = localVideoStreams?.find((i) => i.mediaStreamType === 'Video');
    const localScreenSharingStream = localVideoStreams?.find((i) => i.mediaStreamType === 'ScreenSharing');
    const dominantSpeakerIds = _dominantSpeakersWithFlatId(dominantSpeakers);
    const dominantSpeakersMap: Record<string, number> = {};
    dominantSpeakerIds?.forEach((speaker, idx) => (dominantSpeakersMap[speaker] = idx));
    const noRemoteParticipants: RemoteParticipantState[] = [];
    const localParticipantReactionState = memoizedConvertToVideoTileReaction(localParticipantReaction);
    const spotlightedParticipantIds = memoizeSpotlightedParticipantIds(spotlightCallFeature?.spotlightedParticipants);
    return {
      screenShareParticipant: screenShareRemoteParticipant
        ? convertRemoteParticipantToVideoGalleryRemoteParticipant(
            toFlatCommunicationIdentifier(screenShareRemoteParticipant.identifier),
            screenShareRemoteParticipant.isMuted,
            checkIsSpeaking(screenShareRemoteParticipant),
            screenShareRemoteParticipant.videoStreams,
            screenShareRemoteParticipant.state,
            screenShareRemoteParticipant.displayName,
            screenShareRemoteParticipant.raisedHand,
            screenShareRemoteParticipant.contentSharingStream,
            undefined,
            screenShareRemoteParticipant.spotlight,
            /* @conditional-compile-remove(media-access) */
            undefined,
            /* @conditional-compile-remove(media-access) */
            screenShareRemoteParticipant.mediaAccess,
            /* @conditional-compile-remove(media-access) */
            role
          )
        : undefined,
      localParticipant: memoizeLocalParticipant(
        identifier,
        displayName,
        isMuted,
        isScreenSharingOn,
        localVideoStream,
        localScreenSharingStream,
        role,
        raisedHand,
        localParticipantReactionState,
        spotlightCallFeature?.localParticipantSpotlight,
        capabilities
      ),
      remoteParticipants: _videoGalleryRemoteParticipantsMemo(
        _updateUserDisplayNames(remoteParticipants ? Object.values(remoteParticipants) : noRemoteParticipants),
        isHideAttendeeNamesEnabled,
        role
      ),
      dominantSpeakers: dominantSpeakerIds,
      maxRemoteVideoStreams: optimalVideoCount,
      spotlightedParticipants: spotlightedParticipantIds,
      maxParticipantsToSpotlight: spotlightCallFeature?.maxParticipantsToSpotlight,
      /* @conditional-compile-remove(together-mode) */
      togetherModeStreams: memoizeTogetherModeStreams(togetherModeCallFeature?.streams),
      /* @conditional-compile-remove(together-mode) */
      togetherModeSeatingCoordinates: togetherModeCallFeature?.seatingPositions,
      /* @conditional-compile-remove(together-mode) */
      isTogetherModeActive: togetherModeCallFeature?.isActive,
      /* @conditional-compile-remove(together-mode) */
      startTogetherModeEnabled: capabilities?.startTogetherMode.isPresent
    };
  }
);
