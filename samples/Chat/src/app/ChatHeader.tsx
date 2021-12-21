// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { DefaultButton, Icon, IconButton, mergeStyles, Stack } from '@fluentui/react';
import { People20Filled, People20Regular } from '@fluentui/react-icons';
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

export type ChatHeaderProps = {
  isParticipantsDisplayed: boolean;
  onEndChat(): void;
  setHideParticipants(hideParticipants: boolean): void;
};

export const ChatHeader = (props: ChatHeaderProps): JSX.Element => {
  const theme = useTheme();

  const leaveString = 'Leave';

  return (
    <Stack horizontal={true} verticalAlign={'center'} horizontalAlign="end" className={chatHeaderContainerStyle}>
      <div className={paneButtonContainerStyle}>
        <IconButton
          onRenderIcon={() => (props.isParticipantsDisplayed ? <People20Filled /> : <People20Regular />)}
          className={mergeStyles({ color: theme.palette.neutralPrimaryAlt })}
          onClick={() => props.setHideParticipants(props.isParticipantsDisplayed)}
        />
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
      />
    </Stack>
  );
};
