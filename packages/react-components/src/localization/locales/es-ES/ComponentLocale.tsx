// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale } from '../..';
import es_ES from './strings.json';

/**
 * Locale for Spanish (Spain).
 *
 * @public
 */
export const COMPONENT_LOCALE_ES_ES: ComponentLocale = { strings: createComponentStrings(es_ES) };
