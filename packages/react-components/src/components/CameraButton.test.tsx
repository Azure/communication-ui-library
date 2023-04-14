// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CameraButton } from './CameraButton';
import { createTestLocale } from './utils/testUtils';
import { registerIcons } from '@fluentui/react';
import { LocalizationProvider } from '../localization';
import { render, screen } from '@testing-library/react';

describe('CameraButton strings should be localizable and overridable', () => {
  beforeEach(() => {
    registerIcons({
      icons: {
        controlbuttoncameraoff: <></>,
        chevrondown: <></>,
        controlbuttoncameraon: <></>
      }
    });
  });
  test('Should localize button label ', async () => {
    const testLocale = createTestLocale({
      cameraButton: { offLabel: Math.random().toString(), onLabel: Math.random().toString() }
    });
    const { rerender } = render(
      <LocalizationProvider locale={testLocale}>
        <CameraButton showLabel={true} />
      </LocalizationProvider>
    );
    expect(screen.getByRole('button').textContent).toBe(testLocale.strings.cameraButton.offLabel);

    rerender(
      <LocalizationProvider locale={testLocale}>
        <CameraButton showLabel={true} checked={true} />
      </LocalizationProvider>
    );
    expect(screen.getByRole('button').textContent).toBe(testLocale.strings.cameraButton.onLabel);
  });

  test('Should override button label with `strings` prop', async () => {
    const testLocale = createTestLocale({
      cameraButton: { offLabel: Math.random().toString(), onLabel: Math.random().toString() }
    });
    const cameraButtonStrings = { offLabel: Math.random().toString(), onLabel: Math.random().toString() };
    const { rerender } = render(
      <LocalizationProvider locale={testLocale}>
        <CameraButton showLabel={true} strings={cameraButtonStrings} />
      </LocalizationProvider>
    );
    expect(screen.getByRole('button').textContent).toBe(cameraButtonStrings.offLabel);

    rerender(
      <LocalizationProvider locale={testLocale}>
        <CameraButton showLabel={true} checked={true} strings={cameraButtonStrings} />
      </LocalizationProvider>
    );
    expect(screen.getByRole('button').textContent).toBe(cameraButtonStrings.onLabel);
  });
});
