// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createComponentStrings } from '../utils';
import type { ComponentLocale } from '../..';
import cs_CZ from './strings.json';

/**
 * Locale for Czech (Czech Republic).
 *
 * @public
 */
export const COMPONENT_LOCALE_CS_CZ: ComponentLocale = { strings: createComponentStrings(cs_CZ) };
