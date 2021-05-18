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
  const title = 'Error joing the Call';
  const goHomePage = 'Go to Homepage';
  const rejoinCall = 'Retry Call';

  return (
    <Stack verticalAlign="center" tokens={mainStackTokens} className={endCallContainerStyle}>
      <Stack tokens={upperStackTokens}>
        <div className={endCallTitleStyle}>{title}</div>
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
          Common reasons for this error:
          <ul>
            <li>Incorrect Teams Meeting URL</li>
            <li>Incorrect Group Call ID</li>
          </ul>
        </div>
      </Stack>
    </Stack>
  );
}
