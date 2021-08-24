// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  Locale,
  en_US,
  fr_FR,
  de_DE,
  es_ES,
  it_IT,
  ja_JP,
  ko_KR,
  nl_NL,
  pt_BR,
  ru_RU,
  tr_TR,
  zh_CN,
  zh_TW
} from '@azure/communication-react';

/** Named locale collection */
export const LOCALES: Record<string, { locale: Locale; englishName: string }> = {
  en_US: {
    locale: en_US,
    englishName: 'English (US)'
  },
  de_DE: {
    locale: de_DE,
    englishName: 'German (Germany)'
  },
  es_ES: {
    locale: es_ES,
    englishName: 'Spanish (Spain)'
  },
  fr_FR: {
    locale: fr_FR,
    englishName: 'French (France)'
  },
  it_IT: {
    locale: it_IT,
    englishName: 'Italian (Italy)'
  },
  ja_JP: {
    locale: ja_JP,
    englishName: 'Japanese (Japan)'
  },
  ko_KR: {
    locale: ko_KR,
    englishName: 'Korean (South Korea)'
  },
  nl_NL: {
    locale: nl_NL,
    englishName: 'Dutch (Netherlands)'
  },
  pt_BR: {
    locale: pt_BR,
    englishName: 'Portuguese (Brazil)'
  },
  ru_RU: {
    locale: ru_RU,
    englishName: 'Russian (Russia)'
  },
  tr_TR: {
    locale: tr_TR,
    englishName: 'Turkish (Turkey)'
  },
  zh_CN: {
    locale: zh_CN,
    englishName: 'Chinese (Mainland China)'
  },
  zh_TW: {
    locale: zh_TW,
    englishName: 'Chinese (Taiwan)'
  }
};
