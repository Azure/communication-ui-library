// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PlaceholderProps, VideoTile } from '@azure/communication-react';
import { Stack, mergeStyles, PersonaSize, Persona } from '@fluentui/react';
import { number, select } from '@storybook/addon-knobs';
import React from 'react';
import { mediaGalleryWidthOptions, mediaGalleryHeightDefault, mediaGalleryHeightOptions } from '../../constants';

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

export const ScreenShareLayout: () => JSX.Element = () => {
  const width = number('Width (px)', 850, mediaGalleryWidthOptions);
  const height = number('Height (px)', mediaGalleryHeightDefault, mediaGalleryHeightOptions);

  const MockParticipantDisplayNames = ['Michael', 'Jim', 'Pam', 'Dwight', 'Kelly', 'Ryan', 'Andy'];

  const sidePanelWidthRatio = select('Side Panel Width Ratio', ['30%', '35%', '40%', '45%', '50%'], '30%');
  const sidePanelTileAspectRatio = select(
    'Side Panel Tile Aspect Ratio (Width:Height)',
    ['16:9', '3:2', '4:3', '5:9', '1:1'],
    '16:9'
  );
  const aspectRatioNumberArray = sidePanelTileAspectRatio.split(':');
  const aspectRatio = (100 * parseInt(aspectRatioNumberArray[1])) / parseInt(aspectRatioNumberArray[0]) + '%';

  const aspectRatioBoxStyle = mergeStyles({
    borderWidth: '.063rem .063rem .025rem .063rem',
    borderStyle: 'solid',
    width: '100%',
    height: 0,
    position: 'relative',
    paddingTop: aspectRatio
  });

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

  const screenShareLayoutStyle = {
    height: `${height}px`,
    width: `${width}px`,
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
      <Stack.Item className={mergeStyles({ height: '100%', width: sidePanelWidthRatio })}>
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
