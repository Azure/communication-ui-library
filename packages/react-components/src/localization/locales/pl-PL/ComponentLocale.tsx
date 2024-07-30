// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale, ComponentStrings } from '../..';
import pl_PL from './strings.json';
import { PartialDeep } from 'type-fest';

/**
 * Locale for Polish (Poland).
 *
 * @public
 */
export const COMPONENT_LOCALE_PL_PL: ComponentLocale = {
  strings: createComponentStrings(pl_PL as PartialDeep<ComponentStrings>)
};
