// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale, ComponentStrings } from '../..';
import fr_FR from './strings.json';
import { PartialDeep } from 'type-fest';

/**
 * Locale for French (France).
 *
 * @public
 */
export const COMPONENT_LOCALE_FR_FR: ComponentLocale = {
  strings: createComponentStrings(fr_FR as PartialDeep<ComponentStrings>)
};
