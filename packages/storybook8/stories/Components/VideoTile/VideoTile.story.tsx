// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { StreamMedia, VideoTile as VideoTileComponent } from '@azure/communication-react';
import React from 'react';
import { useVideoStreams } from '../../utils';

const VideoTileRender = (args: any): JSX.Element => {
  const videoTileStyles = {
    root: {
      height: `${args.height}px`,
      width: `${args.width}px`
    }
  };

  const videoStreams = useVideoStreams(1);
  const videoStreamElement = args.isVideoReady ? videoStreams[0] : null;
  const videoStyles = args.isSpeaking ? { root: { '& video': { borderRadius: '0rem' } } } : {};

  return (
    <VideoTileComponent
      renderElement={
        args.isVideoReady ? <StreamMedia styles={videoStyles} videoStreamElement={videoStreamElement} /> : undefined
      }
      displayName={args.displayName}
      showMuteIndicator={args.showMuteIndicator}
      showLabel={args.showLabel}
      isMirrored={args.isMirrored}
      isMuted={args.isMuted}
      isSpeaking={args.isSpeaking}
      styles={videoTileStyles}
    />
  );
};

export const VideoTile = VideoTileRender.bind({});
