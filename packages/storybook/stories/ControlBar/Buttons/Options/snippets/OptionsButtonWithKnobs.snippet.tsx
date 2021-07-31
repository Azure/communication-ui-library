// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { OptionsButton, OptionsButtonProps } from '@azure/communication-react';
import React, { useState } from 'react';

export const exampleCameras: { id: string; name: string }[] = [
  { id: 'camera1', name: 'Full HD Webcam' },
  { id: 'camera2', name: 'Macbook Pro Webcam' }
];

export const exampleMicrophones: { id: string; name: string }[] = [
  { id: 'mic1', name: 'Realtek HD Audio' },
  { id: 'mic2', name: 'Macbook Pro Mic' }
];

export const exampleSpeakers: { id: string; name: string }[] = [
  { id: 'speaker1', name: 'Realtek HD Audio' },
  { id: 'speaker2', name: 'Macbook Pro Speaker' }
];

export const OptionsButtonWithKnobs: (args) => JSX.Element = (args) => {
  const [selectedCamera, setSelectedCamera] = useState<{ id: string; name: string }>(exampleCameras[0]);
  const [selectedMicrophone, setSelectedMicrophone] = useState<{ id: string; name: string }>(exampleMicrophones[0]);
  const [selectedSpeaker, setSelectedSpeaker] = useState<{ id: string; name: string }>(exampleSpeakers[0]);

  const exampleOptionProps: OptionsButtonProps = {
    selectedCamera: selectedCamera,
    selectedMicrophone: selectedMicrophone,
    selectedSpeaker: selectedSpeaker,
    onSelectCamera: async (device: { id: string; name: string }) => {
      setSelectedCamera(device);
    },
    onSelectMicrophone: async (device: { id: string; name: string }) => {
      setSelectedMicrophone(device);
    },
    onSelectSpeaker: async (device: { id: string; name: string }) => {
      setSelectedSpeaker(device);
    }
  };

  return <OptionsButton {...args} {...exampleOptionProps} />;
};
