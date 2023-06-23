// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// TODO: Move utils.ts, controlUtils.ts and this file to a utils folder.

import {
  CompositeLocale,
  COMPOSITE_LOCALE_EN_US,
  COMPOSITE_LOCALE_EN_GB,
  COMPOSITE_LOCALE_AR_SA,
  COMPOSITE_LOCALE_DE_DE,
  COMPOSITE_LOCALE_ES_ES,
  COMPOSITE_LOCALE_FI_FI,
  COMPOSITE_LOCALE_FR_FR,
  COMPOSITE_LOCALE_HE_IL,
  COMPOSITE_LOCALE_IT_IT,
  COMPOSITE_LOCALE_JA_JP,
  COMPOSITE_LOCALE_KO_KR,
  COMPOSITE_LOCALE_NB_NO,
  COMPOSITE_LOCALE_NL_NL,
  COMPOSITE_LOCALE_PL_PL,
  COMPOSITE_LOCALE_PT_BR,
  COMPOSITE_LOCALE_RU_RU,
  COMPOSITE_LOCALE_SV_SE,
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
  ar_SA: COMPOSITE_LOCALE_AR_SA,
  de_DE: COMPOSITE_LOCALE_DE_DE,
  es_ES: COMPOSITE_LOCALE_ES_ES,
  fi_FI: COMPOSITE_LOCALE_FI_FI,
  fr_FR: COMPOSITE_LOCALE_FR_FR,
  he_IL: COMPOSITE_LOCALE_HE_IL,
  it_IT: COMPOSITE_LOCALE_IT_IT,
  ja_JP: COMPOSITE_LOCALE_JA_JP,
  ko_KR: COMPOSITE_LOCALE_KO_KR,
  nb_NO: COMPOSITE_LOCALE_NB_NO,
  nl_NL: COMPOSITE_LOCALE_NL_NL,
  pl_PL: COMPOSITE_LOCALE_PL_PL,
  pt_BR: COMPOSITE_LOCALE_PT_BR,
  ru_RU: COMPOSITE_LOCALE_RU_RU,
  sv_SE: COMPOSITE_LOCALE_SV_SE,
  tr_TR: COMPOSITE_LOCALE_TR_TR,
  zh_CN: COMPOSITE_LOCALE_ZH_CN,
  zh_TW: COMPOSITE_LOCALE_ZH_TW
};
