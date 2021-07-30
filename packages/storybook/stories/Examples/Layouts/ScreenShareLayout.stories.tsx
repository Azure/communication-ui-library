// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PlaceholderProps, VideoTile } from '@azure/communication-react';
import { Stack, mergeStyles, PersonaSize, Persona } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import {
  EXAMPLES_FOLDER_PREFIX,
  mediaGalleryWidthOptions,
  mediaGalleryHeightDefault,
  mediaGalleryHeightOptions
} from '../../constants';
import { getDocs } from './LayoutsDocs';

const renderPersona = (props: PlaceholderProps): JSX.Element => (
  <Persona
    styles={{ root: { margin: 'auto' } }}
    size={PersonaSize.size56}
    hidePersonaDetails={true}
    text={props.displayName}
    initialsTextColor="white"
  />
);

const renderScreenSharePlaceholder = (): JSX.Element => (
  <Stack className={mergeStyles({ height: '100%' })}>
    <Stack verticalAlign="center" horizontalAlign="center" className={mergeStyles({ height: '100%' })}>
      Your Screen Share Stream
    </Stack>
  </Stack>
);

const renderSharePersonaPlaceholder = (): JSX.Element => (
  <Persona
    styles={{ root: { margin: 'auto' } }}
    size={PersonaSize.size56}
    hidePersonaDetails={true}
    text={'Toby'}
    initialsTextColor="white"
  />
);

const MockParticipantDisplayNames = ['Michael', 'Jim', 'Pam', 'Dwight', 'Kelly', 'Ryan', 'Andy'];

const aspectRatioBoxContentStyle = mergeStyles({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
});

const videoStreamStyle = mergeStyles({
  border: '1',
  borderStyle: 'solid',
  position: 'absolute',
  bottom: '.25rem',
  right: '.25rem',
  height: '20%',
  width: '30%'
});

const ScreenShareLayoutStory: (args) => JSX.Element = (args) => {
  const aspectRatioNumberArray = args.sidePanelTileAspectRatio.split(':');
  const aspectRatio = (100 * parseInt(aspectRatioNumberArray[1])) / parseInt(aspectRatioNumberArray[0]) + '%';

  const aspectRatioBoxStyle = mergeStyles({
    borderWidth: '.063rem .063rem .025rem .063rem',
    borderStyle: 'solid',
    width: '100%',
    height: 0,
    position: 'relative',
    paddingTop: aspectRatio
  });

  const screenShareLayoutStyle = {
    height: `${args.height}px`,
    width: `${args.width}px`,
    border: '.063rem'
  };

  const participantsComponents = MockParticipantDisplayNames.map((participantDisplayName, index) => {
    return (
      <Stack className={aspectRatioBoxStyle} key={index}>
        <Stack className={aspectRatioBoxContentStyle}>
          <VideoTile isVideoReady={false} displayName={participantDisplayName} onRenderPlaceholder={renderPersona} />
        </Stack>
      </Stack>
    );
  });

  return (
    <Stack style={screenShareLayoutStyle} horizontal>
      {/* Side panel component in this layout */}
      <Stack.Item className={mergeStyles({ height: '100%', width: args.sidePanelWidthRatio })}>
        <Stack grow className={mergeStyles({ height: '100%', overflow: 'auto' })}>
          {participantsComponents}
        </Stack>
      </Stack.Item>
      {/* Screen share stream component in this layout */}
      <Stack.Item grow className={mergeStyles({ height: '100%' })}>
        {/* The screen share component that will display the screen share stream and sharer's video */}
        <VideoTile
          isVideoReady={false}
          styles={{
            overlayContainer: videoStreamStyle
          }}
          // A placeholder element for the screen share stream
          onRenderPlaceholder={renderScreenSharePlaceholder}
        >
          {/* Video component for screen sharer's stream */}
          <VideoTile
            isVideoReady={false}
            // A placeholder element for screen sharer's video stream
            onRenderPlaceholder={renderSharePersonaPlaceholder}
          />
        </VideoTile>
      </Stack.Item>
    </Stack>
  );
};

export const ScreenShareLayout = ScreenShareLayoutStory.bind({});

export default {
  id: `${EXAMPLES_FOLDER_PREFIX}-layouts-screensharelayout`,
  title: `${EXAMPLES_FOLDER_PREFIX}/Layouts/Screen Share Layout`,
  argTypes: {
    width: {
      control: {
        type: 'range',
        min: mediaGalleryWidthOptions.min,
        max: mediaGalleryWidthOptions.max,
        step: mediaGalleryWidthOptions.step
      },
      defaultValue: 850,
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
    },
    sidePanelWidthRatio: {
      control: 'select',
      options: ['30%', '35%', '40%', '45%', '50%'],
      defaultValue: '30%',
      name: 'Side Panel Width Ratio'
    },
    sidePanelTileAspectRatio: {
      control: 'select',
      options: ['16:9', '3:2', '4:3', '5:9', '1:1'],
      defaultValue: '16:9',
      name: 'Side Panel Tile Aspect Ratio (Width:Height)'
    }
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
