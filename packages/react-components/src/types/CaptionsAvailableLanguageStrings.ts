// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IDropdownOption } from '@fluentui/react';

/**
 * @public
 * spoken language strings for captions setting modal
 */
export interface SpokenLanguageStrings {
  'ar-ae': string;
  'ar-sa': string;
  'da-dk': string;
  'de-de': string;
  'en-au': string;
  'en-ca': string;
  'en-gb': string;
  'en-in': string;
  'en-nz': string;
  'en-us': string;
  'es-es': string;
  'es-mx': string;
  'fi-fi': string;
  'fr-ca': string;
  'fr-fr': string;
  'hi-in': string;
  'it-it': string;
  'ja-jp': string;
  'ko-kr': string;
  'nb-no': string;
  'nl-be': string;
  'nl-nl': string;
  'pl-pl': string;
  'pt-br': string;
  'ru-ru': string;
  'sv-se': string;
  'zh-cn': string;
  'zh-hk': string;
  'cs-cz': string;
  'pt-pt': string;
  'tr-tr': string;
  'vi-vn': string;
  'th-th': string;
  'he-il': string;
  'cy-gb': string;
  'uk-ua': string;
  'el-gr': string;
  'hu-hu': string;
  'ro-ro': string;
  'sk-sk': string;
  'zh-tw': string;
}

/**
 * @public
 * caption language strings for captions setting modal
 */
export interface CaptionLanguageStrings {
  ar: string;
  da: string;
  de: string;
  en: string;
  es: string;
  fi: string;
  fr: string;
  'fr-ca': string;
  hi: string;
  it: string;
  ja: string;
  ko: string;
  nb: string;
  nl: string;
  pl: string;
  pt: string;
  ru: string;
  sv: string;
  'zh-Hans': string;
  'zh-Hant': string;
  cs: string;
  'pt-pt': string;
  tr: string;
  vi: string;
  th: string;
  he: string;
  cy: string;
  uk: string;
  el: string;
  hu: string;
  ro: string;
  sk: string;
}

/**
 * @internal
 * mapping between caption language and spoken language codes
 */
export const _spokenLanguageToCaptionLanguage = {
  'ar-ae': 'ar',
  'ar-sa': 'ar',
  'da-dk': 'da',
  'de-de': 'de',
  'en-au': 'en',
  'en-ca': 'en',
  'en-gb': 'en',
  'en-in': 'en',
  'en-nz': 'en',
  'en-us': 'en',
  'es-es': 'es',
  'es-mx': 'es',
  'fi-fi': 'fi',
  'fr-ca': 'fr-ca',
  'fr-fr': 'fr',
  'hi-in': 'hi',
  'it-it': 'it',
  'ja-jp': 'ja',
  'ko-kr': 'ko',
  'nb-no': 'nb',
  'nl-be': 'nl',
  'nl-nl': 'nl',
  'pl-pl': 'pl',
  'pt-br': 'pt',
  'ru-ru': 'ru',
  'sv-se': 'sv',
  'zh-cn': 'zh-Hans',
  'zh-hk': 'zh-Hant',
  'cs-cz': 'cs',
  'pt-pt': 'pt-pt',
  'tr-tr': 'tr',
  'vi-vn': 'vi',
  'th-th': 'th',
  'he-il': 'he',
  'cy-gb': 'cy',
  'uk-ua': 'uk',
  'el-gr': 'el',
  'hu-hu': 'hu',
  'ro-ro': 'ro',
  'sk-sk': 'sk',
  'zh-tw': 'zh-Hant'
};

/**
 * @public
 */
export type SupportedSpokenLanguage = keyof SpokenLanguageStrings;

/**
 * @public
 */
export type SupportedCaptionLanguage = keyof CaptionLanguageStrings;

/**
 * @internal
 */
export type SpokenLanguageDropdownOptions = IDropdownOption<SpokenLanguageStrings> & {
  key: keyof SpokenLanguageStrings;
};

/**
 * @internal
 */
export type CaptionLanguageDropdownOptions = IDropdownOption<CaptionLanguageStrings> & {
  key: keyof CaptionLanguageStrings;
};
