// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Locale } from './LocalizationProvider';
import _en_US from './translated/en_US.json';
import _de_DE from './translated/de_DE.json';
import _ar_SA from './translated/ar_SA.json';
import _fr_FR from './translated/fr_FR.json';

/** Locale for English (US) */
export const en_US: Locale = { strings: _en_US };
/** Locale for German (Germany) */
export const de_DE: Locale = { strings: _de_DE };
/** Locale for French (France) */
export const fr_FR: Locale = { strings: _fr_FR };
/** Locale for Arabic (Saudi Arabia) */
export const ar_SA: Locale = { strings: _ar_SA };

/** Named locale collection */
export const namedLocales: Record<string, { locale: Locale; englishName: string; displayName: string }> = {
  'en-US': {
    locale: en_US,
    englishName: 'English (US)',
    displayName: 'English (US)'
  },
  'fr-FR': {
    locale: fr_FR,
    englishName: 'French (France)',
    displayName: 'Français (France)'
  },
  'de-DE': {
    locale: de_DE,
    englishName: 'German (Germany)',
    displayName: 'Deutsche (Deutschland)'
  },
  'ar-SA': {
    locale: ar_SA,
    englishName: 'Arabic (Saudi Arabia)',
    displayName: 'العربية (المملكة العربية السعودية)'
  }
};
