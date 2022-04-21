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
  /* @conditional-compile-remove(chat-composite-participant-pane) */
  const participantListExpandedString = 'Participants list Button Expanded';
  /* @conditional-compile-remove(chat-composite-participant-pane) */
  const participantListCollapsedString = 'Participants list Button Collapsed';

  return (
    <Stack horizontal={true} verticalAlign={'center'} horizontalAlign="end" className={chatHeaderContainerStyle}>
      <div className={paneButtonContainerStyle}>
        {
          /* @conditional-compile-remove(chat-composite-participant-pane) */
          <IconButton
            onRenderIcon={() => (props.isParticipantsDisplayed ? <People20Filled /> : <People20Regular />)}
            className={mergeStyles({ color: theme.palette.neutralPrimaryAlt })}
            onClick={() => props.setHideParticipants(props.isParticipantsDisplayed)}
            ariaLabel={props.isParticipantsDisplayed ? participantListExpandedString : participantListCollapsedString}
          />
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
      />
    </Stack>
  );
};
