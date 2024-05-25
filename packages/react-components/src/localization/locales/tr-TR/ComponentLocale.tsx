// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale, ComponentStrings } from '../..';
import tr_TR from './strings.json';
import { PartialDeep } from 'type-fest';

/**
 * Locale for Turkish (Turkey).
 *
 * @public
 */
export const COMPONENT_LOCALE_TR_TR: ComponentLocale = {
  strings: createComponentStrings(tr_TR as PartialDeep<ComponentStrings>)
};
