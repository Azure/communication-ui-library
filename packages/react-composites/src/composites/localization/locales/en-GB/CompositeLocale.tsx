// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { COMPONENT_LOCALE_EN_GB } from '@internal/react-components';
import en_GB from './strings.json';
import { createCompositeStrings } from '../utils';
import { CompositeLocale } from '../../LocalizationProvider';

/**
 * Locale for English (British)
 *
 * @public
 */
export const COMPOSITE_LOCALE_EN_GB: CompositeLocale = {
  component: COMPONENT_LOCALE_EN_GB,
  strings: createCompositeStrings(en_GB)
};
