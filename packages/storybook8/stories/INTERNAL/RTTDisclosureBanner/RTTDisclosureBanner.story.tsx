// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStackStyles, Stack } from '@fluentui/react';
import { RTTDisclosureBanner as RTTDisclosureBannerComponent } from '@internal/react-components';
import { _useCompositeLocale } from '@internal/react-composites';
import React from 'react';

const RTTDisclosureBannerStory = (): JSX.Element => {
  return (
    <Stack styles={containerStyles}>
      <RTTDisclosureBannerComponent
        onClickLink={() => {
          alert('Link Clicked');
        }}
      />
    </Stack>
  );
};

const containerStyles: IStackStyles = {
  root: {
    width: '80%',
    height: '80%'
  }
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const RTTDisclosureBanner = RTTDisclosureBannerStory.bind({});
