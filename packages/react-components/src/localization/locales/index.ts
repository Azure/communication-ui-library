// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PartialDeep } from 'type-fest';
import { ComponentStrings, Locale } from '..';
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

const createComponentStrings = (localizedStrings: PartialDeep<ComponentStrings>): ComponentStrings => {
  const strings: ComponentStrings = { ..._en_US };
  Object.keys(localizedStrings).forEach((key: string) => {
    strings[key] = { ...strings[key], ...localizedStrings[key] };
  });
  return strings;
};

/** Locale for English (US) */
export const en_US: Locale = { strings: _en_US };
/** Locale for German (Germany) */
export const de_DE: Locale = { strings: createComponentStrings(_de_DE) };
/** Locale for Spanish (Spain) */
export const es_ES: Locale = { strings: createComponentStrings(_es_ES) };
/** Locale for French (France) */
export const fr_FR: Locale = { strings: createComponentStrings(_fr_FR) };
/** Locale for Italian (Italy) */
export const it_IT: Locale = { strings: createComponentStrings(_it_IT) };
/** Locale for Japanese (Japan) */
export const ja_JP: Locale = { strings: createComponentStrings(_ja_JP) };
/** Locale for Korean (South Korea) */
export const ko_KR: Locale = { strings: createComponentStrings(_ko_KR) };
/** Locale for Dutch (Netherlands) */
export const nl_NL: Locale = { strings: createComponentStrings(_nl_NL) };
/** Locale for Portuguese (Brazil) */
export const pt_BR: Locale = { strings: createComponentStrings(_pt_BR) };
/** Locale for Russian (Russia) */
export const ru_RU: Locale = { strings: createComponentStrings(_ru_RU) };
/** Locale for Turkish (Turkey) */
export const tr_TR: Locale = { strings: createComponentStrings(_tr_TR) };
/** Locale for Chinese (Mainland China) */
export const zh_CN: Locale = { strings: createComponentStrings(_zh_CN) };
/** Locale for Chinese (Taiwan) */
export const zh_TW: Locale = { strings: createComponentStrings(_zh_TW) };
