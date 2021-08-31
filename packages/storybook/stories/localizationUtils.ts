// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// TODO: Move utils.ts, controlUtils.ts and this file to a utils folder.

import {
  CompositeLocale,
  COMPOSITE_LOCALE_EN_US,
  COMPOSITE_LOCALE_EN_GB,
  COMPOSITE_LOCALE_DE_DE,
  COMPOSITE_LOCALE_ES_ES,
  COMPOSITE_LOCALE_FR_FR,
  COMPOSITE_LOCALE_IT_IT,
  COMPOSITE_LOCALE_JA_JP,
  COMPOSITE_LOCALE_KO_KR,
  COMPOSITE_LOCALE_NL_NL,
  COMPOSITE_LOCALE_PT_BR,
  COMPOSITE_LOCALE_RU_RU,
  COMPOSITE_LOCALE_TR_TR,
  COMPOSITE_LOCALE_ZH_CN,
  COMPOSITE_LOCALE_ZH_TW
} from '@azure/communication-react';

export const compositeLocale = (locale: string): CompositeLocale | undefined => {
  if (locale === '') {
    return undefined;
  }
  const response = compositeLocales[locale];
  if (response === undefined) {
    throw new Error(`No locale found for key ${locale}`);
  }
  return response;
};

const compositeLocales = {
  en_US: COMPOSITE_LOCALE_EN_US,
  en_GB: COMPOSITE_LOCALE_EN_GB,
  de_DE: COMPOSITE_LOCALE_DE_DE,
  es_ES: COMPOSITE_LOCALE_ES_ES,
  fr_FR: COMPOSITE_LOCALE_FR_FR,
  it_IT: COMPOSITE_LOCALE_IT_IT,
  ja_JP: COMPOSITE_LOCALE_JA_JP,
  ko_KR: COMPOSITE_LOCALE_KO_KR,
  nl_NL: COMPOSITE_LOCALE_NL_NL,
  pt_BR: COMPOSITE_LOCALE_PT_BR,
  ru_RU: COMPOSITE_LOCALE_RU_RU,
  tr_TR: COMPOSITE_LOCALE_TR_TR,
  zh_CN: COMPOSITE_LOCALE_ZH_CN,
  zh_TW: COMPOSITE_LOCALE_ZH_TW
};
