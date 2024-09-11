// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Meta } from '@storybook/react';
import { SelectableVideoEffects } from './snippets/SelectableVideoEffects.snippet';
import { VideoBackgroundEffectsPicker } from './snippets/VideoBackgroundEffectsPicker.snippet';

export { VideoEffects } from './VideoEffects.story';

export const VideoBackgroundEffectsPickerExampleDocsOnly = {
  render: VideoBackgroundEffectsPicker
};

export const SelectableVideoEffectsExampleDocsOnly = {
  render: SelectableVideoEffects
};

const meta: Meta = {
  title: 'Components/Internal/Video Effects',
  component: VideoBackgroundEffectsPicker,
  argTypes: {}
};

export default meta;
