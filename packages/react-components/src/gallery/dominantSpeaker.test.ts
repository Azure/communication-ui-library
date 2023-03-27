// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { VideoGalleryParticipant } from '..';
import { smartDominantSpeakerParticipants } from './dominantSpeaker';

const participants: VideoGalleryParticipant[] = [
  { userId: '1' },
  { userId: '2' },
  { userId: '3' },
  { userId: '4' },
  { userId: '5' },
  { userId: '6' },
  { userId: '7' },
  { userId: '8' }
];

describe('Test smartDominantSpeakerParticipants function', () => {
  test('returns all participants when number of participants is less than or equal to number of dominant speakers', () => {
    let result = smartDominantSpeakerParticipants({
      participants: participants.slice(0, 3),
      dominantSpeakers: ['1', '3', '5', '7'],
      maxDominantSpeakers: 4
    });
    expect(result.length).toBe(3);

    result = smartDominantSpeakerParticipants({
      participants: participants.slice(0, 4),
      dominantSpeakers: ['1', '3', '5', '7'],
      maxDominantSpeakers: 4
    });
    expect(result.length).toBe(4);
  });

  test('dominantSpeakers is less than maxDominantSpeakers should result in minimum changes', () => {
    let result = smartDominantSpeakerParticipants({
      participants: participants,
      dominantSpeakers: ['1', '3'],
      maxDominantSpeakers: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['1', '3', '2', '4', '5', '6', '7', '8']);

    result = smartDominantSpeakerParticipants({
      participants: participants,
      dominantSpeakers: ['2', '1'],
      lastVisibleParticipants: result,
      maxDominantSpeakers: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['1', '3', '2', '4', '5', '6', '7', '8']);
  });

  test('returns participants even when there are no visible participants', () => {
    const result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '3', '5', '7'],
      maxDominantSpeakers: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['1', '3', '5', '7', '2', '4', '6', '8']);
  });

  test('returns participants array replacing non-dominant speakers with dominant speakers', () => {
    const result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '3', '5', '7'],
      lastVisibleParticipants: [{ userId: '1' }, { userId: '2' }, { userId: '3' }, { userId: '4' }],
      maxDominantSpeakers: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['1', '5', '3', '7', '2', '4', '6', '8']);
  });

  test('maintains the ordering of new participants to match last visible participants', () => {
    let result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '2', '3', '4'],
      lastVisibleParticipants: [{ userId: '3' }, { userId: '4' }],
      maxDominantSpeakers: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['3', '4', '1', '2', '5', '6', '7', '8']);

    result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '2', '3', '4'],
      lastVisibleParticipants: [{ userId: '2' }, { userId: '1' }],
      maxDominantSpeakers: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['2', '1', '3', '4', '5', '6', '7', '8']);
  });

  test('returns new dominant speakers when a dominant speaker is replaced', () => {
    let result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '2', '3', '4'],
      lastVisibleParticipants: [{ userId: '1' }, { userId: '2' }],
      maxDominantSpeakers: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);

    result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['5', '2', '3', '4'],
      lastVisibleParticipants: [{ userId: '11' }, { userId: '10' }],
      maxDominantSpeakers: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['5', '2', '3', '4', '1', '6', '7', '8']);
  });

  test('lastVisibleParticipants no longer in participants are replaced without re-ordering those that still exist', () => {
    const result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['3', '4', '5', '2'],
      lastVisibleParticipants: [{ userId: '11' }, { userId: '10' }, { userId: '3' }, { userId: '4' }],
      maxDominantSpeakers: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['5', '2', '3', '4', '1', '6', '7', '8']);
  });

  test('returns only up to maxDominantSpeaker. extra dominant speakers maintain the same order', () => {
    const result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['5', '6', '7', '8'],
      lastVisibleParticipants: [{ userId: '1' }, { userId: '2' }, { userId: '3' }, { userId: '4' }],
      maxDominantSpeakers: 3
    });
    expect(result.map((p) => p.userId)).toEqual(['5', '6', '7', '1', '2', '3', '4', '8']);
  });

  test('returns participants array always containing all dominant speakers', () => {
    const result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['5', '6', '7', '8'],
      lastVisibleParticipants: [{ userId: '1' }, { userId: '2' }, { userId: '3' }, { userId: '4' }],
      maxDominantSpeakers: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['5', '6', '7', '8', '1', '2', '3', '4']);
  });

  test('returns the same participants array if dominant speakers have re-ordered but are same', () => {
    let result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '2', '3', '4'],
      lastVisibleParticipants: [{ userId: '1' }, { userId: '2' }, { userId: '3' }, { userId: '4' }],
      maxDominantSpeakers: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);

    result = smartDominantSpeakerParticipants({
      participants,
      // Dominant speakers rearranged, other arguments unchanged.
      dominantSpeakers: ['3', '2', '1', '4'],
      lastVisibleParticipants: result.slice(0, 4),
      maxDominantSpeakers: 4
    });
    // No rearrangement in result.
    expect(result.map((p) => p.userId)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);
  });

  test('returns participant only once even when there are duplicates in dominant speakers', () => {
    const result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '1', '3', '7'],
      lastVisibleParticipants: [{ userId: '1' }, { userId: '2' }, { userId: '3' }, { userId: '4' }],
      maxDominantSpeakers: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['1', '7', '3', '4', '2', '5', '6', '8']);
  });

  test('returns last visible participants without re-ordering', () => {
    let result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['5', '7', '8'],
      lastVisibleParticipants: [{ userId: '3' }, { userId: '5' }, { userId: '8' }, { userId: '4' }, { userId: '1' }],
      maxDominantSpeakers: 3
    });
    expect(result.map((p) => p.userId)).toEqual(['7', '5', '8', '1', '2', '3', '4', '6']);

    result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['5', '7', '8'],
      lastVisibleParticipants: result,
      maxDominantSpeakers: 3
    });
    expect(result.map((p) => p.userId)).toEqual(['7', '5', '8', '1', '2', '3', '4', '6']);
  });

  test('complicated scenario #1. 1 dominant speaker and 2 last visible participant not in participants should return all existing dominant speakers.', () => {
    const result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['12', '3', '4', '5'],
      lastVisibleParticipants: [{ userId: '11' }, { userId: '10' }, { userId: '3' }, { userId: '4' }],
      maxDominantSpeakers: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['5', '3', '4', '1', '2', '6', '7', '8']);
  });

  test('complicated scenario #2. 1 EXTRA dominant speaker and 2 last visible participant not in participants should return all existing dominant speakers.', () => {
    const result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['12', '3', '4', '5', '6'],
      lastVisibleParticipants: [{ userId: '11' }, { userId: '10' }, { userId: '3' }, { userId: '4' }],
      maxDominantSpeakers: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['5', '6', '3', '4', '1', '2', '7', '8']);
  });
});
