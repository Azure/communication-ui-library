// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import en_US from './translated/en-US.json';
import de from './translated/de.json';
import ar from './translated/ar.json';
import { ILocale } from './LocalizationProvider';

export const locales: Record<string, { locale: ILocale; englishName: string; displayName: string }> = {
  'en-US': {
    locale: {
      strings: en_US
    },
    englishName: 'English (US)',
    displayName: 'English (US)'
  },
  de: {
    locale: {
      strings: de
    },
    englishName: 'German',
    displayName: 'Deutsche'
  },
  ar: {
    locale: {
      strings: ar
    },
    englishName: 'Arabic',
    displayName: 'عربى'
  }
};
