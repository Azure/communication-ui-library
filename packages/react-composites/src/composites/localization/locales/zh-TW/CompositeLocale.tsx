// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { COMPONENT_LOCALE_ZH_TW } from '@internal/react-components';
import zh_TW from './strings.json';
import { createCompositeStrings } from '../utils';
import { CompositeLocale } from '../../LocalizationProvider';

/**
 * Locale for Chinese (Taiwan)
 *
 * @public
 */
export const COMPOSITE_LOCALE_ZH_TW: CompositeLocale = {
  component: COMPONENT_LOCALE_ZH_TW,
  strings: createCompositeStrings(zh_TW)
};
