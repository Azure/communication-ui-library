// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CameraButton, CameraButtonProps, DEFAULT_COMPONENT_ICONS } from '@azure/communication-react';
import { initializeIcons, registerIcons } from '@fluentui/react';
import React, { useState } from 'react';
import { defaultControlsCameras } from '../../../../controlsUtils';

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

const CameraStory = (args: any): JSX.Element => {
  return <CameraButtonWithDevices {...args} />;
};

const CameraButtonWithDevices = (props: CameraButtonProps): JSX.Element => {
  const [selectedCamera, setSelectedCamera] = useState<{ id: string; name: string }>(defaultControlsCameras[0]);
  const deviceProps: CameraButtonProps = {
    selectedCamera,
    onSelectCamera: async (device: { id: string; name: string }) => {
      setSelectedCamera(device);
    },
    onToggleCamera: async (): Promise<void> => {
      /* Need a defined callback to show split button */
    }
  };
  return <CameraButton {...props} {...deviceProps} />;
};

export const Camera = CameraStory.bind({});
