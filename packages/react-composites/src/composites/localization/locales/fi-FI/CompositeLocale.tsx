// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { COMPONENT_LOCALE_FI_FI } from '@internal/react-components';
import fi_FI from './strings.json';
import { createCompositeStrings } from '../utils';
import { CompositeLocale } from '../../LocalizationProvider';

/**
 * Locale for Finnish (Finland)
 *
 * @public
 */
export const COMPOSITE_LOCALE_FI_FI: CompositeLocale = {
  component: COMPONENT_LOCALE_FI_FI,
  strings: createCompositeStrings(fi_FI)
};
