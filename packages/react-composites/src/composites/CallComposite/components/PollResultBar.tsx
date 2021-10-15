// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { IStackItemStyles, IStackStyles, Stack, useTheme } from '@fluentui/react';

/**
 * @private
 */
export interface PollResultBarProps {
  barWidthPercentage: number;
  percentage: number;
  votes: number;
}

/**
 * @private
 */
export const PollResultBar = (props: PollResultBarProps): JSX.Element => {
  const palette = useTheme().palette;
  const resultsBarContainerStyles: IStackStyles = {
    root: {
      width: '100%'
    }
  };
  const backgroundBarStyles: IStackItemStyles = {
    root: {
      background: palette.themeLighterAlt,
      color: palette.themeDarkAlt,
      width: `${props.barWidthPercentage}%`,
      height: '40px',
      marginTop: '5px',
      marginBottom: '5px',
      zIndex: '0',
      transition: 'width 1s'
    }
  };
  const textContainerStyles: IStackStyles = {
    root: {
      height: '50px',
      paddingLeft: '12px',
      color: palette.themeDarkAlt,
      zIndex: '1',
      position: 'absolute'
    }
  };
  const textStyles: IStackItemStyles = {
    root: {
      fontSize: '12px',
      lineHeight: '16px',
      color: palette.themeDarkAlt,
      fontWeight: '600'
    }
  };

  const percentageString = `${props.percentage}%`;
  const votesString = `(${props.votes} ${props.votes === 1 ? 'vote' : 'votes'})`;

  return (
    <Stack styles={resultsBarContainerStyles}>
      <Stack.Item styles={backgroundBarStyles}>
        <span></span>
      </Stack.Item>
      <Stack styles={textContainerStyles} verticalFill verticalAlign="center">
        <Stack.Item styles={textStyles}>{`${percentageString} ${votesString}`}</Stack.Item>
      </Stack>
    </Stack>
  );
};
