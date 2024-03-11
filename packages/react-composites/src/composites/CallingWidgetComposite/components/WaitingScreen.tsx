// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Icon, Stack, useTheme } from '@fluentui/react';
import React from 'react';
import { callingWidgetContainerStyles, callIconStyles } from '../styles/CallingWidgetComposite.styles';

export interface WaitingScreenProps {
  setWidgetState: (state: 'setup' | 'new' | 'inCall') => void;
}

export const WaitingScreen = (props: WaitingScreenProps): JSX.Element => {
  const { setWidgetState } = props;
  const theme = useTheme();
  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      styles={callingWidgetContainerStyles(theme)}
      onClick={() => {
        setWidgetState('setup');
      }}
    >
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
        <Icon iconName="callAdd" styles={callIconStyles(theme)} />
      </Stack>
    </Stack>
  );
};
