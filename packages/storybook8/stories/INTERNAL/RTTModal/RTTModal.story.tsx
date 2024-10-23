// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles, PrimaryButton, Stack } from '@fluentui/react';
import { RTTModal as RTTModalExample } from '@internal/react-components';
import React, { useState } from 'react';

const RTTModalStory = (args: any): JSX.Element => {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <Stack>
      <PrimaryButton
        className={mergeStyles({ maxWidth: '13.5rem' })}
        onClick={() => {
          setShowModal(true);
        }}
      >
        {'RTT Modal'}
      </PrimaryButton>
      <RTTModalExample
        showModal={showModal}
        onDismissModal={() => {
          setShowModal(false);
        }}
        onStartRTT={() => {
          console.log('RTT started');
          return Promise.resolve();
        }}
      />{' '}
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const RTTModal = RTTModalStory.bind({});
