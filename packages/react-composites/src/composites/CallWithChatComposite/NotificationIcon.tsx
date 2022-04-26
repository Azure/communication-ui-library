// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { IIconStyles, IStackStyles, ITheme, memoizeFunction, Stack, useTheme, Text } from '@fluentui/react';

/**
 * @private
 */
export type NotificationIconProps = {
  chatMessagesCount: number;
  label?: string;
};
/**
 * @private
 */
export const NotificationIcon = (props: NotificationIconProps): JSX.Element => {
  const { chatMessagesCount, label } = props;
  const theme = useTheme();
  const renderNumber = (numberOfMessages): JSX.Element => {
    if (numberOfMessages < 1) {
      return <></>;
    } else {
      const textNumberOfMessages = numberOfMessages < 9 ? numberOfMessages : '9+';
      return (
        <Text role={'status'} aria-label={textNumberOfMessages + label} styles={notificationTextStyles(theme)}>
          {textNumberOfMessages}
        </Text>
      );
    }
  };

  return (
    <Stack
      data-ui-id="call-with-chat-composite-chat-button-unread-icon"
      horizontalAlign="center"
      verticalAlign="center"
      styles={notificationIconContainerStyles(theme)}
    >
      <Stack>{renderNumber(chatMessagesCount)}</Stack>
    </Stack>
  );
};

const notificationIconPaddingREM = 0.225;
const notificationSizeREM = 1;

const notificationIconContainerStyles = memoizeFunction(
  (theme: ITheme): IIconStyles => ({
    root: {
      borderRadius: `${notificationSizeREM}rem`, // Create a css circle. This should match the height.
      height: `${notificationSizeREM}rem`,
      minWidth: `${notificationSizeREM}rem`, // use min-width over width as we want to extend the width of the notification icon when contents is more than one character (e.g. 9+)
      background: theme.palette.themePrimary,
      border: `0.0625rem solid white`, // border should always be white
      padding: `${notificationIconPaddingREM}rem`,

      // positioning to place the badge within the button appropriately.
      position: 'absolute',
      top: `-${0.5 - notificationIconPaddingREM / 2}rem`,
      left: `${0.5 + notificationIconPaddingREM / 2}rem`
    }
  })
);

const notificationTextStyles = memoizeFunction(
  (theme: ITheme): IStackStyles => ({
    root: {
      color: 'white',
      fontSize: theme.fonts.xSmall.fontSize
    }
  })
);
