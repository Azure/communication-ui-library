// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ComponentLocale } from '@internal/react-components';
import { useMemo } from 'react';
import {
  buildFlavorAgnosticCallCompositeStrings,
  BuildFlavorAgnosticCallCompositeStrings
} from '../CallComposite/Strings';
import {
  BuildFlavorAgnosticCallWithChatCompositeStrings,
  buildFlavorAgnosticCallWithChatCompositeStrings
} from '../CallWithChatComposite/Strings';
import {
  BuildFlavorAgnosticChatCompositeStrings,
  buildFlavorAgnosticChatCompositeStrings
} from '../ChatComposite/Strings';
import { useLocale } from './LocalizationProvider';

/**
 * @private
 */
export interface BuildFlavorAgnosticCompositeLocale {
  strings: BuildFlavorAgnosticCompositeStrings;
  component: ComponentLocale;
}

/**
 * @private
 */
export interface BuildFlavorAgnosticCompositeStrings {
  call: BuildFlavorAgnosticCallCompositeStrings;
  chat: BuildFlavorAgnosticChatCompositeStrings;
  callWithChat: BuildFlavorAgnosticCallWithChatCompositeStrings;
}

/**
 * @private
 */
export const useBuildFlavorAgnosticLocale = (): BuildFlavorAgnosticCompositeLocale => {
  const locale = useLocale();
  const buildFlavorAgnosticLocale = useMemo(
    () => ({
      ...locale,
      strings: {
        chat: buildFlavorAgnosticChatCompositeStrings(locale.strings.chat),
        call: buildFlavorAgnosticCallCompositeStrings(locale.strings.call),
        callWithChat: buildFlavorAgnosticCallWithChatCompositeStrings(locale.strings.callWithChat)
      }
    }),
    [locale]
  );
  return buildFlavorAgnosticLocale;
};
