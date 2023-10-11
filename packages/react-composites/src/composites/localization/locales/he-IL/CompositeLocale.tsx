// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { COMPONENT_LOCALE_HE_IL } from '@internal/react-components';
import he_IL from './strings.json';
import { createCompositeStrings } from '../utils';
import { CompositeLocale } from '../../LocalizationProvider';

/**
 * Locale for Hebrew (Israel)
 *
 * @public
 */
export const COMPOSITE_LOCALE_HE_IL: CompositeLocale = {
  component: COMPONENT_LOCALE_HE_IL,
  strings: createCompositeStrings(he_IL)
};
