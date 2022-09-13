// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// eslint-disable-next-line no-restricted-imports
import { getTheme, IStackStyles, Stack, Icon, registerIcons } from '@fluentui/react';
import { Video28Filled, MicOn28Filled } from '@fluentui/react-icons';
import React from 'react';

registerIcons({
  icons: {
    requestCamera: <Video28Filled primaryFill={getTheme().palette.themePrimary} />,
    requestMicrophone: <MicOn28Filled primaryFill={getTheme().palette.themePrimary} />,
    requestSparkles: <></>
  }
});

/** @private */
export const CameraSparkleMicrophone = (): JSX.Element => (
  <Stack horizontal verticalAlign="center" tokens={{ childrenGap: '0.5rem' }}>
    <Stack.Item>
      <CameraIcon />
    </Stack.Item>
    <Stack.Item>
      <Icon iconName="requestSparkles" />
    </Stack.Item>
    <Stack.Item>
      <MicIcon />
    </Stack.Item>
  </Stack>
);

const MicIcon = (): JSX.Element => (
  <Stack verticalFill verticalAlign="center" horizontalAlign="center" styles={containerStyles}>
    <Stack.Item>
      <Icon iconName="requestMicrophone" />
    </Stack.Item>
  </Stack>
);

const CameraIcon = (): JSX.Element => (
  <Stack verticalFill verticalAlign="center" horizontalAlign="center" styles={containerStyles}>
    <Stack.Item>
      <Icon iconName="requestCamera" />
    </Stack.Item>
  </Stack>
);

const containerStyles: IStackStyles = {
  root: {
    borderRadius: '100%',
    background: '#EFF6FC',
    width: '5rem',
    height: '5rem'
  }
};
