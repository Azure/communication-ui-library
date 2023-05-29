// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { _DrawerSurface as DrawerSurfaceComponent, _DrawerSurfaceStyles } from '@internal/react-components';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { hiddenControl } from '../../controlsUtils';
import { MobilePreviewContainer } from '../../MobileContainer';
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

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-drawersurface`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/Drawer/Drawer Surface`,
  component: DrawerSurfaceComponent,
  argTypes: {
    children: hiddenControl,
    onLightDismiss: hiddenControl,
    styles: hiddenControl
  }
} as Meta;
