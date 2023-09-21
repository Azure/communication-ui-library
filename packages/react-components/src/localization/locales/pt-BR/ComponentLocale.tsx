// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createComponentStrings } from '../utils';
import type { ComponentLocale } from '../..';
import pt_BR from './strings.json';

/**
 * Locale for Portuguese (Brazil).
 *
 * @public
 */
export const COMPONENT_LOCALE_PT_BR: ComponentLocale = { strings: createComponentStrings(pt_BR) };
