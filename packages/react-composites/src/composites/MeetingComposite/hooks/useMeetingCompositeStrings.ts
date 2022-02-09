// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useLocale } from '../../localization/LocalizationProvider';
import { CallAndChatCompositeStrings } from '../Strings';

/**
 * The hook to bypass limitation of conditional build for call-and-chat composite
 * Remove this and use useLocale() instead when merge call-and-chat composite from beta
 *
 * @private
 */
export const useCallAndChatCompositeStrings = (): CallAndChatCompositeStrings => {
  const locale = useLocale();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (locale.strings as any).callAndChat as CallAndChatCompositeStrings;
};
