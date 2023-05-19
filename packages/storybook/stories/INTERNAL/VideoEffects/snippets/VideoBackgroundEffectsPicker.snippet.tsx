// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { registerIcons } from '@fluentui/react';
import { ImageAdd20Regular, VideoBackgroundEffect20Regular, VideoPerson20Filled } from '@fluentui/react-icons';
import { _VideoBackgroundEffectsPicker, _VideoBackgroundEffectChoiceOption } from '@internal/react-components';
import React from 'react';

registerIcons({
  icons: {
    VideoEffectsNone: <VideoPerson20Filled />,
    VideoEffectsBlur: <VideoBackgroundEffect20Regular />,
    VideoEffectsAddImage: <ImageAdd20Regular />
  }
});

export const VideoBackgroundEffectsPicker = (): JSX.Element => {
  return (
    <_VideoBackgroundEffectsPicker
      options={selectableVideoEffects}
      label={'Background'}
      defaultSelectedEffectKey={'blur'}
    />
  );
};

const selectableVideoEffects: _VideoBackgroundEffectChoiceOption[] = [
  {
    itemKey: 'none',
    iconProps: {
      iconName: 'VideoEffectsNone'
    },
    title: 'None',
    tooltipProps: {
      content: 'Remove Background'
    }
  },
  {
    itemKey: 'blur',
    iconProps: {
      iconName: 'VideoEffectsBlur'
    },
    title: 'Blurred',
    tooltipProps: {
      content: 'Blur Background'
    }
  },
  {
    itemKey: 'addImage',
    iconProps: {
      iconName: 'VideoEffectsAddImage'
    },
    title: 'Image',
    tooltipProps: {
      content: 'Upload Background Image'
    }
  },
  {
    itemKey: 'customBackground1',
    backgroundProps: {
      url: 'images/video-background-effects/bg1.jpg'
    },
    tooltipProps: {
      content: 'Custom Background 1'
    }
  },
  {
    itemKey: 'customBackground2',
    backgroundProps: {
      url: 'images/video-background-effects/bg2.jpg'
    },
    tooltipProps: {
      content: 'Custom Background 2'
    }
  },
  {
    itemKey: 'customBackground3',
    backgroundProps: {
      url: 'images/video-background-effects/bg3.jpg'
    },
    tooltipProps: {
      content: 'Custom Background 3'
    }
  },
  {
    itemKey: 'customBackground4',
    backgroundProps: {
      url: 'images/video-background-effects/bg4.png'
    },
    tooltipProps: {
      content: 'Custom Background 4'
    }
  },
  {
    itemKey: 'customBackground5',
    backgroundProps: {
      url: 'images/video-background-effects/bg5.png'
    },
    tooltipProps: {
      content: 'Custom Background 5'
    }
  },
  {
    itemKey: 'customBackground6',
    backgroundProps: {
      url: 'images/video-background-effects/bg6.png'
    },
    tooltipProps: {
      content: 'Custom Background 6'
    }
  }
];
