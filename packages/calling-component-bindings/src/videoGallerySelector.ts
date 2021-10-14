// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DominantSpeakersInfo } from '@azure/communication-calling';
import { memoizeFnAll, toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { RemoteParticipantState, RemoteVideoStreamState } from '@internal/calling-stateful-client';
import { VideoGalleryRemoteParticipant, VideoGalleryStream } from '@internal/react-components';
import { createSelector } from 'reselect';
import {
  getDisplayName,
  getDominantSpeakers,
  getIdentifier,
  getIsMuted,
  getIsScreenSharingOn,
  getLocalVideoStreams,
  getRemoteParticipants,
  getScreenShareRemoteParticipant
} from './baseSelectors';

const convertRemoteVideoStreamToVideoGalleryStream = (stream: RemoteVideoStreamState): VideoGalleryStream => {
  return {
    id: stream.id,
    isAvailable: stream.isAvailable,
    isMirrored: stream.view?.isMirrored,
    renderElement: stream.view?.target
  };
};

const convertRemoteParticipantToVideoGalleryRemoteParticipant = (
  userId: string,
  isMuted: boolean,
  isSpeaking: boolean,
  videoStreams: { [key: number]: RemoteVideoStreamState },
  displayName?: string
): VideoGalleryRemoteParticipant => {
  const rawVideoStreamsArray = Object.values(videoStreams);
  let videoStream: VideoGalleryStream | undefined = undefined;
  let screenShareStream: VideoGalleryStream | undefined = undefined;

  if (rawVideoStreamsArray[0]) {
    if (rawVideoStreamsArray[0].mediaStreamType === 'Video') {
      videoStream = convertRemoteVideoStreamToVideoGalleryStream(rawVideoStreamsArray[0]);
    } else {
      screenShareStream = convertRemoteVideoStreamToVideoGalleryStream(rawVideoStreamsArray[0]);
    }
  }

  if (rawVideoStreamsArray[1]) {
    if (rawVideoStreamsArray[1].mediaStreamType === 'ScreenSharing') {
      screenShareStream = convertRemoteVideoStreamToVideoGalleryStream(rawVideoStreamsArray[1]);
    } else {
      videoStream = convertRemoteVideoStreamToVideoGalleryStream(rawVideoStreamsArray[1]);
    }
  }

  return {
    userId,
    displayName,
    isMuted,
    isSpeaking: isSpeaking && !isMuted,
    videoStream,
    screenShareStream,
    isScreenSharingOn: screenShareStream !== undefined && screenShareStream.isAvailable
  };
};

const memoizedAllConvertRemoteParticipant = memoizeFnAll(
  (
    userId: string,
    isMuted: boolean,
    isSpeaking: boolean,
    videoStreams: { [key: number]: RemoteVideoStreamState },
    displayName?: string
  ): VideoGalleryRemoteParticipant => {
    return convertRemoteParticipantToVideoGalleryRemoteParticipant(
      userId,
      isMuted,
      isSpeaking,
      videoStreams,
      displayName
    );
  }
);

const videoGalleryRemoteParticipantsMemo = (
  remoteParticipants:
    | {
        [keys: string]: RemoteParticipantState;
      }
    | undefined
): VideoGalleryRemoteParticipant[] => {
  if (!remoteParticipants) return [];
  return memoizedAllConvertRemoteParticipant((memoizedFn) => {
    return Object.values(remoteParticipants).map((participant: RemoteParticipantState) => {
      return memoizedFn(
        toFlatCommunicationIdentifier(participant.identifier),
        participant.isMuted,
        participant.isSpeaking,
        participant.videoStreams,
        participant.displayName
      );
    });
  });
};

const dominantSpeakersWithFlatId = (dominantSpeakers?: DominantSpeakersInfo): undefined | string[] => {
  return dominantSpeakers?.speakersList.map(toFlatCommunicationIdentifier);
};

/**
 * Sorts remote participants on the basis of their video status (on/off) and dominant speaker rank.
 * 1. Video participants should always render before non-video participants.
 * 2. Video Tiles should be further sorted based on their ordering in dominant speakers list.
 */
const sortedRemoteParticipants = (
  participants?: VideoGalleryRemoteParticipant[],
  dominantSpeakers?: Record<string, number>
): VideoGalleryRemoteParticipant[] => {
  if (!participants) return [];

  const participantsWithVideo: VideoGalleryRemoteParticipant[] = [];
  const participantsWithoutVideo: VideoGalleryRemoteParticipant[] = [];

  participants.forEach((p) => {
    if (p.videoStream?.renderElement?.childElementCount) {
      participantsWithVideo.push(p);
    } else {
      participantsWithoutVideo.push(p);
    }
  });

  // If dominantSpeakers are available, we sort the video tiles basis on dominant speakers.
  if (dominantSpeakers) {
    participantsWithVideo.sort((a, b) => {
      const idxA = dominantSpeakers[a.userId];
      const idxB = dominantSpeakers[b.userId];
      if (idxA === undefined && idxB === undefined) return 0; // Both a and b don't exist in dominant speakers.
      if (idxA === undefined && idxB >= 0) return 1; // b exists in dominant speakers.
      if (idxB === undefined && idxA >= 0) return -1; // a exists in dominant speakers.
      return idxA - idxB;
    });

    participantsWithoutVideo.sort((a, b) => {
      const idxA = dominantSpeakers[a.userId];
      const idxB = dominantSpeakers[b.userId];
      if (idxA === undefined && idxB === undefined) return 0; // Both a and b don't exist in dominant speakers.
      if (idxA === undefined && idxB >= 0) return 1; // b exists in dominant speakers.
      if (idxB === undefined && idxA >= 0) return -1; // a exists in dominant speakers.
      return idxA - idxB;
    });
  }

  const allSpeakers = participantsWithVideo.concat(participantsWithoutVideo);
  return allSpeakers;
};

/**
 * Selects data that drives {@link VideoGallery} component.
 *
 * @public
 */
export const videoGallerySelector = createSelector(
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

    const dominantSpeakerIds = dominantSpeakersWithFlatId(dominantSpeakers);
    const dominantSpeakersMap: Record<string, number> = {};
    dominantSpeakerIds?.forEach((speaker, idx) => (dominantSpeakersMap[speaker] = idx));

    return {
      screenShareParticipant: screenShareRemoteParticipant
        ? convertRemoteParticipantToVideoGalleryRemoteParticipant(
            toFlatCommunicationIdentifier(screenShareRemoteParticipant.identifier),
            screenShareRemoteParticipant.isMuted,
            screenShareRemoteParticipant.isSpeaking,
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
      // Sorting by dominant speakers is temporarily disabled because it is unstable
      // and causes too many renders. With 6 participants, it easily causes enough renders
      // to freeze the app.
      // There is a new, stable, implementation of the sorting in flight, which replaces
      // this implementation.
      remoteParticipants: sortedRemoteParticipants(videoGalleryRemoteParticipantsMemo(remoteParticipants), {})
    };
  }
);
