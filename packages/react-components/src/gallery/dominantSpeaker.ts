// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { VideoGalleryRemoteParticipant } from '../types';

/**
 * Calculates the participants that should be renderd basis on the list of dominant speakers and currently renderd participants in a call.
 * @param participants Array containing all participants of a call. {@link @azure/communication-react#VideoGalleryRemoteParticipant}
 * @param dominantSpeakers An array containing the userId of dominant speakers in a call in the order of their dominance. 0th index is the most dominant, 1st is the second most etc
 * @param currentVisibleParticipants  Array containing currently rendered (visible) participants in the call. {@link @azure/communication-react#VideoGalleryRemoteParticipant}
 * @param MAX_TILES Maximum number of tiles to calculate.
 * @returns VideoGalleryRemoteParticipant[] {@link @azure/communication-react#VideoGalleryRemoteParticipant}
 */
export const smartDominantSpeakerParticipants = (
  participants: VideoGalleryRemoteParticipant[] = [],
  dominantSpeakers: Array<string> = [],
  currentVisibleParticipants: VideoGalleryRemoteParticipant[] = [],
  MAX_TILES = 4
): VideoGalleryRemoteParticipant[] => {
  if (!participants) return [];

  // Only use the Max allowed dominant speakers.
  const dominantSpeakerIds = dominantSpeakers.slice(0, MAX_TILES);
  const participantsWithVideo = participants.filter((p) => p.videoStream?.isAvailable);

  // Don't apply any logic if total number of video streams is less than Max video streams.
  if (participantsWithVideo.length <= MAX_TILES) return participantsWithVideo;

  // Remove non-video speakers from `currentVisibleParticipants` after re-render.
  // Note: This could cause the array to become null if everyone turned off video, so we handle that by re-initializing this array if it is empty after this.
  currentVisibleParticipants = currentVisibleParticipants.filter((p) => p.videoStream?.isAvailable);

  // Initialize `currentVisibleParticipants` if it is empty.
  if (!currentVisibleParticipants.length) {
    currentVisibleParticipants = participantsWithVideo.slice(0, MAX_TILES);
  }

  const lastVisibleSpeakerIds = currentVisibleParticipants.map((speaker) => speaker.userId);
  const newDominantSpeakerIds = dominantSpeakerIds.filter((id) => !lastVisibleSpeakerIds.includes(id));

  // Remove participants that are no longer dominant and replace them with new dominant speakers.
  lastVisibleSpeakerIds.forEach((id, idx) => {
    if (!dominantSpeakerIds.includes(id)) {
      const replacement = newDominantSpeakerIds.shift();
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
  if (videoParticipantsToRender.length < MAX_TILES) {
    const diff = MAX_TILES - videoParticipantsToRender.length;
    // @TODO: tweak implements, don't filter through all participants. Filter only the number of participants equal to diff
    const fillers = participantsWithVideo.filter((p) => !lastVisibleSpeakerIds.includes(p.userId)).slice(0, diff);
    videoParticipantsToRender = videoParticipantsToRender.concat(fillers);
  }

  return videoParticipantsToRender;
};
