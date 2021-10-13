// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { IStackItemStyles, IStackStyles, Stack, useTheme } from '@fluentui/react';

/**
 * @private
 */
export interface PollResultBarProps {
  percentage: number;
  votes: number;
}

/**
 * @private
 */
export const PollResultBar = (props: PollResultBarProps): JSX.Element => {
  const palette = useTheme().palette;
  const backgroundBarStyles: IStackItemStyles = {
    root: {
      background: palette.themeLighterAlt,
      color: palette.themeDarkAlt
    }
  };
  const containerStyles: IStackStyles = {
    root: {
      height: '40px',
      marginTop: '5px',
      marginBottom: '5px',
      fontSize: '12px',
      lineHeight: '16px',
      background: palette.themeLighterAlt,
      color: palette.themeDarkAlt
    }
  };

  const percentageString = `${props.percentage}%`;
  const votesString = `${props.votes} ${props.votes === 1 ? 'vote' : 'votes'}`;

  return (
    <Stack styles={containerStyles}>
      <Stack.Item styles={backgroundBarStyles}></Stack.Item>
      <Stack horizontal verticalAlign="center">
        <Stack.Item>{percentageString}</Stack.Item>
        <Stack.Item>{votesString}</Stack.Item>
      </Stack>
    </Stack>
  );
};
