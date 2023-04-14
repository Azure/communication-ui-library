// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { MicrophoneButton } from './MicrophoneButton';
import { createTestLocale, renderWithLocalization } from './utils/testUtils';
import { registerIcons } from '@fluentui/react';
import { screen } from '@testing-library/react';

describe('MicrophoneButton strings should be localizable and overridable', () => {
  beforeAll(() => {
    registerIcons({
      icons: {
        controlbuttonmicoff: <></>,
        chevrondown: <></>,
        controlbuttonmicon: <></>
      }
    });
  });
  test('Should localize button label', async () => {
    const testLocale = createTestLocale({
      microphoneButton: { offLabel: Math.random().toString(), onLabel: Math.random().toString() }
    });
    const { rerender } = renderWithLocalization(<MicrophoneButton showLabel={true} />, testLocale);
    expect(screen.getByRole('button').textContent).toBe(testLocale.strings.microphoneButton.offLabel);

    rerender(<MicrophoneButton showLabel={true} checked={true} />);
    expect(screen.getByRole('button').textContent).toBe(testLocale.strings.microphoneButton.onLabel);
  });

  test('Should override button label with `strings` prop', async () => {
    const testLocale = createTestLocale({
      microphoneButton: { offLabel: Math.random().toString(), onLabel: Math.random().toString() }
    });
    const microphoneButtonStrings = { offLabel: Math.random().toString(), onLabel: Math.random().toString() };
    const { rerender } = renderWithLocalization(
      <MicrophoneButton showLabel={true} strings={microphoneButtonStrings} />,
      testLocale
    );
    expect(screen.getByRole('button').textContent).toBe(microphoneButtonStrings.offLabel);

    rerender(<MicrophoneButton showLabel={true} checked={true} strings={microphoneButtonStrings} />);
    expect(screen.getByRole('button').textContent).toBe(microphoneButtonStrings.onLabel);
  });
});
