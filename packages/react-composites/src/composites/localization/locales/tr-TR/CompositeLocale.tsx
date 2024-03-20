// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { COMPONENT_LOCALE_TR_TR } from '@internal/react-components';
import tr_TR from './strings.json';
import { createCompositeStrings } from '../utils';
import { CompositeLocale } from '../../LocalizationProvider';

/**
 * Locale for Turkish (Turkey)
 *
 * @public
 */
export const COMPOSITE_LOCALE_TR_TR: CompositeLocale = {
  component: COMPONENT_LOCALE_TR_TR,
  strings: createCompositeStrings(tr_TR)
};
