// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { COMPONENT_LOCALE_AR_SA } from '@internal/react-components';
import ar_SA from './strings.json';
import { createCompositeStrings } from '../utils';
import { CompositeLocale } from '../../LocalizationProvider';

/**
 * Locale for Arabic (Saudi Arabia)
 *
 * @public
 */
export const COMPOSITE_LOCALE_AR_SA: CompositeLocale = {
  component: COMPONENT_LOCALE_AR_SA,
  strings: createCompositeStrings(ar_SA)
};
