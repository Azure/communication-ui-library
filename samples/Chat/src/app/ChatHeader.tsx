// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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
  smallLeaveButtonContainerStyle
} from './styles/ChatHeader.styles';
import { useTheme } from '@azure/communication-react';

export type ChatHeaderProps = {
  onEndChat(): void;
};

export const ChatHeader = (props: ChatHeaderProps): JSX.Element => {
  const theme = useTheme();

  const leaveString = 'Leave';

  return (
    <Stack horizontal={true} verticalAlign={'center'} horizontalAlign="end" className={chatHeaderContainerStyle}>
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
