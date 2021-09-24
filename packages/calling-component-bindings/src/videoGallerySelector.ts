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
    isSpeaking,
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

const MAX_RENDERED_VIDEO_TILES = 4;

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

// Cache for maintaining the current visible participants and graceful subsequent renders.
let lastVisibleSpeakersWithVideo: VideoGalleryRemoteParticipant[] = [];

const sortedRemoteParticipantsWithVideo = (
  participants?: VideoGalleryRemoteParticipant[],
  dominantSpeakers: Array<string> = []
): VideoGalleryRemoteParticipant[] | [] => {
  if (!participants) return [];

  // Only use the Max allowed dominant speakers.
  const dominantSpeakerIds = dominantSpeakers.slice(0, MAX_RENDERED_VIDEO_TILES);
  const participantsWithVideo = participants.filter((p) => p.videoStream?.isAvailable);

  // Don't apply any logic if total number of video streams is less than Max video streams.
  if (participantsWithVideo.length <= MAX_RENDERED_VIDEO_TILES) return participantsWithVideo;

  // Remove non-video speakers from `lastVisibleSpeakersWithVideo` after re-render.
  // Note: This could cause the array to become null if everyone turned off video, so we handle that by re-initializing this array if it is empty after this.
  lastVisibleSpeakersWithVideo = lastVisibleSpeakersWithVideo.filter((p) => p.videoStream?.isAvailable);

  // Initialize `lastVisibleSpeakersWithVideo` if it is empty.
  if (!lastVisibleSpeakersWithVideo.length) {
    lastVisibleSpeakersWithVideo = participantsWithVideo.slice(0, MAX_RENDERED_VIDEO_TILES);
  }

  const lastVisibleSpeakerIds = lastVisibleSpeakersWithVideo.map((speaker) => speaker.userId);
  const newDominantSpeakerIds = dominantSpeakerIds.filter((id) => !lastVisibleSpeakerIds.includes(id));

  // Remove participants that are no longer dominant and replace them with new dominant speakers.
  lastVisibleSpeakerIds.forEach((id, idx) => {
    if (!dominantSpeakerIds.includes(id)) {
      const replacement = newDominantSpeakerIds.pop();
      if (replacement) {
        lastVisibleSpeakerIds[idx] = replacement;
      }
    }
  });

  // Sort the new video participants to match the order of last visible participants.
  // @TODO: filter here for participants without video instead of doing it above?
  let videoParticipantsToRender = participantsWithVideo.filter((p) => lastVisibleSpeakerIds.includes(p.userId));
  videoParticipantsToRender.sort((a, b) => {
    return lastVisibleSpeakerIds.indexOf(a.userId) - lastVisibleSpeakerIds.indexOf(b.userId);
  });

  // Add additional participants to the final list of visible participants if the list has less than Max visible participants.
  if (videoParticipantsToRender.length < MAX_RENDERED_VIDEO_TILES) {
    const diff = MAX_RENDERED_VIDEO_TILES - videoParticipantsToRender.length;
    // @TODO: tweak implements, don't filter through all participants. Filter only the number of participants equal to diff
    const fillers = participantsWithVideo.filter((p) => !lastVisibleSpeakerIds.includes(p.userId)).slice(0, diff);
    videoParticipantsToRender = videoParticipantsToRender.concat(fillers);
  }

  lastVisibleSpeakersWithVideo = videoParticipantsToRender;
  return videoParticipantsToRender;
};

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

    const remoteParticipantsWithVideo = sortedRemoteParticipantsWithVideo(
      videoGalleryRemoteParticipantsMemo(remoteParticipants),
      dominantSpeakerIds
    );

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
      remoteParticipants: sortedRemoteParticipants(
        videoGalleryRemoteParticipantsMemo(remoteParticipants),
        dominantSpeakersMap
      ),
      remoteParticipantsWithVideo: remoteParticipantsWithVideo
    };
  }
);
