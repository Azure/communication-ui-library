// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale, ComponentStrings } from '../..';
import pt_BR from './strings.json';
import { PartialDeep } from 'type-fest';

/**
 * Locale for Portuguese (Brazil).
 *
 * @public
 */
export const COMPONENT_LOCALE_PT_BR: ComponentLocale = {
  strings: createComponentStrings(pt_BR as PartialDeep<ComponentStrings>)
};
