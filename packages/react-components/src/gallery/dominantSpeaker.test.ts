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
    let result = smartDominantSpeakerParticipants(participants.slice(0, 3), ['1', '3', '5', '7']);
    expect(result.length).toBe(3);

    result = smartDominantSpeakerParticipants(participants.slice(0, 4), ['1', '3', '5', '7']);
    expect(result.length).toBe(4);
  });

  test('returns no more than the MAX participants', () => {
    let result = smartDominantSpeakerParticipants(
      participants,
      ['1', '3', '5', '7'],
      [{ userId: '1' }, { userId: '2' }, { userId: '3' }, { userId: '4' }],
      4
    );
    expect(result.length).toBe(4);

    result = smartDominantSpeakerParticipants(
      participants,
      ['1', '3', '5', '7'],
      [{ userId: '1' }, { userId: '2' }, { userId: '3' }, { userId: '4' }],
      5
    );
    expect(result.length).toBe(5);
  });

  test('returns participants even when there are no visible participants', () => {
    const result = smartDominantSpeakerParticipants(participants, ['1', '3', '5', '7'], [], 4);
    expect(result.length).toBe(4);
  });

  test('returns participants array replacing non-dominant speakers with dominant speakers', () => {
    const result = smartDominantSpeakerParticipants(
      participants,
      ['1', '3', '5', '7'],
      [{ userId: '1' }, { userId: '2' }, { userId: '3' }, { userId: '4' }],
      4
    );
    const resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['1', '5', '3', '7']);
  });

  test('maintains the ordering of new participants to match last visible participants', () => {
    let result = smartDominantSpeakerParticipants(
      participants,
      ['1', '2', '3', '4'],
      [{ userId: '3' }, { userId: '4' }],
      4
    );
    let resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['3', '4', '1', '2']);

    result = smartDominantSpeakerParticipants(
      participants,
      ['1', '2', '3', '4'],
      [{ userId: '2' }, { userId: '1' }],
      4
    );
    resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['2', '1', '3', '4']);
  });

  test('returns new dominant speakers when a dominant speaker is replaced', () => {
    let result = smartDominantSpeakerParticipants(
      participants,
      ['1', '2', '3', '4'],
      [{ userId: '1' }, { userId: '2' }],
      4
    );
    let resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['1', '2', '3', '4']);

    result = smartDominantSpeakerParticipants(
      participants,
      ['5', '2', '3', '4'],
      [{ userId: '11' }, { userId: '10' }],
      4
    );
    resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['5', '2', '3', '4']);
  });

  test('returns upto MAX participants even when number of last visible participants and dominant speakers is less than MAX', () => {
    let result = smartDominantSpeakerParticipants(participants, ['1', '2'], [{ userId: '1' }, { userId: '2' }], 4);
    let resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['1', '2', '3', '4']);

    result = smartDominantSpeakerParticipants(participants, ['1', '2'], [{ userId: '2' }], 4);
    resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(['2', '1', '3', '4']);
  });

  test('returns participants array always containing all dominant speakers', () => {
    const customDominantSpeakers = ['5', '6', '7', '8'];
    const result = smartDominantSpeakerParticipants(
      participants,
      customDominantSpeakers,
      [{ userId: '1' }, { userId: '2' }, { userId: '3' }, { userId: '4' }],
      customDominantSpeakers.length
    );
    const resultUserIds = result.flatMap((p) => p.userId);
    expect(resultUserIds).toEqual(customDominantSpeakers);
  });
});
