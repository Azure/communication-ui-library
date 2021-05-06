// © Microsoft Corporation. All rights reserved.

import { Theme, PartialTheme } from '@fluentui/react-theme-provider';

/**
 * A theme with an associated name.
 */
export type NamedTheme = {
  /** assigned name of theme */
  name: string;
  /** theme used for applying to components */
  theme: PartialTheme | Theme;
};

/**
 * Collection of NamedThemes
 */
export type ThemeCollection = Record<string, NamedTheme>;
