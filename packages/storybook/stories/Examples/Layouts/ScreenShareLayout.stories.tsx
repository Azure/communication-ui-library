// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { VideoTile } from '@azure/communication-react';
import { Stack, mergeStyles, PersonaSize, Persona } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { controlsToAdd } from '../../controlsUtils';
import { getDocs } from './LayoutsDocs';

const renderPersona = (userId, options): JSX.Element => (
  <Persona
    styles={{ root: { margin: 'auto' } }}
    size={PersonaSize.size56}
    hidePersonaDetails={true}
    text={options.text}
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

const ScreenShareLayoutStory = (args): JSX.Element => {
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
          <VideoTile displayName={participantDisplayName} onRenderPlaceholder={renderPersona} />
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
          styles={{
            overlayContainer: videoStreamStyle
          }}
          // A placeholder element for the screen share stream
          onRenderPlaceholder={renderScreenSharePlaceholder}
        >
          {/* Video component for screen sharer's stream */}
          <VideoTile
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
    width: controlsToAdd.screenShareLayoutWidth,
    height: controlsToAdd.layoutHeight,
    sidePanelWidthRatio: controlsToAdd.screenShareSidePanelWidthRatio,
    sidePanelTileAspectRatio: controlsToAdd.screenShareSidePanelTileAspectRatio
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
