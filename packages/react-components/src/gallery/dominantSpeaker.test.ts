// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { VideoGalleryParticipant } from '..';
import { smartDominantSpeakerParticipants } from './dominantSpeaker';

const participants: VideoGalleryParticipant[] = [
  { userId: '1', videoStream: { isAvailable: true } },
  { userId: '2', videoStream: { isAvailable: true } },
  { userId: '3', videoStream: { isAvailable: true } },
  { userId: '4', videoStream: { isAvailable: true } },
  { userId: '5', videoStream: { isAvailable: true } },
  { userId: '6', videoStream: { isAvailable: true } },
  { userId: '7', videoStream: { isAvailable: true } },
  { userId: '8', videoStream: { isAvailable: true } }
];

const dominantSpeakers: Array<string> = ['1', '3', '5', '7'];

const visibleParticipants: VideoGalleryParticipant[] = [
  { userId: '1', videoStream: { isAvailable: true } },
  { userId: '2', videoStream: { isAvailable: true } },
  { userId: '3', videoStream: { isAvailable: true } },
  { userId: '4', videoStream: { isAvailable: true } }
];

describe('Test smartDominantSpeakerParticipants function', () => {
  test('returns all participants when number of participants is less than or equal to number of dominant speakers', () => {
    let result = smartDominantSpeakerParticipants(participants.slice(0, 3), dominantSpeakers, visibleParticipants);
    expect(result.length).toBe(3);

    result = smartDominantSpeakerParticipants(participants.slice(0, 4), dominantSpeakers, visibleParticipants);
    expect(result.length).toBe(4);
  });

  test('returns no more than the MAX participants', () => {
    let result = smartDominantSpeakerParticipants(participants, dominantSpeakers, visibleParticipants, 4);
    expect(result.length).toBe(4);

    result = smartDominantSpeakerParticipants(participants, dominantSpeakers, visibleParticipants, 5);
    expect(result.length).toBe(5);
  });

  test('returns participants array replacing non-dominant speakers with dominant speakers', () => {
    const result = smartDominantSpeakerParticipants(participants, dominantSpeakers, visibleParticipants, 4);
    expect(result.length).toBe(4);
    const resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['1', '5', '3', '7']);
  });

  test('maintains the ordering of new participants to match last visible participants', () => {
    const result = smartDominantSpeakerParticipants(
      participants,
      ['1', '2', '3', '4'],
      visibleParticipants.slice(2, 4),
      4
    );
    expect(result.length).toBe(4);
    const resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['3', '4', '1', '2']);
  });

  test('returns upto MAX participants even when number of last visible participants and dominant speakers is less than MAX', () => {
    let result = smartDominantSpeakerParticipants(participants, ['1', '2'], visibleParticipants.slice(0, 2), 4);
    expect(result.length).toBe(4);
    let resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['1', '2', '3', '4']);

    result = smartDominantSpeakerParticipants(participants, ['1', '2'], visibleParticipants.slice(1, 2), 4);
    expect(result.length).toBe(4);
    resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['2', '1', '3', '4']);
  });

  test('returns participants array always containing all dominant speakers', () => {
    const customDominantSpeakers = ['5', '6', '7', '8'];
    const result = smartDominantSpeakerParticipants(participants, customDominantSpeakers, visibleParticipants, 4);
    expect(result.length).toBe(4);
    const resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(customDominantSpeakers);
  });
});
