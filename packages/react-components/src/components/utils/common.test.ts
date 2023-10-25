// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { _isParticipantStateCallingOrHold } from './common';

// Licensed under the MIT License.
describe('_isParticipantStateCallingOrHold', () => {
  test('should return true if participant Idle', () => {
    expect(_isParticipantStateCallingOrHold('Idle')).toBe(true);
  });
  test('should return true if participant Connecting', () => {
    expect(_isParticipantStateCallingOrHold('Connecting')).toBe(true);
  });
  test('should return true if participant Ringing', () => {
    expect(_isParticipantStateCallingOrHold('Ringing')).toBe(true);
  });
  test('should return true if participant EarlyMedia', () => {
    expect(_isParticipantStateCallingOrHold('EarlyMedia')).toBe(true);
  });
  test('should return true if participant Hold', () => {
    expect(_isParticipantStateCallingOrHold('Hold')).toBe(true);
  });
  test('should return true if participant Connected', () => {
    expect(_isParticipantStateCallingOrHold('Connected')).toBe(false);
  });
  test('should return true if participant Disconnected', () => {
    expect(_isParticipantStateCallingOrHold('Disconnected')).toBe(false);
  });
  test('should return true if participant InLobby', () => {
    expect(_isParticipantStateCallingOrHold('InLobby')).toBe(false);
  });
});
