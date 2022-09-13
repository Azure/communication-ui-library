// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PrimaryButton, Stack } from '@fluentui/react';
import React from 'react';

/** private */
export interface LandingScreenProps {
  onStart: () => void;
}

/** private */
export const LandingScreen = (props: LandingScreenProps): JSX.Element => {
  return (
    <Stack verticalFill verticalAlign="center" horizontalAlign="center">
      <PrimaryButton onClick={props.onStart}>Begin</PrimaryButton>
    </Stack>
  );
};
