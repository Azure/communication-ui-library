// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import {
  _DrawerMenu as DrawerMenuComponent,
  _DrawerMenuItemProps,
  _DrawerMenuStyles
} from '@internal/react-components';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { hiddenControl } from '../../controlsUtils';
import { MobilePreviewContainer } from '../../MobileContainer';

const DrawerMenuStory = (/*args*/): JSX.Element => {
  const [isDrawerShowing, setIsDrawerShowing] = useState(true);

  const drawerMenuItems: _DrawerMenuItemProps[] = [
    {
      key: 'raiseHand',
      text: 'Raise hand',
      iconProps: { iconName: 'RightHand', styles: iconStyles },
      onItemClick: () => setIsDrawerShowing(false)
    },
    {
      key: 'speaker',
      text: 'Speaker',
      iconProps: { iconName: 'OptionsSpeaker', styles: iconStyles },
      onItemClick: () => setIsDrawerShowing(false)
    },
    {
      key: 'people',
      text: 'People',
      iconProps: { iconName: 'Participants', styles: iconStyles },
      onItemClick: () => setIsDrawerShowing(false)
    },
    {
      key: 'recording',
      text: 'Start Recording',
      iconProps: { iconName: 'Record', styles: iconStyles },
      onItemClick: () => setIsDrawerShowing(false)
    }
  ];

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
      {isDrawerShowing && <DrawerMenuComponent items={drawerMenuItems} onLightDismiss={onLightDismissTriggered} />}
    </MobilePreviewContainer>
  );
};

const iconStyles = { root: { fontSize: '1.5rem' } };

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const DrawerMenu = DrawerMenuStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-drawermenu`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/Drawer/Drawer Menu`,
  component: DrawerMenuComponent,
  argTypes: {
    onLightDismiss: hiddenControl,
    styles: hiddenControl,
    items: hiddenControl
  }
} as Meta;
