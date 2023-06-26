// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(raise-hand) */
import React from 'react';
/* @conditional-compile-remove(raise-hand) */
import { RaiseHandButton } from './RaiseHandButton';
/* @conditional-compile-remove(raise-hand) */
import { createTestLocale, renderWithLocalization } from './utils/testUtils';
/* @conditional-compile-remove(raise-hand) */
import { registerIcons } from '@fluentui/react';
/* @conditional-compile-remove(raise-hand) */
import { screen } from '@testing-library/react';

describe('RaiseHandButton strings should be localizable and overridable', () => {
  /* @conditional-compile-remove(raise-hand) */
  beforeAll(() => {
    registerIcons({
      icons: {
        controlbuttonraisehand: <></>,
        controlbuttonlowerhand: <></>
      }
    });
  });
  test('Always true test for stable build to avoid error of no tests in suite', async () => {
    expect(true).toBe(true);
  });

  /* @conditional-compile-remove(raise-hand) */
  test('Should localize button label', async () => {
    const testLocale = createTestLocale({
      raiseHandButton: { offLabel: 'Raise Hand', onLabel: 'Lower Hand' }
    });
    const { rerender } = renderWithLocalization(<RaiseHandButton showLabel={true} />, testLocale);
    expect(screen.getByRole('button').textContent).toBe('Raise Hand');

    rerender(<RaiseHandButton showLabel={true} checked={true} />);
    expect(screen.getByRole('button').textContent).toBe('Lower Hand');
  });

  /* @conditional-compile-remove(raise-hand) */
  test('Should override button label with `strings` prop', async () => {
    const testLocale = createTestLocale({
      raiseHandButton: { offLabel: 'Raise Hand', onLabel: 'Lower Hand' }
    });
    const strings = { offLabel: 'Local Raise Hand', onLabel: 'Local Lower Hand' };
    const { rerender } = renderWithLocalization(<RaiseHandButton showLabel={true} strings={strings} />, testLocale);
    expect(screen.getByRole('button').textContent).toBe('Local Raise Hand');

    rerender(<RaiseHandButton showLabel={true} checked={true} strings={strings} />);
    expect(screen.getByRole('button').textContent).toBe('Local Lower Hand');
  });
});
