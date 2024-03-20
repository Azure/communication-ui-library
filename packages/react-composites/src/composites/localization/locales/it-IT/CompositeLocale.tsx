// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { COMPONENT_LOCALE_IT_IT } from '@internal/react-components';
import it_IT from './strings.json';
import { createCompositeStrings } from '../utils';
import { CompositeLocale } from '../../LocalizationProvider';

/**
 * Locale for Italian (Italy)
 *
 * @public
 */
export const COMPOSITE_LOCALE_IT_IT: CompositeLocale = {
  component: COMPONENT_LOCALE_IT_IT,
  strings: createCompositeStrings(it_IT)
};
