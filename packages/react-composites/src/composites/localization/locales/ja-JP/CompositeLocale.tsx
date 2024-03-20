// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { COMPONENT_LOCALE_JA_JP } from '@internal/react-components';
import ja_JP from './strings.json';
import { createCompositeStrings } from '../utils';
import { CompositeLocale } from '../../LocalizationProvider';

/**
 * Locale for Japanese (Japan)
 *
 * @public
 */
export const COMPOSITE_LOCALE_JA_JP: CompositeLocale = {
  component: COMPONENT_LOCALE_JA_JP,
  strings: createCompositeStrings(ja_JP)
};
