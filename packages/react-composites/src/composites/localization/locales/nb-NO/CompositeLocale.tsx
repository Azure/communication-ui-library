// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { COMPONENT_LOCALE_NB_NO } from '@internal/react-components';
import nb_NO from './strings.json';
import { createCompositeStrings } from '../utils';
import { CompositeLocale } from '../../LocalizationProvider';

/**
 * Locale for Norwegian Bokmål (Norway)
 *
 * @public
 */
export const COMPOSITE_LOCALE_NB_NO: CompositeLocale = {
  component: COMPONENT_LOCALE_NB_NO,
  strings: createCompositeStrings(nb_NO)
};
