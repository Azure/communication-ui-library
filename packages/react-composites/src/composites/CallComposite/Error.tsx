// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { PrimaryButton, Stack } from '@fluentui/react';
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
} from './styles/Error.styles';

export interface ErrorProps {
  rejoinHandler(): void;
  title?: string;
  reason?: string;
}

export function Error(props: ErrorProps): JSX.Element {
  const title = props.title ?? 'Error joining the Call';
  const rejoinCall = 'Retry Call';

  return (
    <Stack verticalAlign="center" tokens={mainStackTokens} className={endCallContainerStyle}>
      <Stack tokens={upperStackTokens}>
        <div className={endCallTitleStyle}>{title}</div>
        <Stack horizontal tokens={buttonsStackTokens}>
          <PrimaryButton className={buttonStyle} onClick={props.rejoinHandler}>
            <Video20Filled primaryFill="currentColor" className={videoCameraIconStyle} />
            {rejoinCall}
          </PrimaryButton>
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
}
