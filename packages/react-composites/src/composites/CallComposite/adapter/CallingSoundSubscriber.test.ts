// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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
  test('should play ringing sound when call is ringing', () => {
    const locator = { participantIds: ['8:orgid:30138458-6b40-40d6-8c29-6b127031581a'] };
    const call = createMockCall();
    const sounds: CallingSounds = {
      callRinging: { path: 'test/path/ringing' },
      callEnded: { path: 'test/path/ended' }
    };
    const soundSubscriber = new CallingSoundSubscriber(call, locator, sounds);
    expect(soundSubscriber).toBeDefined();
    call.testHelperSetCallState('Ringing');
    expect(audioMocks.Audio.play).toHaveBeenCalled();
    call.testHelperSetCallState('Connected');
    expect(audioMocks.Audio.pause).toHaveBeenCalled();
    call.testHelperSetCallState('Disconnected');
    expect(audioMocks.Audio.play).toHaveBeenCalled();
  });

  test('should play ended sound when call is ended', () => {
    const locator = { participantIds: ['8:orgid:30138458-6b40-40d6-8c29-6b127031581a'] };
    const call = createMockCall();
    const sounds: CallingSounds = {
      callRinging: { path: 'test/path/ringing' },
      callEnded: { path: 'test/path/ended' }
    };
    const soundSubscriber = new CallingSoundSubscriber(call, locator, sounds);
    expect(soundSubscriber).toBeDefined();
    call.testHelperSetCallState('Disconnected');
    expect(audioMocks.Audio.play).toHaveBeenCalled();
  });
});
