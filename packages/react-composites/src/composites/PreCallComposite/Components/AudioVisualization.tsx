// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getTheme, IStackStyles, Stack } from '@fluentui/react';
import { MicOn20Regular } from '@fluentui/react-icons';
import React from 'react';

/** @private */
export const AudioVisualization = (props: { volumePct?: number }): JSX.Element => (
  <Stack styles={containerStyles} verticalAlign="center" horizontal tokens={{ childrenGap: '1rem' }}>
    <Stack.Item>
      <MicOn20Regular />
    </Stack.Item>
    <Stack.Item verticalFill grow styles={sliderBackgroundStyles}>
      <Stack verticalAlign="center" styles={sliderStyles} style={{ width: `${props.volumePct ?? 0}%` }}></Stack>
    </Stack.Item>
  </Stack>
);

const containerStyles: IStackStyles = {
  root: {
    width: '100%'
  }
};

const sliderBackgroundStyles: IStackStyles = {
  root: {
    background: '#eee',
    borderRadius: '0.1rem'
  }
};

const sliderStyles: IStackStyles = {
  root: {
    background: getTheme().palette.themePrimary,
    height: '0.25rem',
    transition: 'width 0.1s'
  }
};
