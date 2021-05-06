// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Stack } from '@fluentui/react';
import {
  CameraButton,
  ControlBar,
  EndCallButton,
  MicrophoneButton,
  OptionsButton,
  StreamMedia,
  VideoTile as VideoTileComponent
} from '@azure/communication-react';
import { text, boolean, number } from '@storybook/addon-knobs';
import { renderVideoStream } from '../utils';
import { getDocs } from './VideoTileDocs';
import { COMPONENT_FOLDER_PREFIX } from '../constants';

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const VideoTile: () => JSX.Element = () => {
  const avatarName = text('Avatar Name', 'John Krasinski');
  const isVideoReady = boolean('Is Video Ready', false);
  const invertVideo = boolean('Invert Video', false);
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
    <VideoTileComponent
      isVideoReady={isVideoReady}
      videoProvider={<StreamMedia videoStreamElement={renderVideoStream()} />}
      avatarName={avatarName}
      invertVideo={invertVideo}
      styles={{
        root: { height: height, width: width }
      }}
    />
  );
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/Video Tile`,
  component: VideoTileComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
