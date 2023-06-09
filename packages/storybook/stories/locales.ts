// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  ComponentLocale,
  COMPONENT_LOCALE_EN_US,
  COMPONENT_LOCALE_EN_GB,
  COMPONENT_LOCALE_AR_SA,
  COMPONENT_LOCALE_DE_DE,
  COMPONENT_LOCALE_ES_ES,
  COMPONENT_LOCALE_FI_FI,
  COMPONENT_LOCALE_FR_FR,
  COMPONENT_LOCALE_HE_IL,
  COMPONENT_LOCALE_IT_IT,
  COMPONENT_LOCALE_JA_JP,
  COMPONENT_LOCALE_KO_KR,
  COMPONENT_LOCALE_NB_NO,
  COMPONENT_LOCALE_NL_NL,
  COMPONENT_LOCALE_PL_PL,
  COMPONENT_LOCALE_PT_BR,
  COMPONENT_LOCALE_RU_RU,
  COMPONENT_LOCALE_SV_SE,
  COMPONENT_LOCALE_TR_TR,
  COMPONENT_LOCALE_ZH_CN,
  COMPONENT_LOCALE_ZH_TW
} from '@azure/communication-react';

/** Named locale collection */
export const LOCALES: Record<string, { locale: ComponentLocale; englishName: string }> = {
  en_US: {
    locale: COMPONENT_LOCALE_EN_US,
    englishName: 'English (US)'
  },
  en_GB: {
    locale: COMPONENT_LOCALE_EN_GB,
    englishName: 'English (British)'
  },
  ar_SA: {
    locale: COMPONENT_LOCALE_AR_SA,
    englishName: 'Arabic (Saudi Arabia)'
  },
  de_DE: {
    locale: COMPONENT_LOCALE_DE_DE,
    englishName: 'German (Germany)'
  },
  es_ES: {
    locale: COMPONENT_LOCALE_ES_ES,
    englishName: 'Spanish (Spain)'
  },
  fi_FI: {
    locale: COMPONENT_LOCALE_FI_FI,
    englishName: 'Finnish (Finland)'
  },
  fr_FR: {
    locale: COMPONENT_LOCALE_FR_FR,
    englishName: 'French (France)'
  },
  he_IL: {
    locale: COMPONENT_LOCALE_HE_IL,
    englishName: 'Hebrew (Israel)'
  },
  it_IT: {
    locale: COMPONENT_LOCALE_IT_IT,
    englishName: 'Italian (Italy)'
  },
  ja_JP: {
    locale: COMPONENT_LOCALE_JA_JP,
    englishName: 'Japanese (Japan)'
  },
  ko_KR: {
    locale: COMPONENT_LOCALE_KO_KR,
    englishName: 'Korean (South Korea)'
  },
  nb_NO: {
    locale: COMPONENT_LOCALE_NB_NO,
    englishName: 'Norwegian Bokmål (Norway)'
  },
  nl_NL: {
    locale: COMPONENT_LOCALE_NL_NL,
    englishName: 'Dutch (Netherlands)'
  },
  pl_PL: {
    locale: COMPONENT_LOCALE_PL_PL,
    englishName: 'Polish (Poland)'
  },
  pt_BR: {
    locale: COMPONENT_LOCALE_PT_BR,
    englishName: 'Portuguese (Brazil)'
  },
  ru_RU: {
    locale: COMPONENT_LOCALE_RU_RU,
    englishName: 'Russian (Russia)'
  },
  sv_SE: {
    locale: COMPONENT_LOCALE_SV_SE,
    englishName: 'Swedish (Sweden)'
  },
  tr_TR: {
    locale: COMPONENT_LOCALE_TR_TR,
    englishName: 'Turkish (Turkey)'
  },
  zh_CN: {
    locale: COMPONENT_LOCALE_ZH_CN,
    englishName: 'Chinese (Mainland China)'
  },
  zh_TW: {
    locale: COMPONENT_LOCALE_ZH_TW,
    englishName: 'Chinese (Taiwan)'
  }
};
