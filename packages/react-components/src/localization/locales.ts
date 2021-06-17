// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import en_US from './translated/en-US.json';
import de from './translated/de.json';
import ar from './translated/ar.json';

export const locales = {
  'en-US': {
    locale: {
      locale: 'en-US',
      strings: en_US,
      rtl: false
    },
    englishName: 'English (US)',
    displayName: 'English (US)'
  },
  de: {
    locale: {
      locale: 'de',
      strings: de,
      rtl: false
    },
    englishName: 'German',
    displayName: 'Deutsche'
  },
  ar: {
    locale: {
      locale: 'ar',
      strings: ar,
      rtl: true
    },
    englishName: 'Arabic',
    displayName: 'عربى'
  }
};
