// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CompositeLocale, COMPOSITE_LOCALE_EN_US, COMPOSITE_LOCALE_FR_FR } from '../../../src';
import { QueryArgs } from './QueryArgs';

export function prepareLocale(queryArgs: QueryArgs): CompositeLocale {
  const locale = queryArgs.useFrLocale ? COMPOSITE_LOCALE_FR_FR : COMPOSITE_LOCALE_EN_US;
  if (queryArgs.showCallDescription) {
    locale.strings.call.configurationPageCallDetails =
      'Some details about the call that span more than one line - many, many lines in fact. Who would want fewer lines than many, many lines? Could you even imagine?! 😲';
  }
  return locale;
}
