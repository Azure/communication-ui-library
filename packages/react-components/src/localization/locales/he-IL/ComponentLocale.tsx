// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale } from '../..';
import he_IL from './strings.json';

/**
 * Locale for Hebrew (Israel).
 *
 * @public
 */
export const COMPONENT_LOCALE_HE_IL: ComponentLocale = { strings: createComponentStrings(he_IL) };
