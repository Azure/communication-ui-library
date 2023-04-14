// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { EndCallButton } from './EndCallButton';
import { createTestLocale } from './utils/testUtils';
import { render, screen } from '@testing-library/react';
import { LocalizationProvider } from '../localization';

describe('EndCallButton strings should be localizable and overridable', () => {
  test('Should localize button label', async () => {
    const testLocale = createTestLocale({ endCallButton: { label: Math.random().toString() } });
    render(
      <LocalizationProvider locale={testLocale}>
        <EndCallButton showLabel={true} />
      </LocalizationProvider>
    );
    expect(screen.getByRole('button').textContent).toBe(testLocale.strings.endCallButton.label);
  });

  test('Should override button label with `strings` prop', async () => {
    const testLocale = createTestLocale({ endCallButton: { label: Math.random().toString() } });
    const endCallButtonStrings = { label: Math.random().toString() };
    render(
      <LocalizationProvider locale={testLocale}>
        <EndCallButton showLabel={true} strings={endCallButtonStrings} />
      </LocalizationProvider>
    );
    expect(screen.getByRole('button').textContent).toBe(endCallButtonStrings.label);
  });
});
