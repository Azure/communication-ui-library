// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CameraButton } from './CameraButton';
import { createTestLocale, renderWithLocalization } from './utils/testUtils';
import { registerIcons } from '@fluentui/react';
import { screen } from '@testing-library/react';

describe('CameraButton strings should be localizable and overridable', () => {
  beforeAll(() => {
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
    const { rerender } = renderWithLocalization(<CameraButton showLabel={true} />, testLocale);
    expect(screen.getByRole('button').textContent).toBe(testLocale.strings.cameraButton.offLabel);

    rerender(<CameraButton showLabel={true} checked={true} />);
    expect(screen.getByRole('button').textContent).toBe(testLocale.strings.cameraButton.onLabel);
  });

  test('Should override button label with `strings` prop', async () => {
    const testLocale = createTestLocale({
      cameraButton: { offLabel: Math.random().toString(), onLabel: Math.random().toString() }
    });
    const cameraButtonStrings = { offLabel: Math.random().toString(), onLabel: Math.random().toString() };
    const { rerender } = renderWithLocalization(
      <CameraButton showLabel={true} strings={cameraButtonStrings} />,
      testLocale
    );
    expect(screen.getByRole('button').textContent).toBe(cameraButtonStrings.offLabel);

    rerender(<CameraButton showLabel={true} checked={true} strings={cameraButtonStrings} />);
    expect(screen.getByRole('button').textContent).toBe(cameraButtonStrings.onLabel);
  });
});
