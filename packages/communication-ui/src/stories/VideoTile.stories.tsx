// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Stack } from '@fluentui/react';
import { VideoTile } from '../components/VideoTile';
import {
  StreamMediaComponent,
  ControlBar,
  ControlButton,
  videoButtonProps,
  audioButtonProps,
  optionsButtonProps,
  hangupButtonProps
} from '../components';
import { text, boolean, number } from '@storybook/addon-knobs';
import { renderVideoStream } from './utils';
import { getDocs } from './docs/VideoTileDocs';

export const VideoTileComponent: () => JSX.Element = () => {
  const avatarName = text('Avatar Name', 'John Krasinski');
  const isVideoReady = boolean('Is Video Ready', false);
  const showControlBar = boolean('Show Control Bar (Not a part of this component)', false);
  const width = number('Width', 400, {
    range: true,
    min: 400,
    max: 1200,
    step: 10
  });
  const height = number('Height', 300, {
    range: true,
    min: 300,
    max: 800,
    step: 10
  });

  return (
    <VideoTile
      isVideoReady={isVideoReady}
      videoProvider={() => <StreamMediaComponent videoStreamElement={renderVideoStream()} />}
      avatarName={avatarName}
      styles={{
        root: { height: height, width: width }
      }}
    >
      {showControlBar ? (
        <Stack style={{ position: 'absolute', left: '50%', bottom: '1rem' }}>
          <ControlBar styles={{ root: { position: 'relative', left: '-50%' } }}>
            <ControlButton {...videoButtonProps} />
            <ControlButton {...audioButtonProps} />
            <ControlButton {...optionsButtonProps} />
            <ControlButton {...hangupButtonProps} />
          </ControlBar>
        </Stack>
      ) : null}
    </VideoTile>
  );
};

export default {
  title: 'ACS Components/VideoTile',
  component: VideoTileComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
