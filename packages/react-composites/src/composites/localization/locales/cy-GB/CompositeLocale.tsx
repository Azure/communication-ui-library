// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { COMPONENT_LOCALE_CY_GB } from '@internal/react-components';
import cy_GB from './strings.json';
import { createCompositeStrings } from '../utils';
import { CompositeLocale } from '../../LocalizationProvider';

/**
 * Locale for Welsh (GB)
 *
 * @public
 */
export const COMPOSITE_LOCALE_CY_GB: CompositeLocale = {
  component: COMPONENT_LOCALE_CY_GB,
  strings: createCompositeStrings(cy_GB)
};
