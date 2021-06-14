// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { OptionsButton } from '@azure/communication-react';
import { boolean, object } from '@storybook/addon-knobs';
import React, { useState } from 'react';
import { OptionsButtonProps } from 'react-composites/node_modules/react-components';

export const OptionsButtonWithKnobs = (props: { showLabel?: boolean }): JSX.Element => {
  const showLabel = props.showLabel ?? boolean('Show Label', false);

  const exampleCameras: { id: string; name: string }[] = object('Cameras', [
    { id: 'camera1', name: 'Full HD Webcam' },
    { id: 'camera2', name: 'Macbook Pro Webcam' }
  ]);

  const exampleMicrophones: { id: string; name: string }[] = object('Microphones', [
    { id: 'mic1', name: 'Realtek HD Audio' },
    { id: 'mic2', name: 'Macbook Pro Mic' }
  ]);

  const exampleSpeakers: { id: string; name: string }[] = object('Speakers', [
    { id: 'speaker1', name: 'Realtek HD Audio' },
    { id: 'speaker2', name: 'Macbook Pro Speaker' }
  ]);

  const [selectedCamera, setSelectedCamera] = useState<{ id: string; name: string }>(exampleCameras[0]);
  const [selectedMicrophone, setSelectedMicrophone] = useState<{ id: string; name: string }>(exampleMicrophones[0]);
  const [selectedSpeaker, setSelectedSpeaker] = useState<{ id: string; name: string }>(exampleSpeakers[0]);

  const exampleOptionProps: OptionsButtonProps = {
    cameras: exampleCameras,
    microphones: exampleMicrophones,
    speakers: exampleSpeakers,
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

  return <OptionsButton showLabel={showLabel} {...exampleOptionProps} />;
};
