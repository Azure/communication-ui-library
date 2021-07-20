// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { VideoTile } from '@azure/communication-react';
import { Stack, mergeStyles, PersonaSize, Persona } from '@fluentui/react';
import { number } from '@storybook/addon-knobs';
import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {
  mediaGalleryWidthDefault,
  mediaGalleryWidthOptions,
  mediaGalleryHeightDefault,
  mediaGalleryHeightOptions
} from '../../constants';

const renderPersona = (): JSX.Element => (
  <Persona
    styles={{ root: { margin: 'auto' } }}
    size={PersonaSize.size56}
    hidePersonaDetails={true}
    text={'Toby'}
    initialsTextColor="white"
  />
);

export const OneToOneCallLayout: () => JSX.Element = () => {
  const width = number('Width (px)', mediaGalleryWidthDefault, mediaGalleryWidthOptions);
  const height = number('Height (px)', mediaGalleryHeightDefault, mediaGalleryHeightOptions);

  const videoStreamStyle = mergeStyles({
    border: '1',
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
        displayName={'Holly'}
      >
        {/* Video component for my video stream stream */}
        <VideoTile
          isVideoReady={false}
          // A render placeholder function for my video stream
          onRenderPlaceholder={renderPersona}
        />
      </VideoTile>
    </Stack>
  );
};
