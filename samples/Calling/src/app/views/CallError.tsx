// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { DefaultButton, PrimaryButton, Stack, Text } from '@fluentui/react';
import { Video20Filled } from '@fluentui/react-icons';
import {
  endCallContainerStyle,
  endCallTitleStyle,
  buttonStyle,
  buttonWithIconStyles,
  mainStackTokens,
  buttonsStackTokens,
  upperStackTokens,
  videoCameraIconStyle,
  bottomStackFooterStyle
} from '../styles/EndCall.styles';

export interface CallErrorProps {
  title: string;
  reason: string;
  rejoinHandler(): void;
  homeHandler(): void;
}

export const CallError = (props: CallErrorProps): JSX.Element => {
  const goHomePage = 'Go to Homepage';
  const rejoinCall = 'Retry Call';

  return (
    <Stack
      horizontal
      wrap
      horizontalAlign="center"
      verticalAlign="center"
      tokens={mainStackTokens}
      className={endCallContainerStyle}
    >
      <Stack tokens={upperStackTokens}>
        <Text role={'heading'} aria-level={1} className={endCallTitleStyle}>
          {props.title}
        </Text>
        <Stack horizontal tokens={buttonsStackTokens}>
          <PrimaryButton
            className={buttonStyle}
            styles={buttonWithIconStyles}
            text={rejoinCall}
            onClick={props.rejoinHandler}
            onRenderIcon={() => <Video20Filled className={videoCameraIconStyle} primaryFill="currentColor" />}
          />
          <DefaultButton
            className={buttonStyle}
            styles={buttonWithIconStyles}
            text={goHomePage}
            onClick={props.homeHandler}
          />
        </Stack>
        <div className={bottomStackFooterStyle}>{props.reason}</div>
      </Stack>
    </Stack>
  );
};
