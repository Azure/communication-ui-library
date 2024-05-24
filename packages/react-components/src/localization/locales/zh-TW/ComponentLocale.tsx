// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale, ComponentStrings } from '../..';
import zh_TW from './strings.json';
import { PartialDeep } from 'type-fest';

/**
 * Locale for Chinese (Taiwan).
 *
 * @public
 */
export const COMPONENT_LOCALE_ZH_TW: ComponentLocale = {
  strings: createComponentStrings(zh_TW as PartialDeep<ComponentStrings>)
};
