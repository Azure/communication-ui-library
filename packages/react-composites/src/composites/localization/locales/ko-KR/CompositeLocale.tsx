// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { COMPONENT_LOCALE_KO_KR } from '@internal/react-components';
import ko_KR from './strings.json';
import { createCompositeStrings } from '../utils';
import { CompositeLocale } from '../../LocalizationProvider';

/**
 * Locale for Korean (South Korea)
 *
 * @public
 */
export const COMPOSITE_LOCALE_KO_KR: CompositeLocale = {
  component: COMPONENT_LOCALE_KO_KR,
  strings: createCompositeStrings(ko_KR)
};
