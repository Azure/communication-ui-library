// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Icon, Stack, useTheme } from '@fluentui/react';
import React from 'react';
import {
  callingWidgetContainerStyles,
  callIconStyles,
  callingWidgetCustomWaitContainerStyles
} from '../styles/CallingWidgetComposite.styles';
import { WidgetPosition } from '../CallingWidgetComposite';

export interface WaitingScreenProps {
  setWidgetState: (state: 'setup' | 'new' | 'inCall') => void;
  onRenderIdleWidget?: () => JSX.Element;
  position: WidgetPosition;
}

export const WaitingScreen = (props: WaitingScreenProps): JSX.Element => {
  const { setWidgetState, position, onRenderIdleWidget } = props;
  const theme = useTheme();
  if (onRenderIdleWidget !== undefined) {
    return (
      <Stack
        horizontalAlign="center"
        verticalAlign="center"
        styles={callingWidgetCustomWaitContainerStyles(theme, position)}
        onClick={() => {
          setWidgetState('setup');
        }}
      >
        <Stack style={{ position: position === 'unset' ? 'relative' : 'unset' }}>
          {props.onRenderIdleWidget && props.onRenderIdleWidget()}
        </Stack>
      </Stack>
    );
  }
  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      styles={callingWidgetContainerStyles(theme, position)}
      onClick={() => {
        setWidgetState('setup');
      }}
    >
      <Stack style={{ position: position === 'unset' ? 'relative' : 'unset' }}>
        {props.onRenderIdleWidget === undefined && (
          <Stack
            horizontalAlign="center"
            verticalAlign="center"
            style={{
              height: '4rem',
              width: '4rem',
              borderRadius: '50%',
              background: theme.palette.themePrimary
            }}
          >
            <Icon iconName={'WaitingStatePrimary'} styles={callIconStyles(theme)} />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
