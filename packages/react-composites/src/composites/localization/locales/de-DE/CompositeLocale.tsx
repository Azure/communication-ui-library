// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { COMPONENT_LOCALE_DE_DE } from '@internal/react-components';
import de_DE from './strings.json';
import { createCompositeStrings } from '../utils';
import { CompositeLocale } from '../../LocalizationProvider';

/**
 * Locale for German (Germany)
 *
 * @public
 */
export const COMPOSITE_LOCALE_DE_DE: CompositeLocale = {
  component: COMPONENT_LOCALE_DE_DE,
  strings: createCompositeStrings(de_DE)
};
