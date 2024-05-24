// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale, ComponentStrings } from '../..';
import ko_KR from './strings.json';
import { PartialDeep } from 'type-fest';

/**
 * Locale for Korean (South Korea).
 *
 * @public
 */
export const COMPONENT_LOCALE_KO_KR: ComponentLocale = {
  strings: createComponentStrings(ko_KR as PartialDeep<ComponentStrings>)
};
