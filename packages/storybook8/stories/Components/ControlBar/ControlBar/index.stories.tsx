// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { ControlBar as ControlBarComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../../controlsUtils';
import { AllButtonsControlBarExample } from './snippets/AllButtonsControlBar.snippet';
import { ControlBarLayoutExample } from './snippets/ControlBarLayout.snippet';
import { CustomButtonsExample } from './snippets/CustomButtons.snippet';
import { CustomControlBarStylesExample } from './snippets/CustomControlBarStyles.snippet';
import { DevicesButtonExample } from './snippets/DevicesButton.snippet';

export { ControlBar } from './ControlBar.story';

export const AllButtonsControlBarExampleDocsOnly = {
  render: AllButtonsControlBarExample
};

export const ControlBarLayoutExampleDocsOnly = {
  render: ControlBarLayoutExample
};

export const CustomButtonsExampleDocsOnly = {
  render: CustomButtonsExample
};

export const CustomControlBarStylesExampleDocsOnly = {
  render: CustomControlBarStylesExample
};

export const DevicesButtonExampleDocsOnly = {
  render: DevicesButtonExample
};

const meta: Meta = {
  title: 'Components/ControlBar/Control Bar',
  component: ControlBarComponent,
  argTypes: {
    layout: controlsToAdd.controlBarLayout,
    checked: controlsToAdd.checked,
    showLabel: controlsToAdd.showLabel,
    // Initializing and hiding some Options controls
    cameras: controlsToAdd.cameras,
    microphones: controlsToAdd.microphones,
    speakers: controlsToAdd.speakers,
    // Hiding auto-generated controls
    children: hiddenControl,
    styles: hiddenControl
  },
  args: {
    layout: 'floatingBottom',
    checked: false,
    showLabel: false,
    cameras: [
      { id: 'camera1', name: 'Full HD Webcam' },
      { id: 'camera2', name: 'Macbook Pro Webcam' }
    ],
    microphones: [
      { id: 'mic1', name: 'Realtek HD Audio' },
      { id: 'mic2', name: 'Macbook Pro Mic' }
    ],
    speakers: [
      { id: 'speaker1', name: 'Realtek HD Audio' },
      { id: 'speaker2', name: 'Macbook Pro Speaker' }
    ]
  }
};
export default meta;
