// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale, ComponentStrings } from '../..';
import es_ES from './strings.json';
import { PartialDeep } from 'type-fest';

/**
 * Locale for Spanish (Spain).
 *
 * @public
 */
export const COMPONENT_LOCALE_ES_ES: ComponentLocale = {
  strings: createComponentStrings(es_ES as PartialDeep<ComponentStrings>)
};
