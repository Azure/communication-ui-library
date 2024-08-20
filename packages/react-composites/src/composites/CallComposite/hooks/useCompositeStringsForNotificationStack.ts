// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(breakout-rooms) */
import { NotificationStackStrings } from '@internal/react-components';
/* @conditional-compile-remove(breakout-rooms) */
import { useSelector } from './useSelector';
/* @conditional-compile-remove(breakout-rooms) */
import { CompositeLocale } from '../../localization';
/* @conditional-compile-remove(breakout-rooms) */
import { getBreakoutRoomDisplayName } from '../selectors/baseSelectors';

/* @conditional-compile-remove(breakout-rooms) */
/**
 * @private
 */
export const useCompositeStringsForNotificationStackStrings = (locale: CompositeLocale): NotificationStackStrings => {
  const breakoutRoomDisplayName = useSelector(getBreakoutRoomDisplayName);

  const notificationStackStrings = locale.component.strings.notificationStack;

  if (
    notificationStackStrings.assignedBreakoutRoomJoined &&
    locale.strings.call.assignedBreakoutRoomJoinedNotificationTitle &&
    breakoutRoomDisplayName
  ) {
    notificationStackStrings.assignedBreakoutRoomJoined.title =
      locale.strings.call.assignedBreakoutRoomJoinedNotificationTitle.replace('{roomName}', breakoutRoomDisplayName);
  }

  return notificationStackStrings;
};
