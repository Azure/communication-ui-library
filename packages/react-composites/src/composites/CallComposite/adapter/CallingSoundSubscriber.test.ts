// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommunicationIdentifier } from '@azure/communication-common';
import { createMockCall } from '../../CallComposite/adapter/TestUtils';
import { CallingSounds } from './CallAdapter';
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
    call.testHelperSetCallEndReason({
      code: 0,
      subCode: 0,
      /* @conditional-compile-remove(calling-beta-sdk) */ resultCategories: ['Success'],
      /* @conditional-compile-remove(calling-beta-sdk) */ message: ''
    });
    expect(audioMocks.Audio.play).toHaveBeenCalled();
  });

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
      /* @conditional-compile-remove(calling-beta-sdk) */ resultCategories: [],
      /* @conditional-compile-remove(calling-beta-sdk) */ message: ''
    });
    expect(audioMocks.Audio.play).not.toHaveBeenCalled();
  });
  test('should not play sound when call is ended because of a succesful transfer', () => {
    const callee: CommunicationIdentifier[] = [{ phoneNumber: '+14045554444' }];
    const call = createMockCall();
    const sounds: CallingSounds = {
      callEnded: { url: 'test/url/ended' }
    };
    const soundSubscriber = new CallingSoundSubscriber(call, callee, sounds);
    expect(soundSubscriber).toBeDefined();
    call.testHelperSetCallEndReason({
      code: 0,
      subCode: 7015,
      /* @conditional-compile-remove(calling-beta-sdk) */ resultCategories: ['Success'],
      /* @conditional-compile-remove(calling-beta-sdk) */ message: ''
    });
    call.testHelperSetCallState('Disconnected');
    expect(audioMocks.Audio.play).not.toHaveBeenCalled();
  });
});
