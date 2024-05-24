// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale, ComponentStrings } from '../..';
import fi_FI from './strings.json';
import { PartialDeep } from 'type-fest';

/**
 * Locale for Finnish (Finland).
 *
 * @public
 */
export const COMPONENT_LOCALE_FI_FI: ComponentLocale = {
  strings: createComponentStrings(fi_FI as PartialDeep<ComponentStrings>)
};
