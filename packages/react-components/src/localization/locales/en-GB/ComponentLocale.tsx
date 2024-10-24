// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale, ComponentStrings } from '../..';
import en_GB from './strings.json';
import { PartialDeep } from 'type-fest';

/**
 * Locale for English (GB).
 *
 * @public
 */
export const COMPONENT_LOCALE_EN_GB: ComponentLocale = {
  strings: createComponentStrings(en_GB as PartialDeep<ComponentStrings>)
};
