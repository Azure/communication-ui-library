// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale, ComponentStrings } from '../..';
import ru_RU from './strings.json';
import { PartialDeep } from 'type-fest';

/**
 * Locale for Russian (Russia).
 *
 * @public
 */
export const COMPONENT_LOCALE_RU_RU: ComponentLocale = {
  strings: createComponentStrings(ru_RU as PartialDeep<ComponentStrings>)
};
