// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(calling-sounds) */
import { CommunicationIdentifier } from '@azure/communication-common';
import { createMockCall } from '../../CallComposite/adapter/TestUtils';
/* @conditional-compile-remove(calling-sounds) */
import { CallingSounds } from './CallAdapter';
/* @conditional-compile-remove(calling-sounds) */
import { CallingSoundSubscriber } from './CallingSoundSubscriber';

const audioMocks = {
  Audio: {
    play: jest.fn(() => Promise.resolve()),
    pause: jest.fn()
  }
};

global.Audio = jest.fn().mockImplementation(() => ({
  play: audioMocks.Audio.play,
  pause: audioMocks.Audio.pause
}));

describe('Calling sound subscriber tests', () => {
  test('test to fulfill no empty runners', () => {
    const mockCall = createMockCall();
    expect(mockCall).toBeDefined();
  });
  /* @conditional-compile-remove(calling-sounds) */
  test('should play ringing sound when call is ringing', () => {
    const callee: CommunicationIdentifier[] = [{ communicationUserId: '8:orgid:30138458-6b40-40d6-8c29-6b127031581a' }];
    const call = createMockCall();
    const sounds: CallingSounds = {
      callRinging: { url: 'test/url/ringing' },
      callEnded: { url: 'test/url/ended' }
    };
    const soundSubscriber = new CallingSoundSubscriber(call, callee, sounds);
    expect(soundSubscriber).toBeDefined();
    call.testHelperSetCallState('Ringing');
    expect(audioMocks.Audio.play).toHaveBeenCalled();
    call.testHelperSetCallState('Connected');
    expect(audioMocks.Audio.pause).toHaveBeenCalled();
    call.testHelperSetCallState('Disconnected');
    expect(audioMocks.Audio.play).toHaveBeenCalled();
  });

  /* @conditional-compile-remove(calling-sounds) */
  test('should play ended sound when call is ended', () => {
    const callee: CommunicationIdentifier[] = [{ communicationUserId: '8:orgid:30138458-6b40-40d6-8c29-6b127031581a' }];
    const call = createMockCall();
    const sounds: CallingSounds = {
      callRinging: { url: 'test/url/ringing' },
      callEnded: { url: 'test/url/ended' }
    };
    const soundSubscriber = new CallingSoundSubscriber(call, callee, sounds);
    expect(soundSubscriber).toBeDefined();
    call.testHelperSetCallState('Disconnected');
    expect(audioMocks.Audio.play).toHaveBeenCalled();
  });

  /* @conditional-compile-remove(calling-sounds) */
  test('should not play sound when call is made to PSTN user', () => {
    const callee: CommunicationIdentifier[] = [{ phoneNumber: '+14045554444' }];
    const call = createMockCall();
    const sounds: CallingSounds = {
      callRinging: { url: 'test/url/ringing' },
      callEnded: { url: 'test/url/ended' }
    };
    const soundSubscriber = new CallingSoundSubscriber(call, callee, sounds);
    expect(soundSubscriber).toBeDefined();
    call.testHelperSetCallState('Ringing');
    expect(audioMocks.Audio.play).not.toHaveBeenCalled();
  });

  /* @conditional-compile-remove(calling-sounds) */
  test('should play busy sound when call is rejected', () => {
    const callee: CommunicationIdentifier[] = [{ phoneNumber: '+14045554444' }];
    const call = createMockCall();
    const sounds: CallingSounds = {
      callBusy: { url: 'test/url/busy' }
    };
    const soundSubscriber = new CallingSoundSubscriber(call, callee, sounds);
    expect(soundSubscriber).toBeDefined();
    call.testHelperSetCallEndReason({
      code: 603,
      subCode: 0,
      /* @conditional-compile-remove(calling-beta-sdk) */ resultCategories: []
    });
    expect(audioMocks.Audio.play).not.toHaveBeenCalled();
  });
});
