import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { boolean } from '@storybook/addon-knobs';
import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { getDocs } from './LocalPreviewDocs';

import { LocalPreviewExample } from './snippets/LocalPreview.snippet';

export const LocalPreviewComponent: () => JSX.Element = () => {
  const isVideoReady = boolean('Show Video', true);
  const isCameraEnabled = boolean('Is camera available', true);
  const isMicrophoneEnabled = boolean('Is microphone available', true);

  return (
    <LocalPreviewExample
      isVideoReady={isVideoReady}
      isCameraEnabled={isCameraEnabled}
      isMicrophoneEnabled={isMicrophoneEnabled}
    />
  );
};

export default {
  title: `${EXAMPLES_FOLDER_PREFIX}/LocalPreview`,
  component: LocalPreviewComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
