// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { COMPONENTS_LOCALE_FR_FR } from '@internal/react-components';

import { CompositeLocale } from '../localization';
import _fr_FR from './translated/fr_FR.json';

/** Locale for English (US) */
export const COMPOSITE_LOCALE_FR_FR: CompositeLocale = {
  component: COMPONENTS_LOCALE_FR_FR,
  strings: _fr_FR
};
