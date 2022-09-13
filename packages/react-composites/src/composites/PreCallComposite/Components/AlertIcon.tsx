// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { getTheme, IStackStyles, ITextStyles, Stack, Text } from '@fluentui/react';

/** @private */
export const AlertIcon = (): JSX.Element => (
  <Stack verticalFill verticalAlign="center" horizontalAlign="center" styles={containerStyles}>
    <Stack.Item>
      <Text styles={alertTextStyles}>!</Text>
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

const alertTextStyles: ITextStyles = {
  root: {
    fontSize: '3rem',
    color: getTheme().palette.themePrimary,
    fontWeight: '600'
  }
};
