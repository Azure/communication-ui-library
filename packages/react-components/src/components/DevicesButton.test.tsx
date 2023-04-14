// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { DevicesButton, DevicesButtonProps } from './DevicesButton';
import { createTestLocale } from './utils/testUtils';
import { render, screen } from '@testing-library/react';
import { setIconOptions } from '@fluentui/react';
import { LocalizationProvider } from '../localization';
// Suppress icon warnings for tests. Icons are fetched from CDN which we do not want to perform during tests.
// More information: https://github.com/microsoft/fluentui/wiki/Using-icons#test-scenarios
setIconOptions({
  disableWarnings: true
});

const mockProps: DevicesButtonProps = {
  cameras: [{ id: 'camera1', name: 'testCamera' }],
  selectedCamera: { id: 'camera1', name: 'testCamera' },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSelectCamera: async () => {},
  microphones: [{ id: 'microphone1', name: 'testMicrophone' }],
  selectedMicrophone: { id: 'microphone1', name: 'testMicrophone' },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSelectMicrophone: async () => {},
  speakers: [{ id: 'speaker1', name: 'testMicrophone' }],
  selectedSpeaker: { id: 'microphone1', name: 'testMicrophone' },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSelectSpeaker: async () => {}
};

describe('DevicesButton strings should be localizable and overridable', () => {
  test('Should localize button label', async () => {
    const testLocale = createTestLocale({ devicesButton: { label: Math.random().toString() } });
    render(
      <LocalizationProvider locale={testLocale}>
        <DevicesButton showLabel={true} {...mockProps} />
      </LocalizationProvider>
    );
    expect(screen.getByRole('button').textContent).toBe(testLocale.strings.devicesButton.label);
  });

  test('Should override button label with `strings` prop', async () => {
    const testLocale = createTestLocale({ devicesButton: { label: Math.random().toString() } });
    const devicesButtonStrings = { label: Math.random().toString() };
    render(
      <LocalizationProvider locale={testLocale}>
        <DevicesButton showLabel={true} {...mockProps} strings={devicesButtonStrings} />
      </LocalizationProvider>
    );
    expect(screen.getByRole('button').textContent).toBe(devicesButtonStrings.label);
  });
});
