// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { DefaultButton, PrimaryButton, Stack, Link } from '@fluentui/react';
import { VideoCameraEmphasisIcon } from '@fluentui/react-icons-northstar';
import {
  endCallContainerStyle,
  endCallTitleStyle,
  buttonStyle,
  mainStackTokens,
  buttonsStackTokens,
  upperStackTokens,
  videoCameraIconStyle,
  bottomStackFooterStyle
} from './styles/EndCall.styles';

export interface EndCallProps {
  rejoinHandler(): void;
  homeHandler(): void;
}

export default function EndCall(props: EndCallProps): JSX.Element {
  const leftCall = 'You left the call';
  const goHomePage = 'Go to homepage';
  const rejoinCall = 'Rejoin call';

  return (
    <Stack verticalAlign="center" tokens={mainStackTokens} className={endCallContainerStyle}>
      <Stack tokens={upperStackTokens}>
        <div className={endCallTitleStyle}>{leftCall}</div>
        <Stack horizontal tokens={buttonsStackTokens}>
          <PrimaryButton className={buttonStyle} onClick={props.rejoinHandler}>
            <VideoCameraEmphasisIcon className={videoCameraIconStyle} size="medium" />
            {rejoinCall}
          </PrimaryButton>
          <DefaultButton className={buttonStyle} onClick={props.homeHandler}>
            {goHomePage}
          </DefaultButton>
        </Stack>
        <div className={bottomStackFooterStyle}>
          <Link href="https://github.com/Azure/Communication/issues">Give Feedback</Link>&nbsp;on this sample app on
          Github
        </div>
      </Stack>
    </Stack>
  );
}
