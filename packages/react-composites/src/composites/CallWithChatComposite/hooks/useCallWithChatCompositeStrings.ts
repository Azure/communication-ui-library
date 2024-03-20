// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useLocale } from '../../localization/LocalizationProvider';
import { CallWithChatCompositeStrings } from '../Strings';

/**
 * The hook to bypass limitation of conditional build for CallWithChatComposite
 * Remove this and use useLocale() instead when merge CallWithChatComposite from beta
 *
 * @private
 */
export const useCallWithChatCompositeStrings = (): CallWithChatCompositeStrings => {
  const locale = useLocale();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (locale.strings as any).callWithChat as CallWithChatCompositeStrings;
};
