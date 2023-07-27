// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { CallClientState, RemoteParticipantState } from '@internal/calling-stateful-client';
import { VideoGalleryLocalParticipant, VideoGalleryRemoteParticipant } from '@internal/react-components';
import { createSelector } from 'reselect';
import {
  CallingBaseSelectorProps,
  getDisplayName,
  getDominantSpeakers,
  getIdentifier,
  getIsMuted,
  getIsScreenSharingOn,
  getLocalVideoStreams,
  getRemoteParticipants,
  getScreenShareRemoteParticipant
} from './baseSelectors';
/* @conditional-compile-remove(optimal-video-count) */
import { getOptimalVideoCount } from './baseSelectors';
/* @conditional-compile-remove(raise-hand) */
import { getLocalParticipantRaisedHand } from './baseSelectors';
import { _updateUserDisplayNames } from './utils/callUtils';
import { checkIsSpeaking } from './utils/SelectorUtils';
import {
  _videoGalleryRemoteParticipantsMemo,
  _dominantSpeakersWithFlatId,
  convertRemoteParticipantToVideoGalleryRemoteParticipant,
  memoizeLocalParticipant
} from './utils/videoGalleryUtils';

/* @conditional-compile-remove(raise-hand) */
import { convertRemoteParticipantToVideoGalleryRemoteParticipantBeta } from './utils/videoGalleryUtils';

/**
 * Selector type for {@link VideoGallery} component.
 *
 * @public
 */
export type VideoGallerySelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  screenShareParticipant: VideoGalleryRemoteParticipant | undefined;
  localParticipant: VideoGalleryLocalParticipant;
  remoteParticipants: VideoGalleryRemoteParticipant[];
  dominantSpeakers?: string[];
  /* @conditional-compile-remove(optimal-video-count) */
  optimalVideoCount?: number;
};

/**
 * Provides data attributes to {@link VideoGallery} component.
 * @public
 */
export const videoGallerySelector: VideoGallerySelector = createSelector(
  [
    getScreenShareRemoteParticipant,
    getRemoteParticipants,
    getLocalVideoStreams,
    getIsMuted,
    getIsScreenSharingOn,
    getDisplayName,
    getIdentifier,
    getDominantSpeakers,
    /* @conditional-compile-remove(optimal-video-count) */
    getOptimalVideoCount,
    /* @conditional-compile-remove(raise-hand) */
    getLocalParticipantRaisedHand
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
    /* @conditional-compile-remove(optimal-video-count) */
    optimalVideoCount,
    /* @conditional-compile-remove(raise-hand) */
    raisedHand
  ) => {
    const screenShareRemoteParticipant =
      screenShareRemoteParticipantId && remoteParticipants
        ? remoteParticipants[screenShareRemoteParticipantId]
        : undefined;
    const localVideoStream = localVideoStreams?.find((i) => i.mediaStreamType === 'Video');

    const dominantSpeakerIds = _dominantSpeakersWithFlatId(dominantSpeakers);
    const dominantSpeakersMap: Record<string, number> = {};
    dominantSpeakerIds?.forEach((speaker, idx) => (dominantSpeakersMap[speaker] = idx));
    const noRemoteParticipants = [];
    let convert = convertRemoteParticipantToVideoGalleryRemoteParticipant as any;
    /* @conditional-compile-remove(raise-hand) */
    convert = convertRemoteParticipantToVideoGalleryRemoteParticipantBeta;
    return {
      screenShareParticipant: screenShareRemoteParticipant
        ? convert(
            toFlatCommunicationIdentifier(screenShareRemoteParticipant.identifier),
            screenShareRemoteParticipant.isMuted,
            checkIsSpeaking(screenShareRemoteParticipant),
            /* @conditional-compile-remove(raise-hand) */
            screenShareRemoteParticipant.raisedHand,
            screenShareRemoteParticipant.videoStreams,
            screenShareRemoteParticipant.state,
            screenShareRemoteParticipant.displayName
          )
        : undefined,
      localParticipant: memoizeLocalParticipant(
        identifier,
        displayName,
        isMuted,
        isScreenSharingOn,
        localVideoStream,
        /* @conditional-compile-remove(raise-hand) */
        raisedHand
      ),
      remoteParticipants: _videoGalleryRemoteParticipantsMemo(
        updateUserDisplayNamesTrampoline(remoteParticipants ? Object.values(remoteParticipants) : noRemoteParticipants)
      ),
      dominantSpeakers: dominantSpeakerIds,
      /* @conditional-compile-remove(optimal-video-count) */
      maxRemoteVideoStreams: optimalVideoCount
    };
  }
);

const updateUserDisplayNamesTrampoline = (remoteParticipants: RemoteParticipantState[]): RemoteParticipantState[] => {
  /* @conditional-compile-remove(PSTN-calls) */
  return _updateUserDisplayNames(remoteParticipants);
  return remoteParticipants;
};
