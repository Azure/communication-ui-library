// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale } from '../..';
import zh_CN from './strings.json';

/**
 * Locale for Chinese (Mainland China).
 *
 * @public
 */
export const COMPONENT_LOCALE_ZH_CN: ComponentLocale = { strings: createComponentStrings(zh_CN) };
