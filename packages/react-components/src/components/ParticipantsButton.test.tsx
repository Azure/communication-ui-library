// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ParticipantsButton } from './ParticipantsButton';
import { createTestLocale, renderWithLocalization } from './utils/testUtils';
import { setIconOptions } from '@fluentui/react';
import { screen } from '@testing-library/react';

// Suppress icon warnings for tests. Icons are fetched from CDN which we do not want to perform during tests.
// More information: https://github.com/microsoft/fluentui/wiki/Using-icons#test-scenarios
setIconOptions({
  disableWarnings: true
});

describe('ParticipantsButton strings should be localizable and overridable', () => {
  test('Should localize button label', async () => {
    const testLocale = createTestLocale({ participantsButton: { label: Math.random().toString() } });
    renderWithLocalization(<ParticipantsButton showLabel={true} participants={[]} />, testLocale);
    expect(screen.getByRole('button').textContent).toBe(testLocale.strings.participantsButton.label);
  });

  test('Should override button label with `strings` prop', async () => {
    const testLocale = createTestLocale({ participantsButton: { label: Math.random().toString() } });
    const participantButtonStrings = { label: Math.random().toString() };
    renderWithLocalization(
      <ParticipantsButton showLabel={true} participants={[]} strings={participantButtonStrings} />,
      testLocale
    );
    expect(screen.getByRole('button').textContent).toBe(participantButtonStrings.label);
  });
});
