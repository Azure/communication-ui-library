// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import React from 'react';
import {
  configurationStackTokens,
  fullScreenStyle,
  localSettingsContainerStyle,
  mainContainerStyle,
  verticalStackStyle
} from './styles/CallConfiguration.styles';
import { LocalPreview } from './LocalPreview';

export interface CallConfigurationProps {
  screenWidth: number;
  children: React.ReactNode;
  isMicrophoneOn: boolean;
  setIsMicrophoneOn: (isEnabled: boolean) => void;
}

export const CallConfiguration = (props: CallConfigurationProps): JSX.Element => {
  const { screenWidth } = props;

  return (
    <Stack className={mainContainerStyle} horizontalAlign="center" verticalAlign="center" grow>
      <Stack
        className={screenWidth > 750 ? fullScreenStyle : verticalStackStyle}
        horizontal={screenWidth > 750}
        horizontalAlign="center"
        verticalAlign="center"
        tokens={screenWidth > 750 ? configurationStackTokens : undefined}
        grow
      >
        <LocalPreview {...props} />
        <Stack className={localSettingsContainerStyle}>{props.children}</Stack>
      </Stack>
    </Stack>
  );
};
