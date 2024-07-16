// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { MicrophoneButton } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../../../controlsUtils';
import { CustomMicrophoneButtonExample } from './snippets/Custom.snippet';
import { MicrophoneButtonExample } from './snippets/Default.snippet';
import { MicrophoneButtonWithDevicesMenuExample } from './snippets/WithDevicesMenu.snippet';
import { MicrophoneButtonWithLabelExample } from './snippets/WithLabel.snippet';

export { Microphone } from './Microphone.story';

export const MicrophoneButtonCustomExampleDocsOnly = {
  render: CustomMicrophoneButtonExample
};

export const MicrophoneButtonExampleDocsOnly = {
  render: MicrophoneButtonExample
};

export const MicrophoneButtonWithDevicesMenuExampleDocsOnly = {
  render: MicrophoneButtonWithDevicesMenuExample
};

export const MicrophoneButtonWithLabelExampleDocsOnly = {
  render: MicrophoneButtonWithLabelExample
};

const meta: Meta = {
  title: 'Components/ControlBar/Buttons/Microphone',
  component: MicrophoneButton,
  argTypes: {
    checked: controlsToAdd.checked,
    showLabel: controlsToAdd.showLabel,
    microphones: controlsToAdd.microphones,
    speakers: controlsToAdd.speakers,
    // Hiding auto-generated controls
    onToggleMicrophone: hiddenControl,
    selectedMicrophone: hiddenControl,
    selectedSpeaker: hiddenControl,
    onSelectMicrophone: hiddenControl,
    onSelectSpeaker: hiddenControl,
    strings: hiddenControl,
    styles: hiddenControl,
    labelKey: hiddenControl,
    disableTooltip: hiddenControl,
    tooltipId: hiddenControl,
    onRenderOnIcon: hiddenControl,
    onRenderOffIcon: hiddenControl,
    enableDeviceSelectionMenu: hiddenControl
  },
  args: {
    checked: false,
    showLabel: false,
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
