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
   * Maximum number of dominant speaker positions to move participants in.
   */
  maxDominantSpeakers: number;
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
  const { participants, dominantSpeakers = [], lastVisibleParticipants = [], maxDominantSpeakers } = args;

  // Don't apply any logic if total number of video streams is less than max dominant speakers.
  if (participants.length <= maxDominantSpeakers) {
    return participants;
  }

  const participantsMap = participantsById(participants);

  // Only use the Max allowed dominant speakers that exist in participants
  const dominantSpeakerIds = dominantSpeakers.filter((id) => !!participantsMap[id]).slice(0, maxDominantSpeakers);

  const newVisibleParticipantIds = lastVisibleParticipants.map((p) => p.userId).slice(0, maxDominantSpeakers);
  const newDominantSpeakerIds = dominantSpeakerIds.filter((id) => !newVisibleParticipantIds.includes(id));

  // Remove participants that are no longer dominant and replace them with new dominant speakers.
  for (let index = 0; index < maxDominantSpeakers; index++) {
    const newVisibleParticipantId = newVisibleParticipantIds[index];
    if (newVisibleParticipantId === undefined || !dominantSpeakerIds.includes(newVisibleParticipantId)) {
      const replacement = newDominantSpeakerIds.shift();
      if (!replacement) {
        break;
      }
      newVisibleParticipantIds[index] = replacement;
    }
  }

  let newVisibleParticipants = newVisibleParticipantIds
    .map((participantId) => participantsMap[participantId])
    .filter((p) => p !== undefined);

  const newVisibleParticipantIdsSet = new Set(newVisibleParticipantIds);
  const remainingParticipants = participants.filter((p) => !newVisibleParticipantIdsSet.has(p.userId));

  newVisibleParticipants = newVisibleParticipants.concat(remainingParticipants);

  return newVisibleParticipants;
};

const participantsById = (
  participants: VideoGalleryRemoteParticipant[]
): { [key: string]: VideoGalleryRemoteParticipant } => {
  const response: { [key: string]: VideoGalleryRemoteParticipant } = {};
  participants.forEach((p) => (response[p.userId] = p));
  return response;
};
