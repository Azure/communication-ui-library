// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { VideoGalleryRemoteParticipant } from '../types';

/**
 * Calculates the participants that should be rendered based on the list of dominant
 * speakers and currently rendered participants in a call.
 * @param participants - Array containing all participants of a call.
 * {@link @azure/communication-react#VideoGalleryRemoteParticipant}
 * @param dominantSpeakers - An array containing the userId of dominant speakers
 * in a call in the order of their dominance. 0th index is the most dominant, 1st is the second most etc
 * @param visibleParticipants - Array containing currently rendered (visible)
 * participants in the call. {@link @azure/communication-react#VideoGalleryRemoteParticipant}
 * @param maxTiles - Maximum number of tiles to calculate.
 * @param maxDominantSpeakers - Maximum number of dominant speakers to calculate.
 * @returns VideoGalleryRemoteParticipant[] {@link @azure/communication-react#VideoGalleryRemoteParticipant}
 */
export const smartDominantSpeakerParticipants = (
  participants: VideoGalleryRemoteParticipant[],
  dominantSpeakers: Array<string> = [],
  visibleParticipants: VideoGalleryRemoteParticipant[] = [],
  maxTiles = 4, // For video tiles, 4 is the recommended value by Calling team.,
  maxDominantSpeakers = 4
): VideoGalleryRemoteParticipant[] => {
  // Don't apply any logic if total number of video streams is less than Max dominant speakers.
  if (participants.length <= maxDominantSpeakers) return participants;

  // Only use the Max allowed dominant speakers.
  const dominantSpeakerIds = Array.from(new Set(dominantSpeakers).values()).slice(0, maxDominantSpeakers);
  // We slice the visible participants to ensure only the first `n` participants are used where n == maxDominantSpeakers.
  // This ensures that the final result has dominant speakers first and then the filler participants both totalling up to maxTiles.
  const visibleParticipantIds = visibleParticipants.map((p) => p.userId).slice(0, maxDominantSpeakers);
  const newDominantSpeakerIds = dominantSpeakerIds.filter((id) => !visibleParticipantIds.includes(id));

  // Remove participants that are no longer dominant and replace them with new dominant speakers.
  for (let index = 0; index < maxDominantSpeakers; index++) {
    const visibleParticipantId = visibleParticipantIds[index];
    if (visibleParticipantId === undefined || !dominantSpeakerIds.includes(visibleParticipantId)) {
      const replacement = newDominantSpeakerIds.shift();
      if (!replacement) break;
      visibleParticipantIds[index] = replacement;
    }
  }

  // Converting array to a hashmap for faster searching
  const visibleParticipantIdsMap = {};
  visibleParticipantIds.forEach((userId) => {
    visibleParticipantIdsMap[userId] = true;
  });

  // Add additional participants to the final list of visible participants if the list has less than Max visible participants.
  const emptySlots = maxTiles - visibleParticipantIds.length;
  if (emptySlots > 0) {
    for (let index = 0; index < emptySlots; index++) {
      const filler = participants.find((p) => !visibleParticipantIdsMap[p.userId]);
      if (filler) {
        visibleParticipantIdsMap[filler.userId] = true;
        visibleParticipantIds.push(filler.userId);
      }
    }
  }

  const newVisibleParticipants = participants.filter((p) => visibleParticipantIdsMap[p.userId]);

  // Sort the new video participants to match the order of last visible participants.
  newVisibleParticipants.sort((a, b) => {
    return visibleParticipantIds.indexOf(a.userId) - visibleParticipantIds.indexOf(b.userId);
  });

  return newVisibleParticipants;
};
