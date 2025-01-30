// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RealTimeTextModal as RealTimeTextModalExample } from '@azure/communication-react';
import { mergeStyles, PrimaryButton, Stack } from '@fluentui/react';
import React, { useState } from 'react';

const RealTimeTextModalStory = (): JSX.Element => {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <Stack>
      <PrimaryButton
        className={mergeStyles({ maxWidth: '13.5rem' })}
        onClick={() => {
          setShowModal(true);
        }}
      >
        {'Real Time Text Modal'}
      </PrimaryButton>
      <RealTimeTextModalExample
        showModal={showModal}
        onDismissModal={() => {
          alert('Real Time Text Modal closed');
          setShowModal(false);
        }}
        onStartRealTimeText={() => {
          alert('Real Time Text started');
        }}
      />{' '}
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const RealTimeTextModal = RealTimeTextModalStory.bind({});
