// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { COMPONENTS_LOCALE_EN_US } from '@internal/react-components';

import { CompositeLocale } from '../localization/';
import _en_US from './translated/en_US.json';

/** Locale for English (US) */
export const COMPOSITE_LOCALE_EN_US: CompositeLocale = {
  component: COMPONENTS_LOCALE_EN_US,
  strings: _en_US
};
