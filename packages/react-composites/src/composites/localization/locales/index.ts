// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { COMPONENT_LOCALE_EN_US } from '@internal/react-components';
import { CompositeLocale } from '../LocalizationProvider';
import en_US from './en-US/strings.json';

/**
 * Locale for English (US)
 *
 * @public
 */
export const COMPOSITE_LOCALE_EN_US: CompositeLocale = {
  component: COMPONENT_LOCALE_EN_US,
  strings: en_US
};
