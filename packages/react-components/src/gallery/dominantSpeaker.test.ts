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
      dominantSpeakers: ['1', '3', '5', '7']
    });
    expect(result.length).toBe(3);

    result = smartDominantSpeakerParticipants({
      participants: participants.slice(0, 4),
      dominantSpeakers: ['1', '3', '5', '7']
    });
    expect(result.length).toBe(4);
  });

  test('returns no more than the MAX participants', () => {
    let result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '3', '5', '7'],
      visibleParticipants: [{ userId: '1' }, { userId: '2' }, { userId: '3' }, { userId: '4' }],
      maxTiles: 4
    });
    expect(result.length).toBe(4);

    result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '3', '5', '7'],
      visibleParticipants: [{ userId: '1' }, { userId: '2' }, { userId: '3' }, { userId: '4' }],
      maxTiles: 5
    });
    expect(result.length).toBe(5);
  });

  test('returns participants even when there are no visible participants', () => {
    const result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '3', '5', '7'],
      maxTiles: 4
    });
    expect(result.length).toBe(4);
  });

  test('returns participants array replacing non-dominant speakers with dominant speakers', () => {
    const result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '3', '5', '7'],
      visibleParticipants: [{ userId: '1' }, { userId: '2' }, { userId: '3' }, { userId: '4' }],
      maxTiles: 4
    });
    const resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['1', '5', '3', '7']);
  });

  test('maintains the ordering of new participants to match last visible participants', () => {
    let result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '2', '3', '4'],
      visibleParticipants: [{ userId: '3' }, { userId: '4' }],
      maxTiles: 4
    });
    let resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['3', '4', '1', '2']);

    result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '2', '3', '4'],
      visibleParticipants: [{ userId: '2' }, { userId: '1' }],
      maxTiles: 4
    });
    resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['2', '1', '3', '4']);
  });

  test('returns new dominant speakers when a dominant speaker is replaced', () => {
    let result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '2', '3', '4'],
      visibleParticipants: [{ userId: '1' }, { userId: '2' }],
      maxTiles: 4
    });
    let resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['1', '2', '3', '4']);

    result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['5', '2', '3', '4'],
      visibleParticipants: [{ userId: '11' }, { userId: '10' }],
      maxTiles: 4
    });
    resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['5', '2', '3', '4']);
  });

  test('returns upto MAX participants even when number of last visible participants and dominant speakers is less than MAX', () => {
    let result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '2'],
      visibleParticipants: [{ userId: '1' }, { userId: '2' }],
      maxTiles: 4
    });
    let resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['1', '2', '3', '4']);

    result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '2'],
      visibleParticipants: [{ userId: '2' }],
      maxTiles: 4
    });
    resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['2', '1', '3', '4']);
  });

  test('returns participants array always containing all dominant speakers', () => {
    const customDominantSpeakers = ['5', '6', '7', '8'];
    const result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: customDominantSpeakers,
      visibleParticipants: [{ userId: '1' }, { userId: '2' }, { userId: '3' }, { userId: '4' }],
      maxTiles: customDominantSpeakers.length
    });
    const resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(customDominantSpeakers);
  });

  test('returns the same participants array if dominant speakers have re-ordered but are same', () => {
    const visibleParticipants = [{ userId: '1' }, { userId: '2' }, { userId: '3' }, { userId: '4' }];
    let result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '2', '3', '4'],
      visibleParticipants,
      maxTiles: 4
    });
    expect(result).toEqual(visibleParticipants);

    result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['3', '2', '1', '4'],
      visibleParticipants,
      maxTiles: 4
    });
    expect(result).toEqual(visibleParticipants);
  });

  test('returns participant only once even when there are duplicates in dominant speakers', () => {
    const result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '1', '3', '7'],
      visibleParticipants: [{ userId: '1' }, { userId: '2' }, { userId: '3' }, { userId: '4' }],
      maxTiles: 4
    });
    const resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['1', '7', '3', '4']);
  });

  test('returns upto max dominant speakers first and then the remaining tiles upto max tiles', () => {
    let result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['5', '7', '8'],
      visibleParticipants: [],
      maxTiles: 8,
      maxDominantSpeakers: 3
    });
    let resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['5', '7', '8', '1', '2', '3', '4', '6']);

    // When maxDominantSpeakers is set higher than actual number of dominant speakers.
    result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '3', '5'],
      visibleParticipants: [],
      maxTiles: 8,
      maxDominantSpeakers: 4
    });
    resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['1', '3', '5', '2', '4', '6', '7', '8']);

    // When maxDominantSpeakers is set higher than maxTiles.
    result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['1', '3', '5'],
      visibleParticipants: [],
      maxTiles: 3,
      maxDominantSpeakers: 4
    });
    resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['1', '3', '5']);
  });

  test('returns upto max dominant speakers first when visible participants is populated', () => {
    const result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['5', '7', '8'],
      visibleParticipants: participants,
      maxTiles: 8,
      maxDominantSpeakers: 3
    });
    const resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['5', '7', '8', '1', '2', '3', '4', '6']);
  });

  test('returns last visible participants without re-ordering', () => {
    let result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['5', '7', '8'],
      visibleParticipants: [{ userId: '3' }, { userId: '5' }, { userId: '8' }, { userId: '4' }, { userId: '1' }],
      maxTiles: 8,
      maxDominantSpeakers: 3
    });
    let resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['7', '5', '8', '3', '4', '1', '2', '6']);

    result = smartDominantSpeakerParticipants({
      participants,
      dominantSpeakers: ['5', '7', '8'],
      visibleParticipants: result,
      maxTiles: 8,
      maxDominantSpeakers: 3
    });
    resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['7', '5', '8', '3', '4', '1', '2', '6']);
  });
});
