// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { DefaultButton, PrimaryButton, Stack, Text } from '@fluentui/react';
import { Video20Filled } from '@fluentui/react-icons';
import {
  endCallContainerStyle,
  endCallTitleStyle,
  buttonStyle,
  mainStackTokens,
  buttonsStackTokens,
  upperStackTokens,
  videoCameraIconStyle,
  bottomStackFooterStyle
} from '../styles/EndCall.styles';

export interface CallErrorProps {
  rejoinHandler(): void;
  homeHandler(): void;
  title?: string;
  reason?: string;
}

export const CallError = (props: CallErrorProps): JSX.Element => {
  const title = props.title ?? 'Error joining the Call';
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
          {title}
        </Text>
        <Stack horizontal tokens={buttonsStackTokens}>
          <PrimaryButton className={buttonStyle} onClick={props.rejoinHandler}>
            <Video20Filled className={videoCameraIconStyle} primaryFill="currentColor" />
            {rejoinCall}
          </PrimaryButton>
          <DefaultButton className={buttonStyle} onClick={props.homeHandler}>
            {goHomePage}
          </DefaultButton>
        </Stack>
        <div className={bottomStackFooterStyle}>
          {props.reason ? (
            props.reason
          ) : (
            <>
              Common reasons for this error:
              <ul>
                <li>Incorrect Teams Meeting URL</li>
                <li>Incorrect Group Call ID</li>
              </ul>
            </>
          )}
        </div>
      </Stack>
    </Stack>
  );
};
