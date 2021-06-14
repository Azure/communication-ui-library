// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { LocaleCollection } from './LocalizationProvider';

export const locales: LocaleCollection = {
  'en-US': {
    locale: 'en-US',
    englishName: 'English (US)',
    displayName: 'English (US)',
    rtl: false
  },
  de: {
    locale: 'de',
    englishName: 'German',
    displayName: 'Deutsche',
    rtl: false
  },
  ar: {
    locale: 'ar',
    englishName: 'Arabic',
    displayName: 'عربى',
    rtl: true
  }
};

export const defaultLocaleDataLoader = async (locale: string): Promise<Record<string, string>> => {
  switch (locale) {
    case 'ar':
      return (await import('./translated/ar.json')).default;
    case 'de':
      return (await import('./translated/de.json')).default;
    case 'en-US':
    default:
      return (await import('./translated/en-US.json')).default;
  }
};
