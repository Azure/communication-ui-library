// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createComponentStrings } from '../utils';
import type { ComponentLocale } from '../..';
import pl_PL from './strings.json';

/**
 * Locale for Polish (Poland).
 *
 * @public
 */
export const COMPONENT_LOCALE_PL_PL: ComponentLocale = { strings: createComponentStrings(pl_PL) };
