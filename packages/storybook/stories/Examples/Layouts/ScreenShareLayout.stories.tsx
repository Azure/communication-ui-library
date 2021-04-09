// © Microsoft Corporation. All rights reserved.

import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta } from '@storybook/react/types-6-0';
import { number, select } from '@storybook/addon-knobs';
import {
  mediaGalleryWidthOptions,
  mediaGalleryHeightDefault,
  mediaGalleryHeightOptions,
  EXAMPLES_FOLDER_PREFIX
} from '../../constants';
import { GridLayout, VideoTile } from '@azure/communication-ui';
import { Stack, mergeStyles, PersonaSize, Persona, Label } from '@fluentui/react';
import { getDocs } from './LayoutsDocs';

export const ScreenShareLayout: () => JSX.Element = () => {
  const width = number('Width (px)', 850, mediaGalleryWidthOptions);
  const height = number('Height (px)', mediaGalleryHeightDefault, mediaGalleryHeightOptions);

  const defaultParticipants = ['Michael', 'Jim', 'Pam', 'Dwight', 'Kelly', 'Ryan', 'Andy'];

  const sidePanelWidthRatio = select('Side Panel Width Ratio', ['30%', '35%', '40%', '45%', '50%'], '30%');
  const sidePanelTileAspectRatio = select(
    'Side Panel Tile Aspect Ratio (Width:Height)',
    ['16:9', '3:2', '4:3', '5:9', '1:1'],
    '16:9'
  );
  const aspectRatioNumberArray = sidePanelTileAspectRatio.split(':');
  const aspectRatio = (100 * aspectRatioNumberArray[1]) / aspectRatioNumberArray[0] + '%';

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
    border: 1,
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

  const videoLabelStyle = mergeStyles({
    bottom: '5%',
    left: '2%',
    overflow: 'hidden',
    position: 'absolute',
    maxWidth: '95%'
  });

  const participantsComponents = defaultParticipants.map((participant, index) => {
    return (
      <Stack className={aspectRatioBoxStyle} key={index}>
        <Stack className={aspectRatioBoxContentStyle}>
          <VideoTile
            isVideoReady={false}
            placeholderProvider={
              <Persona
                styles={{ root: { margin: 'auto' } }}
                size={PersonaSize.size56}
                hidePersonaDetails={true}
                text={participant}
                initialsTextColor="white"
              />
            }
          >
            <Label className={videoLabelStyle}>{participant}</Label>
          </VideoTile>
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
          isVideoReady={false}
          styles={{
            overlayContainer: videoStreamStyle
          }}
          // A placeholder element for the screen share stream
          placeholderProvider={
            <Stack className={mergeStyles({ height: '100%' })}>
              <Stack verticalAlign="center" horizontalAlign="center" className={mergeStyles({ height: '100%' })}>
                Your Screen Share Stream
              </Stack>
            </Stack>
          }
        >
          {/* Video component for screen sharer's stream */}
          <VideoTile
            isVideoReady={false}
            // A placeholder element for screen sharer's video stream
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
      </Stack.Item>
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
