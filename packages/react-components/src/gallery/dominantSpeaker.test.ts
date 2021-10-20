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
      maxTiles: 4,
      maxVisibleParticipants: 4
    });
    expect(result.length).toBe(3);

    result = smartDominantSpeakerParticipants({
      participants: participants.slice(0, 4),
      dominantSpeakers: ['1', '3', '5', '7'],
      maxTiles: 4,
      maxVisibleParticipants: 4
    });
    expect(result.length).toBe(4);
  });

  test('[xkcd] temp', () => {
    let result = smartDominantSpeakerParticipants({
      participants: participants,
      dominantSpeakers: ['1', '3'],
      maxTiles: 8,
      maxVisibleParticipants: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['1', '3', '2', '4', '5', '6', '7', '8']);

    result = smartDominantSpeakerParticipants({
      participants: participants,
      dominantSpeakers: ['2', '1'],
      lastVisibleParticipants: result,
      maxTiles: 8,
      maxVisibleParticipants: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['1', '3', '2', '4', '5', '6', '7', '8']);
  });

  test('returns participants even when there are no visible participants', () => {
    const result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '3', '5', '7'],
      maxTiles: 4,
      maxVisibleParticipants: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['1', '3', '5', '7', '2', '4', '6', '8']);
  });

  test('returns participants array replacing non-dominant speakers with dominant speakers', () => {
    const result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '3', '5', '7'],
      lastVisibleParticipants: [{ userId: '1' }, { userId: '2' }, { userId: '3' }, { userId: '4' }],
      maxTiles: 4,
      maxVisibleParticipants: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['1', '5', '3', '7', '2', '4', '6', '8']);
  });

  test('maintains the ordering of new participants to match last visible participants', () => {
    let result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '2', '3', '4'],
      lastVisibleParticipants: [{ userId: '3' }, { userId: '4' }],
      maxTiles: 4,
      maxVisibleParticipants: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['3', '4', '1', '2', '5', '6', '7', '8']);

    result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '2', '3', '4'],
      lastVisibleParticipants: [{ userId: '2' }, { userId: '1' }],
      maxTiles: 4,
      maxVisibleParticipants: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['2', '1', '3', '4', '5', '6', '7', '8']);
  });

  test('returns new dominant speakers when a dominant speaker is replaced', () => {
    let result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '2', '3', '4'],
      lastVisibleParticipants: [{ userId: '1' }, { userId: '2' }],
      maxTiles: 4,
      maxVisibleParticipants: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);

    result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['5', '2', '3', '4'],
      lastVisibleParticipants: [{ userId: '11' }, { userId: '10' }],
      maxTiles: 4,
      maxVisibleParticipants: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['5', '2', '3', '4', '1', '6', '7', '8']);
  });

  test('returns upto MAX participants even when number of last visible participants and dominant speakers is less than MAX', () => {
    let result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '2'],
      lastVisibleParticipants: [{ userId: '1' }, { userId: '2' }],
      maxTiles: 4,
      maxVisibleParticipants: 4
    });
    let resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);

    result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '2'],
      lastVisibleParticipants: [{ userId: '2' }],
      maxTiles: 4,
      maxVisibleParticipants: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['2', '1', '3', '4', '5', '6', '7', '8']);
  });

  test('returns participants array always containing all dominant speakers', () => {
    const result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['5', '6', '7', '8'],
      lastVisibleParticipants: [{ userId: '1' }, { userId: '2' }, { userId: '3' }, { userId: '4' }],
      maxTiles: 0,
      maxVisibleParticipants: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['5', '6', '7', '8', '1', '2', '3', '4']);
  });

  test('returns the same participants array if dominant speakers have re-ordered but are same', () => {
    let result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '2', '3', '4'],
      lastVisibleParticipants: [{ userId: '1' }, { userId: '2' }, { userId: '3' }, { userId: '4' }],
      maxTiles: 4,
      maxVisibleParticipants: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);

    result = smartDominantSpeakerParticipants({
      participants,
      // Dominant speakers rearranged, other arguments unchanged.
      dominantSpeakers: ['3', '2', '1', '4'],
      lastVisibleParticipants: result.slice(0, 4),
      maxTiles: 4,
      maxVisibleParticipants: 4
    });
    // No rearrangement in result.
    expect(result.map((p) => p.userId)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);
  });

  test('returns participant only once even when there are duplicates in dominant speakers', () => {
    const result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '1', '3', '7'],
      lastVisibleParticipants: [{ userId: '1' }, { userId: '2' }, { userId: '3' }, { userId: '4' }],
      maxTiles: 4,
      maxVisibleParticipants: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['1', '7', '3', '4', '2', '5', '6', '8']);
  });

  // TODO: Reconsider this test.
  test('returns upto max dominant speakers first and then the remaining tiles upto max tiles', () => {
    let result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['5', '7', '8'],
      lastVisibleParticipants: [],
      maxTiles: 8,
      maxVisibleParticipants: 3
    });
    expect(result.map((p) => p.userId)).toEqual(['5', '7', '8', '1', '2', '3', '4', '6']);

    // When maxDominantSpeakers is set higher than actual number of dominant speakers.
    result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '3', '5'],
      lastVisibleParticipants: [],
      maxTiles: 8,
      maxVisibleParticipants: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['1', '3', '5', '2', '4', '6', '7', '8']);

    // When maxDominantSpeakers is set higher than maxTiles.
    result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '3', '5'],
      lastVisibleParticipants: [],
      maxTiles: 3,
      maxVisibleParticipants: 4
    });
    expect(result.map((p) => p.userId)).toEqual(['1', '3', '5', '2', '4', '6', '7', '8']);
  });

  test('returns upto max dominant speakers first when visible participants is populated', () => {
    const result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['5', '7', '8'],
      lastVisibleParticipants: participants,
      maxTiles: 8,
      maxVisibleParticipants: 3
    });
    expect(result.map((p) => p.userId)).toEqual(['5', '7', '8', '1', '2', '3', '4', '6']);
  });

  test('returns last visible participants without re-ordering', () => {
    let result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['5', '7', '8'],
      lastVisibleParticipants: [{ userId: '3' }, { userId: '5' }, { userId: '8' }, { userId: '4' }, { userId: '1' }],
      maxTiles: 8,
      maxVisibleParticipants: 3
    });
    expect(result.map((p) => p.userId)).toEqual(['7', '5', '8', '3', '4', '1', '2', '6']);

    result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['5', '7', '8'],
      lastVisibleParticipants: result,
      maxTiles: 8,
      maxVisibleParticipants: 3
    });
    expect(result.map((p) => p.userId)).toEqual(['7', '5', '8', '3', '4', '1', '2', '6']);
  });
});
