// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale, ComponentStrings } from '../..';
import fr_CA from './strings.json';
import { PartialDeep } from 'type-fest';

/**
 * Locale for French (Canada).
 *
 * @public
 */
export const COMPONENT_LOCALE_FR_CA: ComponentLocale = {
  strings: createComponentStrings(fr_CA as PartialDeep<ComponentStrings>)
};
