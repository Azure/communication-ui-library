// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { COMPONENT_LOCALE_ZH_CN } from '@internal/react-components';
import zh_CN from './strings.json';
import { createCompositeStrings } from '../utils';
import { CompositeLocale } from '../../LocalizationProvider';

/**
 * Locale for Chinese (Mainland China)
 *
 * @public
 */
export const COMPOSITE_LOCALE_ZH_CN: CompositeLocale = {
  component: COMPONENT_LOCALE_ZH_CN,
  strings: createCompositeStrings(zh_CN)
};
