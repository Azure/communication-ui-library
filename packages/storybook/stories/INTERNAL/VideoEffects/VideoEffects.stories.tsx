// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { registerIcons, Stack } from '@fluentui/react';
import { ImageAdd20Regular, VideoBackgroundEffect20Regular, VideoPerson20Filled } from '@fluentui/react-icons';
import { _VideoEffectsItemNone, _VideoEffectsItemBlur, _VideoEffectsItemAddImage } from '@internal/react-components';
import { Canvas, Description, Heading, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { SingleLineBetaBanner } from '../../BetaBanners/SingleLineBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { SelectableVideoEffects } from './snippets/SelectableVideoEffects.snippet';
import { VideoBackgroundEffectsPicker } from './snippets/VideoBackgroundEffectsPicker.snippet';

const SelectableVideoEffectsExample = require('!!raw-loader!./snippets/SelectableVideoEffects.snippet.tsx').default;
const VideoBackgroundEffectsPickerExample =
  require('!!raw-loader!./snippets/VideoBackgroundEffectsPicker.snippet.tsx').default;

registerIcons({
  icons: {
    VideoEffectsNone: <VideoPerson20Filled />,
    VideoEffectsBlur: <VideoBackgroundEffect20Regular />,
    VideoEffectsAddImage: <ImageAdd20Regular />
  }
});

const getDocs: () => JSX.Element = () => {
  /* eslint-disable react/no-unescaped-entities */
  return (
    <Stack>
      <Title>Video Background Effects</Title>
      <SingleLineBetaBanner />
      <Description>Components to allow a user to select video background effects.</Description>
      <Heading>Video Background Effects Items</Heading>
      <Description>A selection of premade video effects items.</Description>
      <Canvas mdxSource={SelectableVideoEffectsExample}>
        <SelectableVideoEffects />
      </Canvas>
      <Heading>Video Background Effects Picker</Heading>
      <Description>The picker can be used as a choice group to allow users to select backgrounds</Description>
      <Canvas mdxSource={VideoBackgroundEffectsPickerExample}>
        <VideoBackgroundEffectsPicker />
      </Canvas>
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const VideoEffects = VideoBackgroundEffectsPicker.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-video-effects`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/Video Effects`,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
