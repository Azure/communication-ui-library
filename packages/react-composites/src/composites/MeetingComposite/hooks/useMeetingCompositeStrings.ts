// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useLocale } from '../../localization/LocalizationProvider';
import { MeetingCompositeStrings } from '../Strings';

/**
 * The hook to bypass limitation of conditional build for meetingComposite
 * Remove this and use useLocale() instead when merge meeting composite from beta
 *
 * @private
 */
export const useMeetingCompositeStrings = (): MeetingCompositeStrings => {
  const locale = useLocale();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (locale.strings as any).meeting as MeetingCompositeStrings;
};
