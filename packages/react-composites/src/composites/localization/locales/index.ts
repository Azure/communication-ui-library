// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  en_US,
  de_DE,
  es_ES,
  fr_FR,
  it_IT,
  ja_JP,
  ko_KR,
  nl_NL,
  pt_BR,
  ru_RU,
  tr_TR,
  zh_CN,
  zh_TW
} from '@internal/react-components';
import { CompositeLocale, CompositeStrings } from '../LocalizationProvider';
import _en_US from './en-US/strings.json';
import _de_DE from './de-DE/strings.json';
import _es_ES from './es-ES/strings.json';
import _fr_FR from './fr-FR/strings.json';
import _it_IT from './it-IT/strings.json';
import _ja_JP from './ja-JP/strings.json';
import _ko_KR from './ko-KR/strings.json';
import _nl_NL from './nl-NL/strings.json';
import _pt_BR from './pt-BR/strings.json';
import _ru_RU from './ru-RU/strings.json';
import _tr_TR from './tr-TR/strings.json';
import _zh_CN from './zh-CN/strings.json';
import _zh_TW from './zh-TW/strings.json';

const createCompositeStrings = (c: Record<string, unknown>): CompositeStrings => {
  return { ..._en_US, ...c };
};

/** Locale for English (US) */
export const COMPOSITE_LOCALE_EN_US: CompositeLocale = {
  component: en_US,
  strings: _en_US
};
/** Locale for German (Germany) */
export const COMPOSITE_LOCALE_DE_DE: CompositeLocale = {
  component: de_DE,
  strings: createCompositeStrings(_de_DE)
};
/** Locale for Spanish (Spain) */
export const COMPOSITE_LOCALE_ES_ES: CompositeLocale = {
  component: es_ES,
  strings: createCompositeStrings(_es_ES)
};
/** Locale for French (France) */
export const COMPOSITE_LOCALE_FR_FR: CompositeLocale = {
  component: fr_FR,
  strings: createCompositeStrings(_fr_FR)
};
/** Locale for Italian (Italy) */
export const COMPOSITE_LOCALE_IT_IT: CompositeLocale = {
  component: it_IT,
  strings: createCompositeStrings(_it_IT)
};
/** Locale for Japanese (Japan) */
export const COMPOSITE_LOCALE_JA_JP: CompositeLocale = {
  component: ja_JP,
  strings: createCompositeStrings(_ja_JP)
};
/** Locale for Korean (South Korea) */
export const COMPOSITE_LOCALE_KO_KR: CompositeLocale = {
  component: ko_KR,
  strings: createCompositeStrings(_ko_KR)
};
/** Locale for Dutch (Netherlands) */
export const COMPOSITE_LOCALE_NL_NL: CompositeLocale = {
  component: nl_NL,
  strings: createCompositeStrings(_nl_NL)
};
/** Locale for Portuguese (Brazil) */
export const COMPOSITE_LOCALE_PT_BR: CompositeLocale = {
  component: pt_BR,
  strings: createCompositeStrings(_pt_BR)
};
/** Locale for Russian (Russia) */
export const COMPOSITE_LOCALE_RU_RU: CompositeLocale = {
  component: ru_RU,
  strings: createCompositeStrings(_ru_RU)
};
/** Locale for Turkish (Turkey) */
export const COMPOSITE_LOCALE_TR_TR: CompositeLocale = {
  component: tr_TR,
  strings: createCompositeStrings(_tr_TR)
};
/** Locale for Chinese (Mainland China) */
export const COMPOSITE_LOCALE_ZH_CN: CompositeLocale = {
  component: zh_CN,
  strings: createCompositeStrings(_zh_CN)
};
/** Locale for Chinese (Taiwan) */
export const COMPOSITE_LOCALE_ZH_TW: CompositeLocale = {
  component: zh_TW,
  strings: createCompositeStrings(_zh_TW)
};
