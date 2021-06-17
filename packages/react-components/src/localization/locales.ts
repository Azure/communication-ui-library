// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import en_US from './translated/en-US.json';
import de from './translated/de.json';
import ar from './translated/ar.json';
import { ILocale } from './LocalizationProvider';

export const locales: Record<string, { locale: ILocale; englishName: string; displayName: string }> = {
  'en-US': {
    locale: {
      lang: 'en-US',
      strings: en_US,
      rtl: false
    },
    englishName: 'English (US)',
    displayName: 'English (US)'
  },
  de: {
    locale: {
      lang: 'de',
      strings: de,
      rtl: false
    },
    englishName: 'German',
    displayName: 'Deutsche'
  },
  ar: {
    locale: {
      lang: 'ar',
      strings: ar,
      rtl: true
    },
    englishName: 'Arabic',
    displayName: 'عربى'
  }
};
