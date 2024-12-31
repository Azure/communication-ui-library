// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallContext } from './CallContext';
import { CommunicationIdentifierKind } from '@azure/communication-common';
import { CaptionsInfo } from './CallClientState';

describe('CallContext', () => {
  let callContext: CallContext;
  const userId: CommunicationIdentifierKind = { kind: 'communicationUser', communicationUserId: 'user1' };

  beforeEach(() => {
    callContext = new CallContext(userId);
  });

  describe('processNewCaptionAndNewRealTimeText', () => {
    test('should add new caption if captions array is empty', () => {
      const captions: CaptionsInfo[] = [];
      const newCaption: CaptionsInfo = {
        resultType: 'Final',
        isRealTimeText: false,
        speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user1' } },
        captionText: 'Hello',
        spokenLanguage: 'en-US',
        timestamp: new Date()
      };

      // @ts-ignore
      callContext.processNewCaptionAndNewRealTimeText(captions, newCaption, false);

      expect(captions).toHaveLength(1);
      expect(captions[0]).toEqual(newCaption);
    });

    test('should add new real time text if captions array is empty', () => {
      const captions: CaptionsInfo[] = [];
      const newCaption: CaptionsInfo = {
        resultType: 'Final',
        isRealTimeText: true,
        speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user1' } },
        captionText: 'Hello',
        spokenLanguage: 'en-US',
        timestamp: new Date()
      };

      // @ts-ignore
      callContext.processNewCaptionAndNewRealTimeText(captions, newCaption, true);

      expect(captions).toHaveLength(1);
      expect(captions[0]).toEqual(newCaption);
    });

    test('should add new real time text if it is a new real time text from a new user', () => {
      const captions: CaptionsInfo[] = [
        {
          resultType: 'Final',
          isRealTimeText: false,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user2' } },
          captionText: 'Hello',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        },
        {
          resultType: 'Final',
          isRealTimeText: false,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user2' } },
          captionText: 'Hello',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        },
        {
          resultType: 'Partial',
          isRealTimeText: false,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user3' } },
          captionText: 'Hello',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        },
        {
          resultType: 'Partial',
          isRealTimeText: true,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user1' } },
          captionText: 'Hel',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        },
        {
          resultType: 'Partial',
          isRealTimeText: true,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user0' } },
          captionText: 'Hello world Hel',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        }
      ];
      const newCaption: CaptionsInfo = {
        resultType: 'Partial',
        isRealTimeText: true,
        speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user3' } },
        captionText: 'Hello',
        spokenLanguage: 'en-US',
        timestamp: new Date()
      };

      // @ts-ignore
      callContext.processNewCaptionAndNewRealTimeText(captions, newCaption, true);

      expect(captions).toHaveLength(6);
      expect(captions[5]).toEqual(newCaption);
    });

    test('when receiving a real time text, should try to find the latest partial real time text from the same speaker and update in place', () => {
      const captions: CaptionsInfo[] = [
        {
          resultType: 'Final',
          isRealTimeText: false,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user2' } },
          captionText: 'Hello',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        },
        {
          resultType: 'Final',
          isRealTimeText: false,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user2' } },
          captionText: 'Hello',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        },
        {
          resultType: 'Partial',
          isRealTimeText: false,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user3' } },
          captionText: 'Hello',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        },
        {
          resultType: 'Partial',
          isRealTimeText: true,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user1' } },
          captionText: 'Hel',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        },
        {
          resultType: 'Partial',
          isRealTimeText: true,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user0' } },
          captionText: 'Hello world Hel',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        }
      ];
      const newCaption: CaptionsInfo = {
        resultType: 'Final',
        isRealTimeText: true,
        speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user1' } },
        captionText: 'Hello',
        spokenLanguage: 'en-US',
        timestamp: new Date()
      };

      // @ts-ignore
      callContext.processNewCaptionAndNewRealTimeText(captions, newCaption, true);

      expect(captions).toHaveLength(5);
      expect(captions[3]).toEqual(newCaption);
    });

    test('should add new caption on top of the last partial real time text', () => {
      const captions: CaptionsInfo[] = [
        {
          resultType: 'Final',
          isRealTimeText: false,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user2' } },
          captionText: 'Hello',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        },
        {
          resultType: 'Partial',
          isRealTimeText: true,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user1' } },
          captionText: 'Hel',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        },
        {
          resultType: 'Partial',
          isRealTimeText: true,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user0' } },
          captionText: 'Hello world Hel',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        }
      ];
      const newCaption: CaptionsInfo = {
        resultType: 'Partial',
        isRealTimeText: false,
        speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user3' } },
        captionText: 'Hel',
        spokenLanguage: 'en-US',
        timestamp: new Date()
      };

      // @ts-ignore
      callContext.processNewCaptionAndNewRealTimeText(captions, newCaption, false);

      expect(captions).toHaveLength(4);
      expect(captions[1]).toEqual(newCaption);
    });

    test('when receiving a new captions, should try to find the latest partial caption from the same speaker and update in place', () => {
      const captions: CaptionsInfo[] = [
        {
          resultType: 'Final',
          isRealTimeText: false,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user2' } },
          captionText: 'Hello',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        },
        {
          resultType: 'Partial',
          isRealTimeText: false,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user1' } },
          captionText: 'Hel',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        },
        {
          resultType: 'Partial',
          isRealTimeText: true,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user0' } },
          captionText: 'Hello world Hel',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        }
      ];
      const newCaption: CaptionsInfo = {
        resultType: 'Partial',
        isRealTimeText: false,
        speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user1' } },
        captionText: 'Hello',
        spokenLanguage: 'en-US',
        timestamp: new Date()
      };

      // @ts-ignore
      callContext.processNewCaptionAndNewRealTimeText(captions, newCaption, false);

      expect(captions).toHaveLength(3);
      expect(captions[1]).toEqual(newCaption);
    });

    test('when receiving a new captions and cannot find the latest partial caption from the same speaker, should append at the bottom', () => {
      const captions: CaptionsInfo[] = [
        {
          resultType: 'Final',
          isRealTimeText: false,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user2' } },
          captionText: 'Hello',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        },
        {
          resultType: 'Final',
          isRealTimeText: false,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user1' } },
          captionText: 'Hel',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        },
        {
          resultType: 'Partial',
          isRealTimeText: true,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user0' } },
          captionText: 'Hello world Hel',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        }
      ];
      const newCaption: CaptionsInfo = {
        resultType: 'Partial',
        isRealTimeText: false,
        speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user1' } },
        captionText: 'Hel',
        spokenLanguage: 'en-US',
        timestamp: new Date()
      };

      // @ts-ignore
      callContext.processNewCaptionAndNewRealTimeText(captions, newCaption, false);

      expect(captions).toHaveLength(4);
      expect(captions[2]).toEqual(newCaption);
    });

    test('when receiving 2 partial captions at the same time, should ignore the interjector', () => {
      const captions: CaptionsInfo[] = [
        {
          resultType: 'Final',
          isRealTimeText: false,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user2' } },
          captionText: 'Hello',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        },
        {
          resultType: 'Partial',
          isRealTimeText: false,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user1' } },
          captionText: 'I should not be replaced',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        },
        {
          resultType: 'Partial',
          isRealTimeText: true,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user0' } },
          captionText: 'Hello world Hel',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        }
      ];
      const newCaption: CaptionsInfo = {
        resultType: 'Partial',
        isRealTimeText: false,
        speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user0' } },
        captionText: 'Hel',
        spokenLanguage: 'en-US',
        timestamp: new Date()
      };

      // @ts-ignore
      callContext.processNewCaptionAndNewRealTimeText(captions, newCaption, false);

      expect(captions).toHaveLength(3);
      expect(captions[1]?.captionText).toEqual('I should not be replaced');
    });

    test('when receiving 2 partial real time text at the same time, should append them based on the order they come in', () => {
      const captions: CaptionsInfo[] = [
        {
          resultType: 'Final',
          isRealTimeText: false,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user2' } },
          captionText: 'Hello',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        },
        {
          resultType: 'Partial',
          isRealTimeText: false,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user1' } },
          captionText: 'I should not be replaced',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        },
        {
          resultType: 'Partial',
          isRealTimeText: true,
          speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user0' } },
          captionText: 'Hello world Hel',
          spokenLanguage: 'en-US',
          timestamp: new Date()
        }
      ];
      const newCaption: CaptionsInfo = {
        resultType: 'Partial',
        isRealTimeText: true,
        speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user1' } },
        captionText: 'Hel',
        spokenLanguage: 'en-US',
        timestamp: new Date()
      };

      // @ts-ignore
      callContext.processNewCaptionAndNewRealTimeText(captions, newCaption, true);

      const newCaption2: CaptionsInfo = {
        resultType: 'Partial',
        isRealTimeText: true,
        speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user2' } },
        captionText: 'Hel',
        spokenLanguage: 'en-US',
        timestamp: new Date()
      };

      // @ts-ignore
      callContext.processNewCaptionAndNewRealTimeText(captions, newCaption2, true);

      expect(captions).toHaveLength(5);
      expect(captions[3]).toEqual(newCaption);
      expect(captions[4]).toEqual(newCaption2);
    });

    test('should remove the oldest caption if the array length exceeds 50', () => {
      const captions: CaptionsInfo[] = Array.from({ length: 50 }, (_, i) => ({
        resultType: 'Final',
        isRealTimeText: false,
        speaker: { identifier: { kind: 'communicationUser', communicationUserId: `user${i}` } },
        captionText: `Text ${i}`,
        timestamp: new Date(),
        spokenLanguage: 'en-US'
      }));
      const newCaption: CaptionsInfo = {
        resultType: 'Final',
        isRealTimeText: false,
        speaker: { identifier: { kind: 'communicationUser', communicationUserId: 'user51' } },
        captionText: 'Hello',
        spokenLanguage: 'en-US',
        timestamp: new Date()
      };

      // @ts-ignore
      callContext.processNewCaptionAndNewRealTimeText(captions, newCaption, false);

      expect(captions).toHaveLength(50);
      expect(captions[49]).toEqual(newCaption);
    });
  });
});
