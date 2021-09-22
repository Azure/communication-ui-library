// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CompositeLocale, COMPOSITE_LOCALE_FR_FR } from '../../src';

export const getLocale = (localeName: string): CompositeLocale | undefined => {
  switch (localeName) {
    case 'fr-FR':
      return COMPOSITE_LOCALE_FR_FR;
    default:
      return undefined;
  }
};
