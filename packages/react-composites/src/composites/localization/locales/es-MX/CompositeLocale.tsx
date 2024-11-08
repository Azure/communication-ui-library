// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { COMPONENT_LOCALE_ES_MX } from '@internal/react-components';
import es_MX from './strings.json';
import { createCompositeStrings } from '../utils';
import { CompositeLocale } from '../../LocalizationProvider';

/**
 * Locale for Spanish (Mexico)
 *
 * @public
 */
export const COMPOSITE_LOCALE_ES_MX: CompositeLocale = {
  component: COMPONENT_LOCALE_ES_MX,
  strings: createCompositeStrings(es_MX)
};
