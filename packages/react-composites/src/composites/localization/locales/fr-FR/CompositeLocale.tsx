// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { COMPONENT_LOCALE_FR_FR } from '@internal/react-components';
import fr_FR from './strings.json';
import { createCompositeStrings } from '../utils';
import { CompositeLocale } from '../../LocalizationProvider';

/**
 * Locale for French (France)
 *
 * @public
 */
export const COMPOSITE_LOCALE_FR_FR: CompositeLocale = {
  component: COMPONENT_LOCALE_FR_FR,
  strings: createCompositeStrings(fr_FR)
};
