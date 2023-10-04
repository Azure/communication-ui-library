// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { COMPONENT_LOCALE_PL_PL } from '@internal/react-components';
import pl_PL from './strings.json';
import { createCompositeStrings } from '../utils';
import { CompositeLocale } from '../../LocalizationProvider';

/**
 * Locale for Polish (Poland)
 *
 * @public
 */
export const COMPOSITE_LOCALE_PL_PL: CompositeLocale = {
  component: COMPONENT_LOCALE_PL_PL,
  strings: createCompositeStrings(pl_PL)
};
