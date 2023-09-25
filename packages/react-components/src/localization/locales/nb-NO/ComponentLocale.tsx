// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createComponentStrings } from '../utils';
import type { ComponentLocale } from '../..';
import nb_NO from './strings.json';

/**
 * Locale for Norwegian Bokmål (Norway) .
 *
 * @public
 */
export const COMPONENT_LOCALE_NB_NO: ComponentLocale = { strings: createComponentStrings(nb_NO) };
