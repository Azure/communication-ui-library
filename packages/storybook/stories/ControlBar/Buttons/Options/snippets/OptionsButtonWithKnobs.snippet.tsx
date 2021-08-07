// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { OptionsButton, OptionsButtonProps } from '@azure/communication-react';
import React, { useState } from 'react';
import { defaultControlsCameras, defaultControlsMicrophones, defaultControlsSpeakers } from '../../../../controlsUtils';

export const OptionsButtonWithKnobs = (args): JSX.Element => {
  const [selectedCamera, setSelectedCamera] = useState<{ id: string; name: string }>(defaultControlsCameras[0]);
  const [selectedMicrophone, setSelectedMicrophone] = useState<{ id: string; name: string }>(
    defaultControlsMicrophones[0]
  );
  const [selectedSpeaker, setSelectedSpeaker] = useState<{ id: string; name: string }>(defaultControlsSpeakers[0]);

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
