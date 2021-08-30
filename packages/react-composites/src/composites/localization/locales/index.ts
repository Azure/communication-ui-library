// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PartialDeep } from 'type-fest';
import {
  COMPONENT_LOCALE_EN_US,
  COMPONENT_LOCALE_EN_GB,
  COMPONENT_LOCALE_DE_DE,
  COMPONENT_LOCALE_ES_ES,
  COMPONENT_LOCALE_FR_FR,
  COMPONENT_LOCALE_IT_IT,
  COMPONENT_LOCALE_JA_JP,
  COMPONENT_LOCALE_KO_KR,
  COMPONENT_LOCALE_NL_NL,
  COMPONENT_LOCALE_PT_BR,
  COMPONENT_LOCALE_RU_RU,
  COMPONENT_LOCALE_TR_TR,
  COMPONENT_LOCALE_ZH_CN,
  COMPONENT_LOCALE_ZH_TW
} from '@internal/react-components';
import { CompositeLocale, CompositeStrings } from '../LocalizationProvider';
import en_US from './en-US/strings.json';
import en_GB from './en-GB/strings.json';
import de_DE from './de-DE/strings.json';
import es_ES from './es-ES/strings.json';
import fr_FR from './fr-FR/strings.json';
import it_IT from './it-IT/strings.json';
import ja_JP from './ja-JP/strings.json';
import ko_KR from './ko-KR/strings.json';
import nl_NL from './nl-NL/strings.json';
import pt_BR from './pt-BR/strings.json';
import ru_RU from './ru-RU/strings.json';
import tr_TR from './tr-TR/strings.json';
import zh_CN from './zh-CN/strings.json';
import zh_TW from './zh-TW/strings.json';

const createCompositeStrings = (localizedStrings: PartialDeep<CompositeStrings>): CompositeStrings => {
  const strings: CompositeStrings = { ...en_US };
  Object.keys(localizedStrings).forEach((key: string) => {
    strings[key] = { ...strings[key], ...localizedStrings[key] };
  });
  return strings;
};

/** Locale for English (US) */
export const COMPOSITE_LOCALE_EN_US: CompositeLocale = {
  component: COMPONENT_LOCALE_EN_US,
  strings: en_US
};
/** Locale for English (British) */
export const COMPOSITE_LOCALE_EN_GB: CompositeLocale = {
  component: COMPONENT_LOCALE_EN_GB,
  strings: createCompositeStrings(en_GB)
};
/** Locale for German (Germany) */
export const COMPOSITE_LOCALE_DE_DE: CompositeLocale = {
  component: COMPONENT_LOCALE_DE_DE,
  strings: createCompositeStrings(de_DE)
};
/** Locale for Spanish (Spain) */
export const COMPOSITE_LOCALE_ES_ES: CompositeLocale = {
  component: COMPONENT_LOCALE_ES_ES,
  strings: createCompositeStrings(es_ES)
};
/** Locale for French (France) */
export const COMPOSITE_LOCALE_FR_FR: CompositeLocale = {
  component: COMPONENT_LOCALE_FR_FR,
  strings: createCompositeStrings(fr_FR)
};
/** Locale for Italian (Italy) */
export const COMPOSITE_LOCALE_IT_IT: CompositeLocale = {
  component: COMPONENT_LOCALE_IT_IT,
  strings: createCompositeStrings(it_IT)
};
/** Locale for Japanese (Japan) */
export const COMPOSITE_LOCALE_JA_JP: CompositeLocale = {
  component: COMPONENT_LOCALE_JA_JP,
  strings: createCompositeStrings(ja_JP)
};
/** Locale for Korean (South Korea) */
export const COMPOSITE_LOCALE_KO_KR: CompositeLocale = {
  component: COMPONENT_LOCALE_KO_KR,
  strings: createCompositeStrings(ko_KR)
};
/** Locale for Dutch (Netherlands) */
export const COMPOSITE_LOCALE_NL_NL: CompositeLocale = {
  component: COMPONENT_LOCALE_NL_NL,
  strings: createCompositeStrings(nl_NL)
};
/** Locale for Portuguese (Brazil) */
export const COMPOSITE_LOCALE_PT_BR: CompositeLocale = {
  component: COMPONENT_LOCALE_PT_BR,
  strings: createCompositeStrings(pt_BR)
};
/** Locale for Russian (Russia) */
export const COMPOSITE_LOCALE_RU_RU: CompositeLocale = {
  component: COMPONENT_LOCALE_RU_RU,
  strings: createCompositeStrings(ru_RU)
};
/** Locale for Turkish (Turkey) */
export const COMPOSITE_LOCALE_TR_TR: CompositeLocale = {
  component: COMPONENT_LOCALE_TR_TR,
  strings: createCompositeStrings(tr_TR)
};
/** Locale for Chinese (Mainland China) */
export const COMPOSITE_LOCALE_ZH_CN: CompositeLocale = {
  component: COMPONENT_LOCALE_ZH_CN,
  strings: createCompositeStrings(zh_CN)
};
/** Locale for Chinese (Taiwan) */
export const COMPOSITE_LOCALE_ZH_TW: CompositeLocale = {
  component: COMPONENT_LOCALE_ZH_TW,
  strings: createCompositeStrings(zh_TW)
};
