// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale, ComponentStrings } from '../..';
import ja_JP from './strings.json';
import { PartialDeep } from 'type-fest';

/**
 * Locale for Japanese (Japan).
 *
 * @public
 */
export const COMPONENT_LOCALE_JA_JP: ComponentLocale = {
  strings: createComponentStrings(ja_JP as PartialDeep<ComponentStrings>)
};
