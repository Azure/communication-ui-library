// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { CallClientState } from '@internal/calling-stateful-client';
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
import { checkIsSpeaking } from './SelectorUtils';
import {
  _videoGalleryRemoteParticipantsMemo,
  _dominantSpeakersWithFlatId,
  convertRemoteParticipantToVideoGalleryRemoteParticipant
} from './videoGalleryUtils';

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
    getDominantSpeakers
  ],
  (
    screenShareRemoteParticipantId,
    remoteParticipants,
    localVideoStreams,
    isMuted,
    isScreenSharingOn,
    displayName: string | undefined,
    identifier: string,
    dominantSpeakers
  ) => {
    const screenShareRemoteParticipant =
      screenShareRemoteParticipantId && remoteParticipants
        ? remoteParticipants[screenShareRemoteParticipantId]
        : undefined;
    const localVideoStream = localVideoStreams?.find((i) => i.mediaStreamType === 'Video');

    const dominantSpeakerIds = _dominantSpeakersWithFlatId(dominantSpeakers);
    const dominantSpeakersMap: Record<string, number> = {};
    dominantSpeakerIds?.forEach((speaker, idx) => (dominantSpeakersMap[speaker] = idx));

    return {
      screenShareParticipant: screenShareRemoteParticipant
        ? convertRemoteParticipantToVideoGalleryRemoteParticipant(
            toFlatCommunicationIdentifier(screenShareRemoteParticipant.identifier),
            screenShareRemoteParticipant.isMuted,
            checkIsSpeaking(screenShareRemoteParticipant),
            screenShareRemoteParticipant.videoStreams,
            screenShareRemoteParticipant.displayName
          )
        : undefined,
      localParticipant: {
        userId: identifier,
        displayName: displayName ?? '',
        isMuted: isMuted,
        isScreenSharingOn: isScreenSharingOn,
        videoStream: {
          isAvailable: !!localVideoStream,
          isMirrored: localVideoStream?.view?.isMirrored,
          renderElement: localVideoStream?.view?.target
        }
      },
      remoteParticipants: _videoGalleryRemoteParticipantsMemo(remoteParticipants),
      dominantSpeakers: dominantSpeakerIds
    };
  }
);
