// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { Meta } from '@storybook/react/*';
import { controlsToAdd } from '../../controlsUtils';
import { LocalPreview as LocalPreviewExample } from './LocalPreview.story';

export const LocalPreview = {
  render: LocalPreviewExample
};

export default {
  id: 'examples-localpreview',
  title: 'Examples/Local Preview',
  component: LocalPreviewExample,
  argTypes: {
    isVideoAvailable: controlsToAdd.isVideoAvailable,
    isCameraEnabled: controlsToAdd.isCameraEnabled,
    isMicrophoneEnabled: controlsToAdd.isMicrophoneEnabled
  },
  args: {
    isVideoAvailable: false,
    isCameraEnabled: true,
    isMicrophoneEnabled: true
  }
} as Meta;
