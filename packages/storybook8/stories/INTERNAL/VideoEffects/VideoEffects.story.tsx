// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { registerIcons } from '@fluentui/react';
import { ImageAdd20Regular, VideoBackgroundEffect20Regular, VideoPerson20Filled } from '@fluentui/react-icons';
import {
  _VideoEffectsItemNoBackground,
  _VideoEffectsItemBlur,
  _VideoEffectsItemAddImage
} from '@internal/react-components';
import React from 'react';
import { VideoBackgroundEffectsPicker } from './snippets/VideoBackgroundEffectsPicker.snippet';

registerIcons({
  icons: {
    VideoEffectsNone: <VideoPerson20Filled />,
    VideoEffectsBlur: <VideoBackgroundEffect20Regular />,
    VideoEffectsAddImage: <ImageAdd20Regular />
  }
});

export const VideoEffects = VideoBackgroundEffectsPicker.bind({});
