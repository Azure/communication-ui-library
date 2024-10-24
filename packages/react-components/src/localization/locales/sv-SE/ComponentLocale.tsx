// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale, ComponentStrings } from '../..';
import sv_SE from './strings.json';
import { PartialDeep } from 'type-fest';

/**
 * Locale for Swedish (Sweden) .
 *
 * @public
 */
export const COMPONENT_LOCALE_SV_SE: ComponentLocale = {
  strings: createComponentStrings(sv_SE as PartialDeep<ComponentStrings>)
};
