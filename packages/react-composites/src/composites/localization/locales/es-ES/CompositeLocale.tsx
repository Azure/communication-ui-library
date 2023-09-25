// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { COMPONENT_LOCALE_ES_ES } from '@internal/react-components';
import es_ES from './strings.json';
import { createCompositeStrings } from '../utils';
import { CompositeLocale } from '../../LocalizationProvider';

/**
 * Locale for Spanish (Spain)
 *
 * @public
 */
export const COMPOSITE_LOCALE_ES_ES: CompositeLocale = {
  component: COMPONENT_LOCALE_ES_ES,
  strings: createCompositeStrings(es_ES)
};
