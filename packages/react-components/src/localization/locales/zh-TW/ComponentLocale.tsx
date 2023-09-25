// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale } from '../..';
import zh_TW from './strings.json';

/**
 * Locale for Chinese (Taiwan).
 *
 * @public
 */
export const COMPONENT_LOCALE_ZH_TW: ComponentLocale = { strings: createComponentStrings(zh_TW) };
