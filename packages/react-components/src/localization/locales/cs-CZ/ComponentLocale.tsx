// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale, ComponentStrings } from '../..';
import cs_CZ from './strings.json';
import { PartialDeep } from 'type-fest';

/**
 * Locale for Czech (Czech Republic).
 *
 * @public
 */
export const COMPONENT_LOCALE_CS_CZ: ComponentLocale = {
  strings: createComponentStrings(cs_CZ as PartialDeep<ComponentStrings>)
};
