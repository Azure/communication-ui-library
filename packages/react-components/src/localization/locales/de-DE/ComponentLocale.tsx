// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createComponentStrings } from '../utils';
import type { ComponentLocale } from '../..';
import de_DE from './strings.json';

/**
 * Locale for German (Germany).
 *
 * @public
 */
export const COMPONENT_LOCALE_DE_DE: ComponentLocale = { strings: createComponentStrings(de_DE) };
