// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PrimaryButton, Stack, Text } from '@fluentui/react';
import React from 'react';

/** private */
export const PermissionSuccessScreen = (props: { onNextClick?: () => void }): JSX.Element => {
  return (
    <Stack verticalFill verticalAlign="center" horizontalAlign="center" tokens={{ childrenGap: '1rem' }}>
      <Text variant="xLarge">Success</Text>
      <Text variant="medium">Next page would be the call composite configuration screen</Text>
      <PrimaryButton onClick={props.onNextClick}>Or perhaps...</PrimaryButton>
    </Stack>
  );
};

/** private */
export const CompositeNextSuccessScreen = (): JSX.Element => {
  return (
    <Stack verticalFill verticalAlign="center" horizontalAlign="center" tokens={{ childrenGap: '1rem' }}>
      <Text variant="xLarge">Success</Text>
      <Text variant="medium">Next page would be the call composite configuration screen</Text>
    </Stack>
  );
};
