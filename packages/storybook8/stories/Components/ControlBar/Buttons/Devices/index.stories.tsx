// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { DevicesButton } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../../../controlsUtils';
import { DevicesButtonCustomExample } from './snippets/Custom.snippet';
import { DevicesButtonDefaultExample } from './snippets/Default.snippet';
import { DevicesButtonWithKnobs } from './snippets/DevicesButtonWithKnobs.snippet';
import { DevicesButtonWithLabelExample } from './snippets/WithLabel.snippet';

export { Devices } from './Devices.story';

export const DevicesButtonCustomExampleDocsOnly = {
  render: DevicesButtonCustomExample
};

export const DevicesButtonDefaultExampleDocsOnly = {
  render: DevicesButtonDefaultExample
};

export const DevicesButtonWithKnobsDocsOnly = {
  render: DevicesButtonWithKnobs
};

export const DevicesButtonWithLabelExampleDocsOnly = {
  render: DevicesButtonWithLabelExample
};

const meta: Meta = {
  title: 'Components/ControlBar/Buttons/Devices',
  component: DevicesButton,
  argTypes: {
    showLabel: controlsToAdd.showLabel,
    cameras: controlsToAdd.cameras,
    microphones: controlsToAdd.microphones,
    speakers: controlsToAdd.speakers,
    // Hiding auto-generated controls
    selectedMicrophone: hiddenControl,
    selectedSpeaker: hiddenControl,
    selectedCamera: hiddenControl,
    onSelectCamera: hiddenControl,
    onSelectMicrophone: hiddenControl,
    onSelectSpeaker: hiddenControl,
    strings: hiddenControl,
    styles: hiddenControl
  },
  args: {
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
