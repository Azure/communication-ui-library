// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale, ComponentStrings } from '../..';
import it_IT from './strings.json';
import { PartialDeep } from 'type-fest';

/**
 * Locale for Italian (Italy).
 *
 * @public
 */
export const COMPONENT_LOCALE_IT_IT: ComponentLocale = {
  strings: createComponentStrings(it_IT as PartialDeep<ComponentStrings>)
};
