// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale, ComponentStrings } from '../..';
import he_IL from './strings.json';
import { PartialDeep } from 'type-fest';

/**
 * Locale for Hebrew (Israel).
 *
 * @public
 */
export const COMPONENT_LOCALE_HE_IL: ComponentLocale = {
  strings: createComponentStrings(he_IL as PartialDeep<ComponentStrings>)
};
