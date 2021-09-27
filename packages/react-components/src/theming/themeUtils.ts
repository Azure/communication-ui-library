// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Theme } from '@fluentui/react';

/**
 * @private
 */
export const isDarkThemed = (theme: Theme): boolean => {
  const themeBlackBrightness = getPerceptualBrightnessOfHexColor(theme.palette.black);
  const themeWhiteBrightness = getPerceptualBrightnessOfHexColor(theme.palette.white);
  if (Number.isNaN(themeBlackBrightness) || Number.isNaN(themeWhiteBrightness)) {
    return false;
  }
  return themeBlackBrightness > themeWhiteBrightness;
};

const getPerceptualBrightnessOfHexColor = (hexColor: string): number => {
  // return NaN if hexColor is not a hex code
  if (!/^#[0-9A-Fa-f]{6}$/i.test(hexColor)) {
    return NaN;
  }
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);

  // arithmetic mean μ of the red, green, and blue color coordinates. Source: https://en.wikipedia.org/wiki/Brightness
  return (r + g + b) / 3;
};
