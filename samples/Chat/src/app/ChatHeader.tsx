// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { DefaultButton, Icon, IconButton, mergeStyles, Stack } from '@fluentui/react';
import {
  buttonWithIconStyles,
  chatHeaderContainerStyle,
  greyIconButtonStyle,
  largeLeaveButtonContainerStyle,
  leaveButtonStyle,
  leaveIcon,
  leaveIconStyle,
  paneButtonContainerStyle,
  smallLeaveButtonContainerStyle
} from './styles/ChatHeader.styles';
import { useTheme } from '@azure/communication-react';
/* @conditional-compile-remove(chat-composite-participant-pane) */
import { PeopleButton, PeopleButtonProps } from './PeopleButton';

export interface ChatHeaderProps {
  onEndChat(): void;
}

/* @conditional-compile-remove(chat-composite-participant-pane) */
export interface ChatHeaderProps extends PeopleButtonProps {
  onEndChat(): void;
}

export const ChatHeader = (props: ChatHeaderProps): JSX.Element => {
  const theme = useTheme();

  const leaveString = 'Leave Chat';
  return (
    <Stack
      horizontal={true}
      verticalAlign={'center'}
      horizontalAlign="end"
      className={chatHeaderContainerStyle}
      role="banner"
    >
      <div className={paneButtonContainerStyle}>
        {
          /* @conditional-compile-remove(chat-composite-participant-pane) */
          <PeopleButton {...props} />
        }
      </div>
      <DefaultButton
        className={mergeStyles(largeLeaveButtonContainerStyle, leaveButtonStyle, {
          color: theme.palette.neutralPrimaryAlt
        })}
        styles={buttonWithIconStyles}
        text={leaveString}
        onClick={() => props.onEndChat()}
        onRenderIcon={() => <Icon iconName={leaveIcon.iconName} className={leaveIconStyle} />}
        aria-live={'polite'}
        aria-label={leaveString}
      />
      <IconButton
        iconProps={leaveIcon}
        className={mergeStyles(smallLeaveButtonContainerStyle, greyIconButtonStyle, {
          color: theme.palette.neutralPrimaryAlt
        })}
        onClick={() => props.onEndChat()}
        ariaLabel={leaveString}
        aria-live={'polite'}
        title={leaveString}
      />
    </Stack>
  );
};
