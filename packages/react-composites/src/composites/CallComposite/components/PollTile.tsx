// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { IStackItemStyles, IStackStyles, Stack, useTheme } from '@fluentui/react';
import { QuestionCircle20Filled } from '@fluentui/react-icons';

/**
 * @private
 */
export interface PollTileProps {
  question: string;
  children: React.ReactNode;
}

/**
 * @private
 */
export const PollTile = (props: PollTileProps): JSX.Element => {
  const palette = useTheme().palette;
  const containerStyles: IStackStyles = {
    root: {
      width: '100%',
      border: `2px solid ${palette.themeLight}`,
      background: `${palette.white}`,
      position: 'relative'
    }
  };
  const tileHeaderStyles: IStackItemStyles = {
    root: {
      position: 'absolute',
      top: '-20px', // minus 50% of height
      left: 'calc(50% - 50px)' // minus 50% of width
    }
  };
  const innerContainerStyles: IStackStyles = {
    root: {
      width: '100%',
      padding: '20px',
      paddingTop: '50px'
    }
  };
  const questionStyles: IStackItemStyles = {
    root: {
      fontSize: '18px',
      lineHeight: '24px',
      fontWeight: '600'
    }
  };
  return (
    <Stack verticalFill styles={containerStyles}>
      <Stack.Item styles={tileHeaderStyles}>
        <TileHeader text={'Live poll'} />
      </Stack.Item>
      <Stack verticalFill styles={innerContainerStyles} verticalAlign="space-evenly" horizontalAlign="center">
        <Stack.Item styles={questionStyles}>{props.question}</Stack.Item>
        {props.children}
      </Stack>
    </Stack>
  );
};

/**
 * @private
 */
export const TileHeader = (props: { text: string }): JSX.Element => {
  const palette = useTheme().palette;
  const containerStyles: IStackStyles = {
    root: {
      background: palette.themeLight,
      height: '40px',
      borderRadius: '40px',
      padding: '11px'
    }
  };

  const textStyles: IStackItemStyles = {
    root: {
      color: palette.themeDarker,
      fontWeight: '600'
    }
  };

  return (
    <Stack styles={containerStyles} horizontal tokens={{ childrenGap: '8px' }} verticalAlign="center">
      <Stack.Item styles={textStyles}>
        <QuestionCircle20Filled />
      </Stack.Item>
      <Stack.Item styles={textStyles}>{props.text}</Stack.Item>
    </Stack>
  );
};
