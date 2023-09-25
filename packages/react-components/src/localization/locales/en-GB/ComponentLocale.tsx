// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale } from '../..';
import en_GB from './strings.json';

/**
 * Locale for English (GB).
 *
 * @public
 */
export const COMPONENT_LOCALE_EN_GB: ComponentLocale = { strings: createComponentStrings(en_GB) };
