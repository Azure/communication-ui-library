// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PartialDeep } from 'type-fest';
import { ComponentLocale, ComponentStrings } from '..';
import _en_US from './en-US/strings.json';
import _en_GB from './en-GB/strings.json';
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

const createComponentStrings = (localizedStrings: PartialDeep<ComponentStrings>): ComponentStrings => {
  const strings: ComponentStrings = { ..._en_US };
  Object.keys(localizedStrings).forEach((key: string) => {
    strings[key] = { ...strings[key], ...localizedStrings[key] };
  });
  return strings;
};

/** Locale for English (US) */
export const COMPONENT_LOCALE_EN_US: ComponentLocale = { strings: _en_US };
/** Locale for English (US) */
export const COMPONENT_LOCALE_EN_GB: ComponentLocale = { strings: createComponentStrings(_en_GB) };
/** Locale for German (Germany) */
export const COMPONENT_LOCALE_DE_DE: ComponentLocale = { strings: createComponentStrings(_de_DE) };
/** Locale for Spanish (Spain) */
export const COMPONENT_LOCALE_ES_ES: ComponentLocale = { strings: createComponentStrings(_es_ES) };
/** Locale for French (France) */
export const COMPONENT_LOCALE_FR_FR: ComponentLocale = { strings: createComponentStrings(_fr_FR) };
/** Locale for Italian (Italy) */
export const COMPONENT_LOCALE_IT_IT: ComponentLocale = { strings: createComponentStrings(_it_IT) };
/** Locale for Japanese (Japan) */
export const COMPONENT_LOCALE_JA_JP: ComponentLocale = { strings: createComponentStrings(_ja_JP) };
/** Locale for Korean (South Korea) */
export const COMPONENT_LOCALE_KO_KR: ComponentLocale = { strings: createComponentStrings(_ko_KR) };
/** Locale for Dutch (Netherlands) */
export const COMPONENT_LOCALE_NL_NL: ComponentLocale = { strings: createComponentStrings(_nl_NL) };
/** Locale for Portuguese (Brazil) */
export const COMPONENT_LOCALE_PT_BR: ComponentLocale = { strings: createComponentStrings(_pt_BR) };
/** Locale for Russian (Russia) */
export const COMPONENT_LOCALE_RU_RU: ComponentLocale = { strings: createComponentStrings(_ru_RU) };
/** Locale for Turkish (Turkey) */
export const COMPONENT_LOCALE_TR_TR: ComponentLocale = { strings: createComponentStrings(_tr_TR) };
/** Locale for Chinese (Mainland China) */
export const COMPONENT_LOCALE_ZH_CN: ComponentLocale = { strings: createComponentStrings(_zh_CN) };
/** Locale for Chinese (Taiwan) */
export const COMPONENT_LOCALE_ZH_TW: ComponentLocale = { strings: createComponentStrings(_zh_TW) };
