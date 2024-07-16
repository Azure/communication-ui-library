// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { MicrophoneButton, MicrophoneButtonProps } from '@azure/communication-react';
import React, { useState } from 'react';
import { defaultControlsMicrophones, defaultControlsSpeakers } from '../../../../controlsUtils';

const MicrophoneStory = (args: any): JSX.Element => {
  return <MicrophoneButtonWithDevices {...args} />;
};

const MicrophoneButtonWithDevices = (props: MicrophoneButtonProps): JSX.Element => {
  const [selectedMicrophone, setSelectedMicrophone] = useState<{ id: string; name: string }>(
    defaultControlsMicrophones[0]
  );
  const [selectedSpeaker, setSelectedSpeaker] = useState<{ id: string; name: string }>(defaultControlsSpeakers[0]);

  const deviceProps: MicrophoneButtonProps = {
    selectedMicrophone: selectedMicrophone,
    selectedSpeaker: selectedSpeaker,
    onSelectMicrophone: async (device: { id: string; name: string }) => {
      setSelectedMicrophone(device);
    },
    onSelectSpeaker: async (device: { id: string; name: string }) => {
      setSelectedSpeaker(device);
    },
    onToggleMicrophone: async (): Promise<void> => {
      /* Need a defined callback to show split button */
    }
  };

  return <MicrophoneButton {...props} {...deviceProps} />;
};

export const Microphone = MicrophoneStory.bind({});
