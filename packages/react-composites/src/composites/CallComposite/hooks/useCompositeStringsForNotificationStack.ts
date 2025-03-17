// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { NotificationStackStrings } from '@internal/react-components';
import { useSelector } from './useSelector';
import { CompositeLocale } from '../../localization';
import { getBreakoutRoomDisplayName } from '../selectors/baseSelectors';

/**
 * @private
 */
export const useCompositeStringsForNotificationStackStrings = (locale: CompositeLocale): NotificationStackStrings => {
  const breakoutRoomDisplayName = useSelector(getBreakoutRoomDisplayName);

  const notificationStackStrings = locale.component.strings.notificationStack;

  if (
    notificationStackStrings.breakoutRoomJoined &&
    locale.strings.call.breakoutRoomJoinedNotificationTitle &&
    breakoutRoomDisplayName
  ) {
    notificationStackStrings.breakoutRoomJoined.title = locale.strings.call.breakoutRoomJoinedNotificationTitle.replace(
      '{roomName}',
      breakoutRoomDisplayName
    );
  }

  return notificationStackStrings;
};
