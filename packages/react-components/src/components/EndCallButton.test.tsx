// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { EndCallButton } from './EndCallButton';
import { createTestLocale, renderWithLocalization } from './utils/testUtils';
import { screen } from '@testing-library/react';

describe('EndCallButton strings should be localizable and overridable', () => {
  test('Should localize button label', async () => {
    const testLocale = createTestLocale({ endCallButton: { label: Math.random().toString() } });
    renderWithLocalization(<EndCallButton showLabel={true} />, testLocale);
    expect(screen.getByRole('button').textContent).toBe(testLocale.strings.endCallButton.label);
  });

  test('Should override button label with `strings` prop', async () => {
    const testLocale = createTestLocale({ endCallButton: { label: Math.random().toString() } });
    const endCallButtonStrings = { label: Math.random().toString() };
    renderWithLocalization(<EndCallButton showLabel={true} strings={endCallButtonStrings} />, testLocale);
    expect(screen.getByRole('button').textContent).toBe(endCallButtonStrings.label);
  });
});
