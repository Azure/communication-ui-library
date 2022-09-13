// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack, Text } from '@fluentui/react';
import React from 'react';

/** private */
export const SuccessScreen = (): JSX.Element => {
  return (
    <Stack verticalFill verticalAlign="center" horizontalAlign="center" tokens={{ childrenGap: '1rem' }}>
      <Text variant="xLarge">Success</Text>
      <Text variant="medium">Next page would be the call composite configuration screen</Text>
    </Stack>
  );
};
