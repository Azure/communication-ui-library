// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale } from '../..';
import ja_JP from './strings.json';

/**
 * Locale for Japanese (Japan).
 *
 * @public
 */
export const COMPONENT_LOCALE_JA_JP: ComponentLocale = { strings: createComponentStrings(ja_JP) };
