// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { COMPONENT_LOCALE_PT_BR } from '@internal/react-components';
import pt_BR from './strings.json';
import { createCompositeStrings } from '../utils';
import { CompositeLocale } from '../../LocalizationProvider';

/**
 * Locale for Portuguese (Brazil)
 *
 * @public
 */
export const COMPOSITE_LOCALE_PT_BR: CompositeLocale = {
  component: COMPONENT_LOCALE_PT_BR,
  strings: createCompositeStrings(pt_BR)
};
