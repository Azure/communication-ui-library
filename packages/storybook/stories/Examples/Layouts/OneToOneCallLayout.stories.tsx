// © Microsoft Corporation. All rights reserved.

import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta } from '@storybook/react/types-6-0';
import { number } from '@storybook/addon-knobs';
import {
  mediaGalleryWidthDefault,
  mediaGalleryWidthOptions,
  mediaGalleryHeightDefault,
  mediaGalleryHeightOptions,
  EXAMPLES_FOLDER_PREFIX
} from '../../constants';
import { GridLayout, VideoTile } from '@azure/communication-ui';
import { Stack, mergeStyles, PersonaSize, Persona } from '@fluentui/react';
import { getDocs } from './LayoutsDocs';

export const OneToOneCallLayout: () => JSX.Element = () => {
  const width = number('Width (px)', mediaGalleryWidthDefault, mediaGalleryWidthOptions);
  const height = number('Height (px)', mediaGalleryHeightDefault, mediaGalleryHeightOptions);

  const videoStreamStyle = mergeStyles({
    border: 1,
    borderStyle: 'solid',
    position: 'absolute',
    bottom: '.25rem',
    right: '.25rem',
    height: '25%',
    width: '30%'
  });

  return (
    <Stack style={{ height: `${height}px`, width: `${width}px`, border: '1px' }} horizontal>
      {/* Video component for the other person's video stream */}
      <VideoTile
        isVideoReady={false}
        styles={{
          overlayContainer: videoStreamStyle
        }}
        avatarName={'Holly'}
      >
        {/* Video component for my video stream stream */}
        <VideoTile
          isVideoReady={false}
          // A placeholder element for my video stream
          placeholderProvider={
            <Persona
              styles={{ root: { margin: 'auto' } }}
              size={PersonaSize.size56}
              hidePersonaDetails={true}
              text={'Toby'}
              initialsTextColor="white"
            />
          }
        />
      </VideoTile>
    </Stack>
  );
};

export default {
  title: `${EXAMPLES_FOLDER_PREFIX}/Layouts`,
  component: GridLayout,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
