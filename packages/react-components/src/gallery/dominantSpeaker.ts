// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { VideoGalleryRemoteParticipant } from '../types';

type SmartDominantSpeakerParticipantsArgs = {
  /**
   * Array containing all participants of a call. {@link @azure/communication-react#VideoGalleryRemoteParticipant}
   */
  participants: VideoGalleryRemoteParticipant[];
  /**
   * An array containing the userId of dominant speakers
   * in a call in the order of their dominance. 0th index is the most dominant, 1st is the second most etc
   */
  dominantSpeakers?: string[];
  /**
   * Array containing currently rendered (visible)
   * participants in the call. {@link @azure/communication-react#VideoGalleryRemoteParticipant}
   */
  lastVisibleParticipants?: VideoGalleryRemoteParticipant[];
  /**
   * Maximum number of tiles to calculate.
   */
  maxTiles: number;
  /**
   * Maximum number of dominant speakers to calculate.
   */
  maxVisibleParticipants: number;
};

/**
 * Calculates the participants that should be rendered based on the list of dominant
 * speakers and currently rendered participants in a call.
 * @param args - SmartDominantSpeakerParticipantsArgs
 * @returns VideoGalleryRemoteParticipant[] {@link @azure/communication-react#VideoGalleryRemoteParticipant}
 */
export const smartDominantSpeakerParticipants = (
  args: SmartDominantSpeakerParticipantsArgs
): VideoGalleryRemoteParticipant[] => {
  const { participants, dominantSpeakers = [], lastVisibleParticipants = [], maxTiles, maxVisibleParticipants } = args;

  // Don't apply any logic if total number of video streams is less than Max dominant speakers.
  if (participants.length <= maxVisibleParticipants) {
    return participants;
  }

  // Only use the Max allowed dominant speakers.
  const dominantSpeakerIds = Array.from(new Set(dominantSpeakers).values()).slice(0, maxVisibleParticipants);

  let lastVisibleParticipantIds = lastVisibleParticipants.map((p) => p.userId);
  const newVisibleParticipantIds = lastVisibleParticipants.map((p) => p.userId).slice(0, maxVisibleParticipants);
  const newDominantSpeakerIds = dominantSpeakerIds.filter((id) => !newVisibleParticipantIds.includes(id));

  // Remove participants that are no longer dominant and replace them with new dominant speakers.
  for (let index = 0; index < maxVisibleParticipants; index++) {
    const visibleDominantSpeakerId = newVisibleParticipantIds[index];
    if (visibleDominantSpeakerId === undefined || !dominantSpeakerIds.includes(visibleDominantSpeakerId)) {
      const replacement = newDominantSpeakerIds.shift();
      if (!replacement) break;
      newVisibleParticipantIds[index] = replacement;
    }
  }

  const removedVisibleParticipantIds = lastVisibleParticipantIds.filter((p) => !newVisibleParticipantIds.includes(p));
  for (const visibleParticipantId of removedVisibleParticipantIds) {
    newVisibleParticipantIds.push(visibleParticipantId);
  }

  // Converting array to a hashmap for faster searching
  const visibleParticipantIdsMap = {};
  newVisibleParticipantIds.forEach((userId) => {
    visibleParticipantIdsMap[userId] = true;
  });

  // Add additional participants to the final list of visible participants if the list has less than Max visible participants.
  const emptySlots = maxTiles - newVisibleParticipantIds.length;
  if (emptySlots > 0) {
    for (let index = 0; index < emptySlots; index++) {
      const filler = participants.find((p) => !visibleParticipantIdsMap[p.userId]);
      if (filler) {
        visibleParticipantIdsMap[filler.userId] = true;
        newVisibleParticipantIds.push(filler.userId);
      }
    }
  }

  const newVisibleParticipants = participants.filter((p) => visibleParticipantIdsMap[p.userId]);

  // Sort the new video participants to match the order of last visible participants.
  newVisibleParticipants.sort((a, b) => {
    return newVisibleParticipantIds.indexOf(a.userId) - newVisibleParticipantIds.indexOf(b.userId);
  });

  return newVisibleParticipants.slice(0, maxTiles);
};
