// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale } from '../..';
import ko_KR from './strings.json';

/**
 * Locale for Korean (South Korea).
 *
 * @public
 */
export const COMPONENT_LOCALE_KO_KR: ComponentLocale = { strings: createComponentStrings(ko_KR) };
