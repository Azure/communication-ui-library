// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { CameraButton } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../../../controlsUtils';
import { CustomCameraButtonExample } from './snippets/Custom.snippet';
import { CameraButtonExample } from './snippets/Default.snippet';
import { CameraButtonWithDevicesMenuExample } from './snippets/WithDevicesMenu.snippet';
import { CameraButtonWithLabelExample } from './snippets/WithLabel.snippet';

export { Camera } from './Camera.story';

export const CustomCameraButtonExampleDocsOnly = {
  render: CustomCameraButtonExample
};

export const DefaultButtonExampleDocsOnly = {
  render: CameraButtonExample
};

export const CameraButtonWithDevicesMenuExampleDocsOnly = {
  render: CameraButtonWithDevicesMenuExample
};

export const CameraButtonWithLabelExampleDocsOnly = {
  render: CameraButtonWithLabelExample
};

const meta: Meta = {
  title: 'Components/ControlBar/Buttons/Camera',
  component: CameraButton,
  argTypes: {
    checked: controlsToAdd.checked,
    showLabel: controlsToAdd.showLabel,
    cameras: controlsToAdd.cameras,
    // Hiding auto-generated controls
    onToggleCamera: hiddenControl,
    localVideoViewOptions: hiddenControl,
    selectedCamera: hiddenControl,
    onSelectCamera: hiddenControl,
    strings: hiddenControl,
    styles: hiddenControl,
    labelKey: hiddenControl,
    disableTooltip: hiddenControl,
    tooltipId: hiddenControl,
    onRenderOnIcon: hiddenControl,
    onRenderOffIcon: hiddenControl,
    enableDeviceSelectionMenu: hiddenControl,
    onClickVideoEffects: hiddenControl
  },
  args: {
    checked: false,
    showLabel: false,
    cameras: [
      { id: 'camera1', name: 'Full HD Webcam' },
      { id: 'camera2', name: 'Macbook Pro Webcam' }
    ]
  }
};
export default meta;
