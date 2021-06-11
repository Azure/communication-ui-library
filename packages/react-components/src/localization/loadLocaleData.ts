// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ILocale } from './LocalizationProvider';

export const locales: ILocale[] = [
  {
    locale: 'en-US',
    englishName: 'English (US)',
    displayName: 'English (US)',
    rtl: false
  },
  {
    locale: 'de',
    englishName: 'German',
    displayName: 'Deutsche',
    rtl: false
  },
  {
    locale: 'ar',
    englishName: 'Arabic',
    displayName: 'عربى',
    rtl: true
  }
];

export const loadLocaleData = async (locale: string): Promise<Record<string, string>> => {
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
