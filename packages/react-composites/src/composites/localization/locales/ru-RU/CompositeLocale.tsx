// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { COMPONENT_LOCALE_RU_RU } from '@internal/react-components';
import ru_RU from './strings.json';
import { createCompositeStrings } from '../utils';
import { CompositeLocale } from '../../LocalizationProvider';

/**
 * Locale for Russian (Russia)
 *
 * @public
 */
export const COMPOSITE_LOCALE_RU_RU: CompositeLocale = {
  component: COMPONENT_LOCALE_RU_RU,
  strings: createCompositeStrings(ru_RU)
};
