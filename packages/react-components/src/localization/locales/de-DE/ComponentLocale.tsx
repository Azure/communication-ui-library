// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale, ComponentStrings } from '../..';
import de_DE from './strings.json';
import { PartialDeep } from 'type-fest';

/**
 * Locale for German (Germany).
 *
 * @public
 */
export const COMPONENT_LOCALE_DE_DE: ComponentLocale = {
  strings: createComponentStrings(de_DE as PartialDeep<ComponentStrings>)
};
