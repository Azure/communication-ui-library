// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { VideoGalleryRemoteParticipant } from '../types';

/**
 * Calculates the participants that should be renderd based on the list of dominant
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
  participants: VideoGalleryRemoteParticipant[],
  dominantSpeakers: Array<string> = [],
  visibleParticipants: VideoGalleryRemoteParticipant[] = [],
  maxTiles = 4 // For video tiles, 4 is the recommended value by Calling team.
): VideoGalleryRemoteParticipant[] => {
  // Don't apply any logic if total number of video streams is less than Max video streams.
  if (participants.length <= maxTiles) return participants;

  let activeParticipants = visibleParticipants.slice();
  // Initialize `activeParticipants` if it is empty.
  if (!activeParticipants.length) {
    activeParticipants = participants.slice(0, maxTiles);
  }

  // Only use the Max allowed dominant speakers.
  const dominantSpeakerIds = Array.from(new Set(dominantSpeakers).values()).slice(0, maxTiles);
  const activeParticipantIds = activeParticipants.map((p) => p.userId);
  const newDominantSpeakerIds = dominantSpeakerIds.filter((id) => !activeParticipantIds.includes(id));

  // Remove participants that are no longer dominant and replace them with new dominant speakers.
  for (let index = 0; index < maxTiles; index++) {
    const activeParticipantId = activeParticipantIds[index];

    if (activeParticipantId === undefined || !dominantSpeakerIds.includes(activeParticipantId)) {
      const replacement = newDominantSpeakerIds.shift();
      if (!replacement) break;
      activeParticipantIds[index] = replacement;
    }
  }

  // Converting array to a hashmap for faster searching
  const activeParticipantIdsMap = {};
  activeParticipantIds.forEach((userId) => {
    activeParticipantIdsMap[userId] = true;
  });

  // Add additional participants to the final list of visible participants if the list has less than Max visible participants.
  const emptySlots = maxTiles - activeParticipantIds.length;
  if (emptySlots > 0) {
    for (let index = 0; index < emptySlots; index++) {
      const filler = participants.find((p) => !activeParticipantIdsMap[p.userId]);
      if (filler) {
        activeParticipantIdsMap[filler.userId] = true;
        activeParticipantIds.push(filler.userId);
      }
    }
  }

  const newActiveParticipants = participants.filter((p) => activeParticipantIdsMap[p.userId]);

  // Sort the new video participants to match the order of last visible participants.
  newActiveParticipants.sort((a, b) => {
    return activeParticipantIds.indexOf(a.userId) - activeParticipantIds.indexOf(b.userId);
  });

  return newActiveParticipants;
};
