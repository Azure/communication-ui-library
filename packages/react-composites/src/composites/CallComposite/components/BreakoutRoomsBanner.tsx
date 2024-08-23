// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(breakout-rooms) */
import { Stack } from '@fluentui/react';
/* @conditional-compile-remove(breakout-rooms) */
import { ActiveNotification } from '@internal/react-components';
/* @conditional-compile-remove(breakout-rooms) */
import React from 'react';
/* @conditional-compile-remove(breakout-rooms) */
import { bannerNotificationStyles } from '../styles/CallPage.styles';
/* @conditional-compile-remove(breakout-rooms) */
import { CommonCallAdapter } from '../adapter';
/* @conditional-compile-remove(breakout-rooms) */
import { CompositeLocale } from '../../localization';
/* @conditional-compile-remove(breakout-rooms) */
import { BreakoutRoom, BreakoutRoomsSettings } from '@azure/communication-calling';
/* @conditional-compile-remove(breakout-rooms) */
import { Banner } from './Banner';

/* @conditional-compile-remove(breakout-rooms) */
/**
 * @private
 */
export const BreakoutRoomsBanner = (props: {
  assignedBreakoutRoom: BreakoutRoom | undefined;
  breakoutRoomSettings: BreakoutRoomsSettings | undefined;
  latestNotifications: ActiveNotification[] | undefined;
  locale: CompositeLocale;
  adapter: CommonCallAdapter;
}): JSX.Element | undefined => {
  const { assignedBreakoutRoom, breakoutRoomSettings, latestNotifications, locale, adapter } = props;

  const autoMoveToBreakoutRoomCurrentlyInEffect =
    assignedBreakoutRoom?.autoMoveParticipantToBreakoutRoom &&
    latestNotifications?.find(
      (notification) =>
        notification.type === 'assignedBreakoutRoomOpened' || notification.type === 'assignedBreakoutRoomChanged'
    );

  if (assignedBreakoutRoom && assignedBreakoutRoom.state === 'open' && !autoMoveToBreakoutRoomCurrentlyInEffect) {
    return (
      <Stack styles={bannerNotificationStyles}>
        <Banner
          strings={{
            title: assignedBreakoutRoom.displayName
              ? locale.strings.call.joinBreakoutRoomBannerTitle.replace('{roomName}', assignedBreakoutRoom.displayName)
              : locale.strings.call.joinBreakoutRoomBannerTitle,
            primaryButtonLabel: locale.strings.call.joinBreakoutRoomBannerButtonLabel
          }}
          onClickPrimaryButton={() => assignedBreakoutRoom.join()}
          iconProps={{ iconName: 'DoorArrowRight' }}
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
          onClickPrimaryButton={() => adapter.returnFromBreakoutRoom()}
          iconProps={{ iconName: 'DoorArrowLeft' }}
        />
      </Stack>
    );
  }
  return undefined;
};
