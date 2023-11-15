// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  BaseSlots,
  ITheme,
  ThemeGenerator,
  createTheme,
  getColorFromString,
  themeRulesStandardCreator
} from '@fluentui/react';
import { darkTheme, lightTheme } from './themes';

/**
 * Generate a v8 theme from a given accent color and dark/light variant.
 *
 * @internal
 */
export const _generateTheme = (accentColor: string, variant: 'light' | 'dark'): ITheme => {
  const isDark = variant === 'dark';

  const primaryColor = getColorFromString(accentColor);
  if (!primaryColor) {
    throw new Error(`Could not parse primary color: ${accentColor}`);
  }
  const backgroundColor = getColorFromString(isDark ? '#252423' : '#ffffff');
  if (!backgroundColor) {
    throw new Error(`Could not parse background color: ${isDark ? '#252423' : '#ffffff'}`);
  }

  // Generate theme from base colors. This API is mostly undocumented and used internally by Fluent.
  // For usage, see: https://github.com/microsoft/fluentui/blob/88efc19c9513db18cb5b7c63fa0f47ba496755a2/packages/react/src/components/ThemeGenerator/ThemeGenerator.ts#L8C14-L8C28
  const themeRules = themeRulesStandardCreator();
  ThemeGenerator.insureSlots(themeRules, isDark);
  ThemeGenerator.setSlot(themeRules[BaseSlots[BaseSlots.primaryColor]], primaryColor, isDark, true, true);
  ThemeGenerator.setSlot(themeRules[BaseSlots[BaseSlots.backgroundColor]], backgroundColor, isDark, true, true);

  // There is a bug in fluentv8 theme generator that causes the foregroundColor to be generated incorrectly: https://github.com/microsoft/fluentui/issues/29853.
  // Ideally we could do: ThemeGenerator.setSlot(themeRules[BaseSlots[foregroundColor]], colors.textColor, isDark, true, true);
  // Until this fluent bug is fixed, use manually calculated foreground colors (this result is the same as the result of the color calcuation the above line would return).
  const foregroundColors = getForegroundColors(isDark);

  const themeAsJson: {
    [key: string]: string;
  } = ThemeGenerator.getThemeAsJson(themeRules);

  const generatedTheme = createTheme({
    ...{
      palette: {
        ...themeAsJson,
        ...foregroundColors
      }
    },
    isInverted: isDark
  });

  return generatedTheme;
};

const getForegroundColors = (isDark: boolean): Record<string, string> => {
  const foregroundColorKeys = [
    'neutralLighterAlt',
    'neutralLighter',
    'neutralLight',
    'neutralQuaternaryAlt',
    'neutralQuaternary',
    'neutralTertiaryAlt',
    'neutralTertiary',
    'neutralSecondaryAlt',
    'neutralSecondary',
    'neutralPrimaryAlt',
    'neutralPrimary',
    'neutralDark',
    'black'
  ];
  const baseTheme = isDark ? darkTheme : lightTheme;
  return foregroundColorKeys.reduce((acc, key) => {
    acc[key] = baseTheme.palette?.[key];
    return acc;
  }, {});
};
