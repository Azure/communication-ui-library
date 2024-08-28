// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import { _DrawerSurface as DrawerSurfaceComponent, _DrawerSurfaceStyles } from '@internal/react-components';
import React, { useState } from 'react';
import { MobilePreviewContainer } from '../../../MobileContainer';
import { PowerpointContent } from './PowerpointContent';

const DrawerSurfaceStory = (/*args*/): JSX.Element => {
  const [isDrawerShowing, setIsDrawerShowing] = useState(true);

  const onLightDismissTriggered = (): void => setIsDrawerShowing(false);
  return (
    <MobilePreviewContainer>
      {!isDrawerShowing && (
        <Stack
          styles={{ root: { cursor: 'pointer' } }}
          verticalFill
          verticalAlign="center"
          horizontalAlign="center"
          onClick={() => setIsDrawerShowing(true)}
        >
          Click to show drawer
        </Stack>
      )}
      {isDrawerShowing && (
        <DrawerSurfaceComponent disableMaxHeight={true} onLightDismiss={onLightDismissTriggered}>
          <PowerpointContent />
        </DrawerSurfaceComponent>
      )}
    </MobilePreviewContainer>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const DrawerSurface = DrawerSurfaceStory.bind({});
