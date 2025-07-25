// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { CallClientState, RemoteParticipantState } from '@internal/calling-stateful-client';
import { VideoGalleryRemoteParticipant, VideoGalleryLocalParticipant } from '@internal/react-components';

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
  getRealTimeText,
  getRole,
  getScreenShareRemoteParticipant
} from './baseSelectors';
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
  memoizeTogetherModeStreams,
  memoizeTogetherModeSeatingPositions
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
  isTogetherModeActive?: boolean;
  startTogetherModeEnabled?: boolean;
  togetherModeStreams?: VideoGalleryTogetherModeStreams;
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
    getTogetherModeCallFeature,
    getRealTimeText
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
    togetherModeCallFeature,
    realTimeText
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
    const inProgressRealTimeTextParticipantsIds = realTimeText?.currentInProgress
      ? realTimeText.currentInProgress.map((info) => toFlatCommunicationIdentifier(info.sender.identifier))
      : undefined;
    return {
      screenShareParticipant: screenShareRemoteParticipant
        ? convertRemoteParticipantToVideoGalleryRemoteParticipant(
            toFlatCommunicationIdentifier(screenShareRemoteParticipant.identifier),
            screenShareRemoteParticipant.isMuted,
            checkIsSpeaking(screenShareRemoteParticipant, inProgressRealTimeTextParticipantsIds),
            screenShareRemoteParticipant.videoStreams,
            screenShareRemoteParticipant.state,
            screenShareRemoteParticipant.displayName,
            screenShareRemoteParticipant.raisedHand,
            screenShareRemoteParticipant.contentSharingStream,
            undefined,
            screenShareRemoteParticipant.spotlight,
            undefined,
            screenShareRemoteParticipant.mediaAccess,
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
        role,
        inProgressRealTimeTextParticipantsIds
      ),
      dominantSpeakers: dominantSpeakerIds,
      maxRemoteVideoStreams: optimalVideoCount,
      spotlightedParticipants: spotlightedParticipantIds,
      maxParticipantsToSpotlight: spotlightCallFeature?.maxParticipantsToSpotlight,
      togetherModeStreams: memoizeTogetherModeStreams(togetherModeCallFeature?.streams),
      togetherModeSeatingCoordinates: memoizeTogetherModeSeatingPositions(togetherModeCallFeature?.seatingPositions),
      isTogetherModeActive: togetherModeCallFeature?.isActive,
      startTogetherModeEnabled: capabilities?.startTogetherMode.isPresent
    };
  }
);
