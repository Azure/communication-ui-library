// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DefaultButton, Stack, Text } from '@fluentui/react';
import {
  bottomStackFooterStyle,
  buttonStyle,
  buttonWithIconStyles,
  buttonsStackTokens,
  endChatContainerStyle,
  endChatTitleStyle,
  mainStackTokens,
  upperStackTokens
} from './styles/EndChat.styles';

import React from 'react';

export interface ErrorEndCallProps {
  title: string;
  homeHandler(): void;
}

export const ErrorScreen = (props: ErrorEndCallProps): JSX.Element => {
  const goHomePage = 'Go to homepage';

  return (
    <Stack
      horizontal
      wrap
      horizontalAlign="center"
      verticalAlign="center"
      tokens={mainStackTokens}
      className={endChatContainerStyle}
    >
      <Stack tokens={upperStackTokens}>
        <Text role={'heading'} aria-level={1} className={endChatTitleStyle}>
          {props.title}
        </Text>
        <Stack horizontal tokens={buttonsStackTokens}>
          <DefaultButton
            className={buttonStyle}
            styles={buttonWithIconStyles}
            text={goHomePage}
            onClick={props.homeHandler}
          />
        </Stack>
        <div className={bottomStackFooterStyle}>
          <a href="https://github.com/Azure/Communication/issues">Give Feedback</a>
          &nbsp;on this sample app on Github
        </div>
      </Stack>
    </Stack>
  );
};
