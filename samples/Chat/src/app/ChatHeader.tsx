// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { DefaultButton, Icon, IconButton, mergeStyles, Stack } from '@fluentui/react';
import { People20Filled, People20Regular } from '@fluentui/react-icons';
import {
  chatHeaderContainerStyle,
  greyIconButtonStyle,
  largeLeaveButtonContainerStyle,
  largeLeaveButtonStyles,
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
    <Stack className={chatHeaderContainerStyle} horizontal={true} horizontalAlign="end">
      <Stack horizontal={true} verticalAlign={'center'}>
        <div className={paneButtonContainerStyle}>
          <IconButton
            onRenderIcon={() => (props.isParticipantsDisplayed ? <People20Filled /> : <People20Regular />)}
            className={mergeStyles({ color: theme.palette.neutralPrimaryAlt })}
            onClick={() => props.setHideParticipants(props.isParticipantsDisplayed)}
          />
        </div>
        <div className={smallLeaveButtonContainerStyle}>
          <IconButton
            iconProps={leaveIcon}
            className={mergeStyles(greyIconButtonStyle, { color: theme.palette.neutralPrimaryAlt })}
            onClick={() => props.onEndChat()}
          />
        </div>
        <div className={largeLeaveButtonContainerStyle}>
          <DefaultButton
            className={mergeStyles(leaveButtonStyle, { color: theme.palette.neutralPrimaryAlt })}
            styles={largeLeaveButtonStyles}
            text={leaveString}
            onClick={() => props.onEndChat()}
            onRenderIcon={() => <Icon iconName={leaveIcon.iconName} className={leaveIconStyle} />}
          />
        </div>
      </Stack>
    </Stack>
  );
};
