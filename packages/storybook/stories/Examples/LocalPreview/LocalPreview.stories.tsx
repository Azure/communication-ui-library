import { boolean } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { getDocs } from './LocalPreviewDocs';
import { LocalPreviewExample } from './snippets/LocalPreviewExample.snippet';

export const LocalPreview: () => JSX.Element = () => {
  const isVideoAvailable = boolean('Is video available', true);
  const isCameraEnabled = boolean('Is camera available', true);
  const isMicrophoneEnabled = boolean('Is microphone available', true);

  return (
    <LocalPreviewExample
      isVideoAvailable={isVideoAvailable}
      isCameraEnabled={isCameraEnabled}
      isMicrophoneEnabled={isMicrophoneEnabled}
    />
  );
};

export default {
  title: `${EXAMPLES_FOLDER_PREFIX}/Local Preview`,
  component: LocalPreview,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
