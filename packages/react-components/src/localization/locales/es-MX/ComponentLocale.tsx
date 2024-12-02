// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale, ComponentStrings } from '../..';
import es_MX from './strings.json';
import { PartialDeep } from 'type-fest';

/**
 * Locale for Spanish (Mexico).
 *
 * @public
 */
export const COMPONENT_LOCALE_ES_MX: ComponentLocale = {
  strings: createComponentStrings(es_MX as PartialDeep<ComponentStrings>)
};
