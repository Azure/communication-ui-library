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
    <Stack className={chatHeaderContainerStyle} horizontal={true} horizontalAlign="end">
      <Stack horizontal={true} verticalAlign={'center'}>
        <div className={smallLeaveButtonContainerStyle}>
          <IconButton
            tabIndex={0}
            iconProps={leaveIcon}
            className={mergeStyles(greyIconButtonStyle, { color: theme.palette.neutralPrimaryAlt })}
            onClick={() => props.onEndChat()}
          />
        </div>
        <div className={largeLeaveButtonContainerStyle}>
          <DefaultButton
            tabIndex={0}
            className={mergeStyles(leaveButtonStyle, { color: theme.palette.neutralPrimaryAlt })}
            styles={buttonWithIconStyles}
            text={leaveString}
            onClick={() => props.onEndChat()}
            onRenderIcon={() => <Icon iconName={leaveIcon.iconName} className={leaveIconStyle} />}
          />
        </div>
      </Stack>
    </Stack>
  );
};
