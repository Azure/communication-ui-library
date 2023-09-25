// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale } from '../..';
import nl_NL from './strings.json';

/**
 * Locale for Dutch (Netherlands).
 *
 * @public
 */
export const COMPONENT_LOCALE_NL_NL: ComponentLocale = { strings: createComponentStrings(nl_NL) };
