// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PartialDeep } from 'type-fest';
import { ComponentLocale, ComponentStrings } from '..';
import en_US from './en-US/strings.json';
import en_GB from './en-GB/strings.json';
import ar_SA from './ar-SA/strings.json';
import de_DE from './de-DE/strings.json';
import es_ES from './es-ES/strings.json';
import fi_FI from './fi-FI/strings.json';
import fr_FR from './fr-FR/strings.json';
import he_IL from './he-IL/strings.json';
import it_IT from './it-IT/strings.json';
import ja_JP from './ja-JP/strings.json';
import ko_KR from './ko-KR/strings.json';
import nb_NO from './nb-NO/strings.json';
import nl_NL from './nl-NL/strings.json';
import pl_PL from './pl-PL/strings.json';
import pt_BR from './pt-BR/strings.json';
import ru_RU from './ru-RU/strings.json';
import sv_SE from './sv-SE/strings.json';
import tr_TR from './tr-TR/strings.json';
import zh_CN from './zh-CN/strings.json';
import zh_TW from './zh-TW/strings.json';

const createComponentStrings = (localizedStrings: PartialDeep<ComponentStrings>): ComponentStrings => {
  const strings: ComponentStrings = { ...en_US };
  Object.keys(localizedStrings).forEach((key: string) => {
    strings[key] = { ...strings[key], ...localizedStrings[key] };
  });
  return strings;
};

/**
 * Locale for English (US).
 *
 * @public
 */
export const COMPONENT_LOCALE_EN_US: ComponentLocale = { strings: en_US };
/**
 * Locale for English (GB).
 *
 * @public
 */
export const COMPONENT_LOCALE_EN_GB: ComponentLocale = { strings: createComponentStrings(en_GB) };
/**
 * Locale for Arabic (Saudi Arabia).
 *
 * @public
 */
export const COMPONENT_LOCALE_AR_SA: ComponentLocale = { strings: createComponentStrings(ar_SA) };
/**
 * Locale for  German (Germany).
 *
 * @public
 */
export const COMPONENT_LOCALE_DE_DE: ComponentLocale = { strings: createComponentStrings(de_DE) };
/**
 * Locale for Spanish (Spain).
 *
 * @public
 */
export const COMPONENT_LOCALE_ES_ES: ComponentLocale = { strings: createComponentStrings(es_ES) };
/**
 * Locale for Finnish (Finland).
 *
 * @public
 */
export const COMPONENT_LOCALE_FI_FI: ComponentLocale = { strings: createComponentStrings(fi_FI) };
/**
 * Locale for French (France).
 *
 * @public
 */
export const COMPONENT_LOCALE_FR_FR: ComponentLocale = { strings: createComponentStrings(fr_FR) };
/**
 * Locale for Hebrew (Israel).
 *
 * @public
 */
export const COMPONENT_LOCALE_HE_IL: ComponentLocale = { strings: createComponentStrings(he_IL) };
/**
 * Locale for Italian (Italy).
 *
 * @public
 */
export const COMPONENT_LOCALE_IT_IT: ComponentLocale = { strings: createComponentStrings(it_IT) };
/**
 * Locale for Japanese (Japan).
 *
 * @public
 */
export const COMPONENT_LOCALE_JA_JP: ComponentLocale = { strings: createComponentStrings(ja_JP) };
/**
 * Locale for Korean (South Korea).
 *
 * @public
 */
export const COMPONENT_LOCALE_KO_KR: ComponentLocale = { strings: createComponentStrings(ko_KR) };
/**
 * Locale for Norwegian Bokmål (Norway) .
 *
 * @public
 */
export const COMPONENT_LOCALE_NB_NO: ComponentLocale = { strings: createComponentStrings(nb_NO) };
/**
 * Locale for Dutch (Netherlands).
 *
 * @public
 */
export const COMPONENT_LOCALE_NL_NL: ComponentLocale = { strings: createComponentStrings(nl_NL) };
/**
 * Locale for Polish (Poland).
 *
 * @public
 */
export const COMPONENT_LOCALE_PL_PL: ComponentLocale = { strings: createComponentStrings(pl_PL) };
/**
 * Locale for Portuguese (Brazil).
 *
 * @public
 */
export const COMPONENT_LOCALE_PT_BR: ComponentLocale = { strings: createComponentStrings(pt_BR) };
/**
 * Locale for Russian (Russia).
 *
 * @public
 */
export const COMPONENT_LOCALE_RU_RU: ComponentLocale = { strings: createComponentStrings(ru_RU) };
/**
 * Locale for Swedish (Sweden) .
 *
 * @public
 */
export const COMPONENT_LOCALE_SV_SE: ComponentLocale = { strings: createComponentStrings(sv_SE) };
/**
 * Locale for Turkish (Turkey).
 *
 * @public
 */
export const COMPONENT_LOCALE_TR_TR: ComponentLocale = { strings: createComponentStrings(tr_TR) };
/**
 * Locale for Chinese (Mainland China).
 *
 * @public
 */
export const COMPONENT_LOCALE_ZH_CN: ComponentLocale = { strings: createComponentStrings(zh_CN) };
/**
 * Locale for Chinese (Taiwan).
 *
 * @public
 */
export const COMPONENT_LOCALE_ZH_TW: ComponentLocale = { strings: createComponentStrings(zh_TW) };
