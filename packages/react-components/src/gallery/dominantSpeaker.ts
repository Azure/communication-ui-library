// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { VideoGalleryRemoteParticipant } from '../types';

/**
 * Calculates the participants that should be renderd basis on the list of dominant
 * speakers and currently renderd participants in a call.
 * @param participants - Array containing all participants of a call.
 * {@link @azure/communication-react#VideoGalleryRemoteParticipant}
 * @param dominantSpeakers - An array containing the userId of dominant speakers
 * in a call in the order of their dominance. 0th index is the most dominant, 1st is the second most etc
 * @param visibleParticipants - Array containing currently rendered (visible)
 * participants in the call. {@link @azure/communication-react#VideoGalleryRemoteParticipant}
 * @param maxTiles - Maximum number of tiles to calculate.
 * @returns VideoGalleryRemoteParticipant[] {@link @azure/communication-react#VideoGalleryRemoteParticipant}
 */
export const smartDominantSpeakerParticipants = (
  participants: VideoGalleryRemoteParticipant[] = [],
  dominantSpeakers: Array<string> = [],
  visibleParticipants: VideoGalleryRemoteParticipant[] = [],
  maxTiles = 4
): VideoGalleryRemoteParticipant[] => {
  if (!participants) return [];

  // Don't apply any logic if total number of video streams is less than Max video streams.
  if (participants.length <= maxTiles) return participants;

  let currentParticipants = visibleParticipants.slice();
  // Initialize `currentParticipants` if it is empty.
  if (!currentParticipants.length) {
    currentParticipants = participants.slice(0, maxTiles);
  }

  // Only use the Max allowed dominant speakers.
  const dominantSpeakerIds = dominantSpeakers.slice(0, maxTiles);
  const lastVisibleSpeakerIds = currentParticipants.map((speaker) => speaker.userId);
  const newDominantSpeakerIds = dominantSpeakerIds.filter((id) => !lastVisibleSpeakerIds.includes(id));

  // Remove participants that are no longer dominant and replace them with new dominant speakers.
  lastVisibleSpeakerIds.forEach((userId, index) => {
    if (!dominantSpeakerIds.includes(userId)) {
      const replacement = newDominantSpeakerIds.shift();
      if (replacement) {
        lastVisibleSpeakerIds[index] = replacement;
      }
    }
  });

  // Sort the new video participants to match the order of last visible participants.
  const videoParticipantsToRender = participants.filter((p) => lastVisibleSpeakerIds.includes(p.userId));
  videoParticipantsToRender.sort((a, b) => {
    return lastVisibleSpeakerIds.indexOf(a.userId) - lastVisibleSpeakerIds.indexOf(b.userId);
  });

  // Add additional participants to the final list of visible participants if the list has less than Max visible participants.
  if (videoParticipantsToRender.length < maxTiles) {
    const diff = maxTiles - videoParticipantsToRender.length;
    for (let index = 0; index < diff; index++) {
      const filler = participants.find((p) => !videoParticipantsToRender.includes(p));
      filler && videoParticipantsToRender.push(filler);
    }
  }

  return videoParticipantsToRender;
};
