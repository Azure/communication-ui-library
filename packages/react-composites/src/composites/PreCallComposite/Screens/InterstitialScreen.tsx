// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  getTheme,
  ISpinnerStyles,
  IStackStyles,
  ITextStyles,
  Spinner,
  SpinnerSize,
  Stack,
  Text
} from '@fluentui/react';
import React from 'react';

/** private */
export interface InterstitialScreenProps {
  meetingName?: string;
  meetingDescription?: string;
}

/** private */
export const InterstitialScreen = (props: InterstitialScreenProps): JSX.Element => {
  return (
    <Stack tokens={{ childrenGap: '4rem' }} verticalFill verticalAlign="center" horizontalAlign="center">
      <Stack.Item>
        <Stack tokens={{ childrenGap: '1rem' }}>
          <Text variant="xLarge" styles={textStylesBase}>
            {props.meetingName ?? 'Meeting name'}
          </Text>
          <Text variant="medium" styles={textStylesBase}>
            {props.meetingDescription ?? 'Some details about the meeting'}
          </Text>
        </Stack>
      </Stack.Item>
      <Stack.Item>
        <Stack>
          <Stack styles={spinnerBackgroundStyles}>
            <Spinner styles={spinnerStyles} size={SpinnerSize.large} />
          </Stack>
          <Stack tokens={{ childrenGap: '1rem' }}>
            <Text variant="xLarge" styles={textStylesBase}>
              Preparing your session
            </Text>
            <Text variant="medium" styles={textStylesBase}>
              Please be patient
            </Text>
          </Stack>
        </Stack>
      </Stack.Item>
    </Stack>
  );
};

const spinnerStyles: ISpinnerStyles = {
  circle: {
    height: `${44 / 16}rem`,
    width: `${44 / 16}rem`,
    borderWidth: '2.5px'
  }
};

const spinnerBackgroundStyles: IStackStyles = {
  root: {
    borderRadius: '100%',
    background: getTheme().palette.themeLighterAlt, // todo: use useTheme
    margin: '2rem auto',
    padding: '1.5rem'
  }
};

const textStylesBase: ITextStyles = {
  root: {
    textAlign: 'center'
  }
};
