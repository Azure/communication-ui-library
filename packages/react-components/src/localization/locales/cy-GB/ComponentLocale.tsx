// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale, ComponentStrings } from '../..';
import cy_GB from './strings.json';
import { PartialDeep } from 'type-fest';

/**
 * Locale for Welsh (GB).
 *
 * @public
 */
export const COMPONENT_LOCALE_CY_GB: ComponentLocale = {
  strings: createComponentStrings(cy_GB as PartialDeep<ComponentStrings>)
};
