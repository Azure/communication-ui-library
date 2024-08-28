// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale, ComponentStrings } from '../..';
import ar_SA from './strings.json';
import { PartialDeep } from 'type-fest';

/**
 * Locale for Arabic (Saudi Arabia).
 *
 * @public
 */
export const COMPONENT_LOCALE_AR_SA: ComponentLocale = {
  strings: createComponentStrings(ar_SA as PartialDeep<ComponentStrings>)
};
