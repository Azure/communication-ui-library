// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale, ComponentStrings } from '../..';
import zh_CN from './strings.json';
import { PartialDeep } from 'type-fest';

/**
 * Locale for Chinese (Mainland China).
 *
 * @public
 */
export const COMPONENT_LOCALE_ZH_CN: ComponentLocale = {
  strings: createComponentStrings(zh_CN as PartialDeep<ComponentStrings>)
};
