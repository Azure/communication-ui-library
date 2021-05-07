// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PrimaryButton, Stack } from '@fluentui/react';
import React from 'react';

import { buttonStyle, mainContainerStyle } from './styles/MakeCall.styles';

export interface MakeCallScreenProps {
  acknowledgeCallback(): void;
}

const callFailedText = 'Call Ended';
const acknowledgeButtonText = 'Call again!';

export const CallEndScreen = (props: MakeCallScreenProps): JSX.Element => {
  const { acknowledgeCallback } = props;

  return (
    <Stack className={mainContainerStyle} horizontalAlign="center" verticalAlign="center">
      {callFailedText}
      <PrimaryButton className={buttonStyle} onClick={acknowledgeCallback}>
        {acknowledgeButtonText}
      </PrimaryButton>
    </Stack>
  );
};
