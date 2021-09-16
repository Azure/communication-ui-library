// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { DefaultButton, Icon, IconButton, mergeStyles, Stack } from '@fluentui/react';
import { People20Filled, People20Regular } from '@fluentui/react-icons';
import {
  chatHeaderContainerStyle,
  greyIconButtonStyle,
  iconButtonContainerStyle,
  largeButtonContainerStyle,
  leaveButtonStyle,
  leaveIcon,
  leaveIconStyle,
  panelButtonStyle
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
        {props.isParticipantsDisplayed ? (
          <People20Filled className={panelButtonStyle} onClick={() => props.setHideParticipants(true)} />
        ) : (
          <People20Regular className={panelButtonStyle} onClick={() => props.setHideParticipants(false)} />
        )}
        <div className={iconButtonContainerStyle}>
          <IconButton
            iconProps={leaveIcon}
            className={mergeStyles(greyIconButtonStyle, { color: theme.palette.neutralPrimaryAlt })}
            onClick={() => props.onEndChat()}
          />
        </div>
        <div className={largeButtonContainerStyle}>
          <DefaultButton
            className={mergeStyles(leaveButtonStyle, { color: theme.palette.neutralPrimaryAlt })}
            onClick={() => props.onEndChat()}
          >
            <Icon iconName={leaveIcon.iconName} className={leaveIconStyle} />
            {leaveString}
          </DefaultButton>
        </div>
      </Stack>
    </Stack>
  );
};
