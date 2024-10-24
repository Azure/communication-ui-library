// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStackStyles, Stack } from '@fluentui/react';
import { RTTDisclosureBanner as RTTDisclosureBannerComponent } from '@internal/react-components';
import React from 'react';

export const RTTDisclosureBanner = (): JSX.Element => {
  return (
    <Stack styles={containerStyles}>
      <RTTDisclosureBannerComponent />
    </Stack>
  );
};

const containerStyles: IStackStyles = {
  root: {
    width: '80%',
    height: '80%'
  }
};
