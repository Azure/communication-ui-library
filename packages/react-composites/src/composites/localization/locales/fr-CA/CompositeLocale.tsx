// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { COMPONENT_LOCALE_FR_CA } from '@internal/react-components';
import fr_CA from './strings.json';
import { createCompositeStrings } from '../utils';
import { CompositeLocale } from '../../LocalizationProvider';

/**
 * Locale for French (Canada)
 *
 * @public
 */
export const COMPOSITE_LOCALE_FR_CA: CompositeLocale = {
  component: COMPONENT_LOCALE_FR_CA,
  strings: createCompositeStrings(fr_CA)
};
