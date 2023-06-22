// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { RaiseHandButton } from './RaiseHandButton';
import { createTestLocale, renderWithLocalization } from './utils/testUtils';
import { registerIcons } from '@fluentui/react';
import { screen } from '@testing-library/react';

describe('RaiseHandButton strings should be localizable and overridable', () => {
  beforeEach(() => {
    registerIcons({
      icons: {
        controlbuttonraisehand: <></>,
        controlbuttonlowerhand: <></>
      }
    });
  });

  test('Should localize button label', async () => {
    const testLocale = createTestLocale({
      raiseHandButton: { offLabel: Math.random().toString(), onLabel: Math.random().toString() }
    });
    renderWithLocalization(<RaiseHandButton showLabel={true} />, testLocale);
    expect(screen.getByRole('button').textContent).toBe(testLocale.strings.raiseHandButton.offLabel);
    expect(screen.getByRole('button').setAttribute('checked', 'true'));
    expect(screen.getByRole('button').textContent).toBe(testLocale.strings.raiseHandButton.onLabel);
  });

  test('Should override button label with `strings` prop', async () => {
    const testLocale = createTestLocale({
      raiseHandButton: { offLabel: Math.random().toString(), onLabel: Math.random().toString() }
    });
    const raiseHandButtonStrings = { offLabel: Math.random().toString(), onLabel: Math.random().toString() };
    renderWithLocalization(<RaiseHandButton showLabel={true} strings={raiseHandButtonStrings} />, testLocale);
    expect(screen.getByRole('button').textContent).toBe(testLocale.strings.raiseHandButton.offLabel);
    expect(screen.getByRole('button').setAttribute('checked', 'true'));
    expect(screen.getByRole('button').textContent).toBe(testLocale.strings.raiseHandButton.onLabel);
  });
});
