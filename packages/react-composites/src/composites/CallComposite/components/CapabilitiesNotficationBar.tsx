// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CapabilitiesChangeInfo, CapabilityResolutionReason } from '@azure/communication-calling';
import { IMessageBarProps, MessageBar, MessageBarType, Stack } from '@fluentui/react';
import React from 'react';

/**
 * @beta
 */
export interface CapabilitiesNotificationBarProps extends IMessageBarProps {
  /**
   * Strings shown on the UI on errors.
   */
  strings?: CapabilitiesNotificationBarStrings;

  capabilitiesChangeInfo?: CapabilitiesChangeInfo;
  onDismissNotification?: () => void;
}

/**
 * @beta
 */
export interface ActiveNotification {
  /**
   * Type of error that is active.
   */
  type: 'turnVideoOn' | 'unmuteMic' | 'shareScreen';

  isPresent: boolean;

  reason: CapabilityResolutionReason;
  /**
   * The latest timestamp when this error was observed.
   *
   * When available, this is used to track errors that have already been seen and dismissed
   * by the user.
   */
  timestamp?: Date;
}

/**
 * @beta
 */
export interface CapabilitiesNotificationBarStrings {
  turnVideoOnOffCapabilityLost?: string;
}

/**
 * Notification bar for capabilities
 * @beta
 */
export const CapabilitiesNotificationBar = (props: CapabilitiesNotificationBarProps): JSX.Element => {
  console.log('props.capabilitiesChangesInfo: ', props.capabilitiesChangeInfo);

  const notifications: ActiveNotification[] = [];
  if (props.capabilitiesChangeInfo?.newValue) {
    Object.entries(props.capabilitiesChangeInfo.newValue).forEach((c) => {
      if (c[0] === 'turnVideoOn') {
        notifications.push({ type: 'turnVideoOn', ...c[1], timestamp: new Date(Date.now()) });
      }
      if (c[0] === 'unmuteMic') {
        notifications.push({ type: 'unmuteMic', ...c[1], timestamp: new Date(Date.now()) });
      }
      if (c[0] === 'shareScreen') {
        notifications.push({ type: 'shareScreen', ...c[1], timestamp: new Date(Date.now()) });
      }
    });
  }

  return (
    <Stack data-ui-id="capabilities-notification-bar-stack">
      {notifications.map((notification) => {
        return (
          <MessageBar
            key={notification.type}
            styles={{
              innerText: {
                alignSelf: 'center'
              },
              icon: {
                height: 0
              },
              content: {
                lineHeight: 'inherit'
              },
              dismissal: {
                height: 0,
                paddingTop: '0.8rem'
              }
            }}
            messageBarType={MessageBarType.warning}
            dismissIconProps={{ iconName: 'ErrorBarClear' }}
            onDismiss={() => {
              console.log();
            }}
          >
            {getNotificationMessage(notification.type, notification.isPresent)}
          </MessageBar>
        );
      })}
    </Stack>
  );
};

const getNotificationMessage = (type: 'turnVideoOn' | 'unmuteMic' | 'shareScreen', isPresent: boolean): string => {
  switch (type) {
    case 'turnVideoOn':
      return isPresent ? 'Your camera has been enabled' : 'Your camera has been disabled';
    case 'unmuteMic':
      return isPresent ? 'Your mic has been enabled' : 'Your mic has been disabled';
    case 'shareScreen':
      return isPresent ? 'Your screen share has been enabled' : 'Your screen share has been disabled';
  }
};
