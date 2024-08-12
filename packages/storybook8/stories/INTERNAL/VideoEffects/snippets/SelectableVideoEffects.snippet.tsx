// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { registerIcons, Stack } from '@fluentui/react';
import { ImageAdd20Regular, VideoBackgroundEffect20Regular, VideoPerson20Filled } from '@fluentui/react-icons';
import {
  _VideoEffectsItemNoBackground,
  _VideoEffectsItemBlur,
  _VideoEffectsItemAddImage,
  _VideoEffectsItem
} from '@internal/react-components';
import React from 'react';

registerIcons({
  icons: {
    VideoEffectsNone: <VideoPerson20Filled />,
    VideoEffectsBlur: <VideoBackgroundEffect20Regular />,
    VideoEffectsAddImage: <ImageAdd20Regular />
  }
});

const sampleBackgrounds = [
  'images/video-background-effects/bg1.jpg',
  'images/video-background-effects/bg2.jpg',
  'images/video-background-effects/bg3.jpg'
];

export const SelectableVideoEffects = (): JSX.Element => {
  const [selectedEffect, setSelectedEffect] = React.useState<string>('none');
  return (
    <Stack tokens={{ childrenGap: '1rem' }}>
      <Stack horizontal tokens={{ childrenGap: '1rem' }}>
        <_VideoEffectsItemNoBackground
          isSelected={selectedEffect === 'none'}
          onSelect={() => setSelectedEffect('none')}
          itemKey={'none'}
        />
        <_VideoEffectsItemBlur
          isSelected={selectedEffect === 'blur'}
          onSelect={() => setSelectedEffect('blur')}
          itemKey={'blur'}
        />
        <_VideoEffectsItemAddImage
          isSelected={selectedEffect === 'addImage'}
          onSelect={() => setSelectedEffect('addImage')}
          itemKey={'addImage'}
          disabled
        />
      </Stack>
      <Stack horizontal tokens={{ childrenGap: '1rem' }}>
        {sampleBackgrounds.slice(0, 3).map((url, index) => (
          <_VideoEffectsItem
            key={`customBackground${index}`}
            isSelected={selectedEffect === `bg${index}`}
            onSelect={() => setSelectedEffect(`bg${index}`)}
            itemKey={`customBackground${index}`}
            backgroundProps={{ url }}
          />
        ))}
      </Stack>
    </Stack>
  );
};
