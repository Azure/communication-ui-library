// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createV8Theme } from './colors/themeShim/v8ThemeShim';
import { getBrandTokensFromPalette } from './getBrandTokensFromPalette';
import { createDarkTheme, createLightTheme, Theme as V9Theme } from '@fluentui/react-components';
import { Theme } from '@fluentui/react';

/**
 * @internal
 */
export const _createThemeFromAccentColor = (accentColor: string /*hex string, e.g. #FF6600*/, dark = false): Theme => {
  const brandTokens = getBrandTokensFromPalette(accentColor);
  const v9theme: V9Theme = dark ? createDarkTheme(brandTokens) : createLightTheme(brandTokens);
  return createV8Theme(brandTokens, v9theme);
};
