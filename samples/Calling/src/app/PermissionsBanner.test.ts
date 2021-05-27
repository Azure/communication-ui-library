// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CAMERA_AND_MICROPHONE_PERMISSION_DENIED,
  CAMERA_PERMISSION_DENIED,
  getPermissionsBannerMessage,
  MICROPHONE_PERMISSION_DENIED
} from './PermissionsBanner';

describe('permissions banner', () => {
  test('warns about camera permission when no permission and banner is not dismissed', async () => {
    const message = getPermissionsBannerMessage(false, undefined, false, false);
    expect(message).toBe(CAMERA_PERMISSION_DENIED);
  });

  test('does not warn about camera permission when no permission but banner is dismissed', async () => {
    const message = getPermissionsBannerMessage(false, undefined, true, false);
    expect(message).toBe('');
  });

  test('does not warn about camera permission when permission is yes and banner is not dismissed', async () => {
    const message = getPermissionsBannerMessage(true, undefined, false, false);
    expect(message).toBe('');
  });

  test('does not warn about camera permission when permission is yes and banner is dismissed', async () => {
    const message = getPermissionsBannerMessage(true, undefined, true, false);
    expect(message).toBe('');
  });

  test('warns about microphone permission when no permission and banner is not dismissed', async () => {
    const message = getPermissionsBannerMessage(undefined, false, false, false);
    expect(message).toBe(MICROPHONE_PERMISSION_DENIED);
  });

  test('does not warn about microphone permission when no permission but banner is dismissed', async () => {
    const message = getPermissionsBannerMessage(undefined, false, false, true);
    expect(message).toBe('');
  });

  test('does not warn about microphone permission when permission is yes and banner is not dismissed', async () => {
    const message = getPermissionsBannerMessage(undefined, true, false, false);
    expect(message).toBe('');
  });

  test('does not warn about microphone permission when permission is yes and banner is dismissed', async () => {
    const message = getPermissionsBannerMessage(undefined, true, false, true);
    expect(message).toBe('');
  });

  test('warns about camera and microphone permission when no permission and banner is not dismissed', async () => {
    const message = getPermissionsBannerMessage(false, false, false, false);
    expect(message).toBe(CAMERA_AND_MICROPHONE_PERMISSION_DENIED);
  });

  test('does not warn about camera and microphone permission when no permission but banner is dismissed', async () => {
    const message = getPermissionsBannerMessage(false, false, true, true);
    expect(message).toBe('');
  });

  test('does not warn about camera+microphone permission when permission is yes and banner not dismissed', async () => {
    const message = getPermissionsBannerMessage(true, true, false, false);
    expect(message).toBe('');
  });

  test('does not warn about camera+microphone permission when permission is yes and banner is dismissed', async () => {
    const message = getPermissionsBannerMessage(true, true, true, true);
    expect(message).toBe('');
  });

  test('does not warn about anything when permission ask is still pending', async () => {
    const message = getPermissionsBannerMessage(undefined, undefined, false, false);
    expect(message).toBe('');
  });
});
