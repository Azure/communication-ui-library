// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(breakout-rooms) */
import { Stack } from '@fluentui/react';
/* @conditional-compile-remove(breakout-rooms) */
import React from 'react';
/* @conditional-compile-remove(breakout-rooms) */
import { bannerNotificationStyles } from '../styles/CallPage.styles';
/* @conditional-compile-remove(breakout-rooms) */
import { CommonCallAdapter } from '../adapter';
/* @conditional-compile-remove(breakout-rooms) */
import { CompositeLocale } from '../../localization';
/* @conditional-compile-remove(breakout-rooms) */
import { useSelector } from '../hooks/useSelector';
/* @conditional-compile-remove(breakout-rooms) */
import { getAssignedBreakoutRoom, getBreakoutRoomSettings } from '../selectors/baseSelectors';
/* @conditional-compile-remove(breakout-rooms) */
import { Banner } from './Banner';

/* @conditional-compile-remove(breakout-rooms) */
/**
 * @private
 */
export const BreakoutRoomsBanner = (props: {
  locale: CompositeLocale;
  adapter: CommonCallAdapter;
}): JSX.Element | undefined => {
  const { locale, adapter } = props;

  const assignedBreakoutRoom = useSelector(getAssignedBreakoutRoom);
  const breakoutRoomSettings = useSelector(getBreakoutRoomSettings);

  if (assignedBreakoutRoom && assignedBreakoutRoom.state === 'open' && assignedBreakoutRoom.call) {
    return (
      <Stack styles={bannerNotificationStyles}>
        <Banner
          strings={{
            title: assignedBreakoutRoom.displayName
              ? locale.strings.call.joinBreakoutRoomBannerTitle.replace('{roomName}', assignedBreakoutRoom.displayName)
              : locale.strings.call.joinBreakoutRoomBannerTitle,
            primaryButtonLabel: locale.strings.call.joinBreakoutRoomBannerButtonLabel
          }}
          onClickButton={() => assignedBreakoutRoom.join()}
          iconProps={{ iconName: 'NotificationBarBreakoutRoomPromptJoin' }}
          primaryButton
        />
      </Stack>
    );
  } else if (breakoutRoomSettings && breakoutRoomSettings.disableReturnToMainMeeting !== true) {
    return (
      <Stack styles={bannerNotificationStyles}>
        <Banner
          strings={{
            title: locale.strings.call.returnFromBreakoutRoomBannerTitle,
            primaryButtonLabel: locale.strings.call.returnFromBreakoutRoomBannerButtonLabel
          }}
          onClickButton={() => adapter.returnFromBreakoutRoom()}
          iconProps={{ iconName: 'NotificationBarBreakoutRoomClosingSoon' }}
        />
      </Stack>
    );
  }
  return undefined;
};
