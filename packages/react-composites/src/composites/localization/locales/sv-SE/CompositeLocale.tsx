// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { COMPONENT_LOCALE_SV_SE } from '@internal/react-components';
import sv_SE from './strings.json';
import { createCompositeStrings } from '../utils';
import { CompositeLocale } from '../../LocalizationProvider';

/**
 * Locale for Swedish (Sweden)
 *
 * @public
 */
export const COMPOSITE_LOCALE_SV_SE: CompositeLocale = {
  component: COMPONENT_LOCALE_SV_SE,
  strings: createCompositeStrings(sv_SE)
};
