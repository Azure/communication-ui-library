// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ScreenShareButton } from './ScreenShareButton';
import { createTestLocale, renderWithLocalization } from './utils/testUtils';
import { registerIcons } from '@fluentui/react';
import { screen } from '@testing-library/react';

describe('ScreenShareButton strings should be localizable and overridable', () => {
  beforeEach(() => {
    registerIcons({
      icons: {
        controlbuttonscreensharestart: <></>,
        controlbuttonscreensharestop: <></>
      }
    });
  });
  test('Should localize button label', async () => {
    const testLocale = createTestLocale({
      screenShareButton: { offLabel: Math.random().toString(), onLabel: Math.random().toString() }
    });
    const { rerender } = renderWithLocalization(<ScreenShareButton showLabel={true} />, testLocale);
    expect(screen.getByRole('button').textContent).toBe(testLocale.strings.screenShareButton.offLabel);

    rerender(<ScreenShareButton showLabel={true} checked={true} />);
    expect(screen.getByRole('button').textContent).toBe(testLocale.strings.screenShareButton.onLabel);
  });

  test('Should override button label with `strings` prop', async () => {
    const testLocale = createTestLocale({
      screenShareButton: { offLabel: Math.random().toString(), onLabel: Math.random().toString() }
    });
    const screenShareButtonStrings = { offLabel: Math.random().toString(), onLabel: Math.random().toString() };
    const { rerender } = renderWithLocalization(
      <ScreenShareButton showLabel={true} strings={screenShareButtonStrings} />,
      testLocale
    );
    expect(screen.getByRole('button').textContent).toBe(screenShareButtonStrings.offLabel);

    rerender(<ScreenShareButton showLabel={true} strings={screenShareButtonStrings} />);
    expect(screen.getByRole('button').textContent).toBe(screenShareButtonStrings.offLabel);
  });
});
