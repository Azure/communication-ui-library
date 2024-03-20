// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { COMPONENT_LOCALE_NL_NL } from '@internal/react-components';
import nl_NL from './strings.json';
import { createCompositeStrings } from '../utils';
import { CompositeLocale } from '../../LocalizationProvider';

/**
 * Locale for Dutch (Netherlands)
 *
 * @public
 */
export const COMPOSITE_LOCALE_NL_NL: CompositeLocale = {
  component: COMPONENT_LOCALE_NL_NL,
  strings: createCompositeStrings(nl_NL)
};
