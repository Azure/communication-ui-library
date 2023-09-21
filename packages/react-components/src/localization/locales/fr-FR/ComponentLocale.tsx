// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createComponentStrings } from '../utils';
import type { ComponentLocale } from '../..';
import fr_FR from './strings.json';

/**
 * Locale for French (France).
 *
 * @public
 */
export const COMPONENT_LOCALE_FR_FR: ComponentLocale = { strings: createComponentStrings(fr_FR) };
