// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale, ComponentStrings } from '../..';
import nl_NL from './strings.json';
import { PartialDeep } from 'type-fest';

/**
 * Locale for Dutch (Netherlands).
 *
 * @public
 */
export const COMPONENT_LOCALE_NL_NL: ComponentLocale = {
  strings: createComponentStrings(nl_NL as PartialDeep<ComponentStrings>)
};
