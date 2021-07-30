// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { VideoTile } from '@azure/communication-react';
import { Stack, mergeStyles, PersonaSize, Persona } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {
  EXAMPLES_FOLDER_PREFIX,
  mediaGalleryWidthDefault,
  mediaGalleryWidthOptions,
  mediaGalleryHeightDefault,
  mediaGalleryHeightOptions
} from '../../constants';
import { getDocs } from './LayoutsDocs';

const renderPersona = (): JSX.Element => (
  <Persona
    styles={{ root: { margin: 'auto' } }}
    size={PersonaSize.size56}
    hidePersonaDetails={true}
    text={'Toby'}
    initialsTextColor="white"
  />
);

const OneToOneCallLayoutStory: (args) => JSX.Element = (args) => {
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
    <Stack style={{ height: `${args.height}px`, width: `${args.width}px`, border: '1px' }} horizontal>
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

export const OneToOneCallLayout = OneToOneCallLayoutStory.bind({});

export default {
  id: `${EXAMPLES_FOLDER_PREFIX}-layouts-onetoonecalllayout`,
  title: `${EXAMPLES_FOLDER_PREFIX}/Layouts/One To One Call Layout`,
  argTypes: {
    width: {
      control: {
        type: 'range',
        min: mediaGalleryWidthOptions.min,
        max: mediaGalleryWidthOptions.max,
        step: mediaGalleryWidthOptions.step
      },
      defaultValue: mediaGalleryWidthDefault,
      name: 'Width (px)'
    },
    height: {
      control: {
        type: 'range',
        min: mediaGalleryHeightOptions.min,
        max: mediaGalleryHeightOptions.max,
        step: mediaGalleryHeightOptions.step
      },
      defaultValue: mediaGalleryHeightDefault,
      name: 'Height (px)'
    }
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
