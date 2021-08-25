// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// TODO: Move utils.ts, controlUtils.ts and this file to a utils folder.

import {
  CompositeLocale,
  COMPOSITE_LOCALE_AR_SA,
  COMPOSITE_LOCALE_DE_DE,
  COMPOSITE_LOCALE_EN_US,
  COMPOSITE_LOCALE_FR_FR
} from '@azure/communication-react';

export const compositeLocale = (locale: string): CompositeLocale | undefined => {
  if (locale === '') {
    return undefined;
  }
  const response = namedLocales[locale];
  if (response === undefined) {
    throw new Error(`No locale found for key ${locale}`);
  }
  return response;
};

const namedLocales = {
  'ar-SA': COMPOSITE_LOCALE_AR_SA,
  'de-DE': COMPOSITE_LOCALE_DE_DE,
  'en-US': COMPOSITE_LOCALE_EN_US,
  'fr-FR': COMPOSITE_LOCALE_FR_FR
};
