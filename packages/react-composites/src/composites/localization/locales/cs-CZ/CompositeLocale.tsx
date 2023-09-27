// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { COMPONENT_LOCALE_CS_CZ } from '@internal/react-components';
import cs_CZ from './strings.json';
import { createCompositeStrings } from '../utils';
import { CompositeLocale } from '../../LocalizationProvider';

/**
 * Locale for Czech (Czech Republic)
 *
 * @public
 */
export const COMPOSITE_LOCALE_CS_CZ: CompositeLocale = {
  component: COMPONENT_LOCALE_CS_CZ,
  strings: createCompositeStrings(cs_CZ)
};
