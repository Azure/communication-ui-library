// © Microsoft Corporation. All rights reserved.

import { DefaultButton, Stack } from '@fluentui/react';
import {
  bottomStackFooterStyle,
  buttonStyle,
  buttonsStackTokens,
  endCallContainerStyle,
  endCallTitleStyle,
  mainStackTokens,
  upperStackTokens
} from './styles/EndChat.styles';

import React from 'react';

export interface ErrorEndCallProps {
  homeHandler(): void;
}

export default (props: ErrorEndCallProps): JSX.Element => {
  const leftCall = 'Oops! You are no longer a participant for the chat thread.';
  const goHomePage = 'Go to homepage';

  return (
    <Stack verticalAlign="center" tokens={mainStackTokens} className={endCallContainerStyle}>
      <Stack tokens={upperStackTokens}>
        <div tabIndex={0} className={endCallTitleStyle}>
          {leftCall}
        </div>
        <Stack horizontal tokens={buttonsStackTokens}>
          <DefaultButton className={buttonStyle} onClick={props.homeHandler}>
            {goHomePage}
          </DefaultButton>
        </Stack>
      </Stack>
      <div className={bottomStackFooterStyle}>
        <a href="https://github.com/Azure/Communication/issues">Give Feedback</a>
        &nbsp;on this sample app on Github
      </div>
    </Stack>
  );
};
