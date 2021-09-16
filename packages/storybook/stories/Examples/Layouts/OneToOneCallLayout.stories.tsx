// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { VideoTile } from '@azure/communication-react';
import { Stack, mergeStyles, PersonaSize, Persona } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { controlsToAdd } from '../../controlsUtils';
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

const OneToOneCallLayoutStory = (args): JSX.Element => {
  const videoStreamStyle = mergeStyles({
    border: '1',
    borderStyle: 'solid',
    position: 'absolute',
    bottom: '.25em',
    right: '.25em',
    height: '25%',
    width: '30%'
  });

  return (
    <Stack style={{ height: `${args.height}px`, width: `${args.width}px`, border: '1px' }} horizontal>
      {/* Video component for the other person's video stream */}
      <VideoTile
        styles={{
          overlayContainer: videoStreamStyle
        }}
        displayName={'Holly'}
      >
        {/* Video component for my video stream stream */}
        <VideoTile
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
    width: controlsToAdd.layoutWidth,
    height: controlsToAdd.layoutHeight
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
