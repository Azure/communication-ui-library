// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { NamedPalette, NamedTheme } from './types';

export const paletteTemplate = (id: string): NamedPalette & { id: string } => ({
  id,
  name: '',
  keyColor: [44.51, 39.05, 288.84],
  darkCp: 2 / 3,
  lightCp: 1 / 3,
  hueTorsion: 0
});

export const themeTemplate = (id: string): NamedTheme & { id: string } => ({
  id,
  name: '',
  backgrounds: {},
  foregrounds: {}
});
