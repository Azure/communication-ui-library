// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* @conditional-compile-remove(rtt) */
import { CaptionsInformation, RealTimeTextInformation } from '../CaptionsBanner';
/* @conditional-compile-remove(rtt) */
import { _formatPhoneNumber } from './formatPhoneNumber';
/* @conditional-compile-remove(rtt) */
import { sortCaptionsAndRealTimeTexts } from './sortCaptionsAndRealTimeTexts';
/* @conditional-compile-remove(rtt) */
const mockCaptions: CaptionsInformation[] = [
  {
    id: '1',
    displayName: 'John Doe',
    captionText: 'Hello',
    createdTimeStamp: new Date('2021-09-01T00:00:01Z')
  },
  {
    id: '2',
    displayName: 'John Doe',
    captionText: 'Hello there ',
    createdTimeStamp: new Date('2021-09-01T00:00:00Z')
  },
  {
    id: '3',
    displayName: 'John Doe',
    captionText: 'Hi',
    createdTimeStamp: new Date('2021-09-01T00:00:02Z')
  },
  {
    id: '4',
    displayName: 'John Doe',
    captionText: 'Hello there ',
    createdTimeStamp: new Date('2021-09-01T00:00:09Z')
  },
  {
    id: '5',
    displayName: 'John Doe',
    captionText: 'Hello there ',
    createdTimeStamp: new Date('2021-09-01T00:00:05Z')
  }
];
/* @conditional-compile-remove(rtt) */
const mockRealTimeTexts: RealTimeTextInformation[] = [
  {
    id: 11,
    displayName: 'John Doe',
    message: 'Hello',
    finalizedTimeStamp: new Date('2021-09-01T00:00:03Z'),
    isTyping: false
  },
  {
    id: 22,
    displayName: 'John Doe',
    message: 'Hello there ',
    finalizedTimeStamp: new Date('2021-09-01T00:00:10Z'),
    isTyping: false
  },
  {
    id: 33,
    displayName: 'John Doe',
    message: 'Hi',
    finalizedTimeStamp: new Date('2021-09-01T00:00:04Z'),
    isTyping: false
  }
];
/* @conditional-compile-remove(rtt) */
describe('Sort Captions and Real Time Text List', () => {
  test('if only using captions, captions should be sorted by created timestamp', () => {
    const result = [
      {
        id: '2',
        displayName: 'John Doe',
        captionText: 'Hello there ',
        createdTimeStamp: new Date('2021-09-01T00:00:00Z')
      },
      {
        id: '1',
        displayName: 'John Doe',
        captionText: 'Hello',
        createdTimeStamp: new Date('2021-09-01T00:00:01Z')
      },

      {
        id: '3',
        displayName: 'John Doe',
        captionText: 'Hi',
        createdTimeStamp: new Date('2021-09-01T00:00:02Z')
      },
      {
        id: '5',
        displayName: 'John Doe',
        captionText: 'Hello there ',
        createdTimeStamp: new Date('2021-09-01T00:00:05Z')
      },
      {
        id: '4',
        displayName: 'John Doe',
        captionText: 'Hello there ',
        createdTimeStamp: new Date('2021-09-01T00:00:09Z')
      }
    ];
    expect(sortCaptionsAndRealTimeTexts(mockCaptions, [])).toEqual(result);
  });

  test('if only using RTT, RTT should be sorted by last updated time stamp', () => {
    const result = [
      {
        id: 11,
        displayName: 'John Doe',
        message: 'Hello',
        finalizedTimeStamp: new Date('2021-09-01T00:00:03Z'),
        isTyping: false
      },
      {
        id: 33,
        displayName: 'John Doe',
        message: 'Hi',
        finalizedTimeStamp: new Date('2021-09-01T00:00:04Z'),
        isTyping: false
      },
      {
        id: 22,
        displayName: 'John Doe',
        message: 'Hello there ',
        finalizedTimeStamp: new Date('2021-09-01T00:00:10Z'),
        isTyping: false
      }
    ];
    expect(sortCaptionsAndRealTimeTexts([], mockRealTimeTexts)).toEqual(result);
  });

  test('when using both, captions and RTT should be compared with captions created timestamp and rtts last updated timestamp', () => {
    const result = [
      {
        id: '2',
        displayName: 'John Doe',
        captionText: 'Hello there ',
        createdTimeStamp: new Date('2021-09-01T00:00:00Z')
      },
      {
        id: '1',
        displayName: 'John Doe',
        captionText: 'Hello',
        createdTimeStamp: new Date('2021-09-01T00:00:01Z')
      },

      {
        id: '3',
        displayName: 'John Doe',
        captionText: 'Hi',
        createdTimeStamp: new Date('2021-09-01T00:00:02Z')
      },
      {
        id: 11,
        displayName: 'John Doe',
        message: 'Hello',
        finalizedTimeStamp: new Date('2021-09-01T00:00:03Z'),
        isTyping: false
      },
      {
        id: 33,
        displayName: 'John Doe',
        message: 'Hi',
        finalizedTimeStamp: new Date('2021-09-01T00:00:04Z'),
        isTyping: false
      },
      {
        id: '5',
        displayName: 'John Doe',
        captionText: 'Hello there ',
        createdTimeStamp: new Date('2021-09-01T00:00:05Z')
      },
      {
        id: '4',
        displayName: 'John Doe',
        captionText: 'Hello there ',
        createdTimeStamp: new Date('2021-09-01T00:00:09Z')
      },
      {
        id: 22,
        displayName: 'John Doe',
        message: 'Hello there ',
        finalizedTimeStamp: new Date('2021-09-01T00:00:10Z'),
        isTyping: false
      }
    ];
    expect(sortCaptionsAndRealTimeTexts(mockCaptions, mockRealTimeTexts)).toEqual(result);
  });
});

// for cc
describe('Place holder test for cc', () => {
  test('place holder', async () => {
    expect(true).toEqual(true);
  });
});
