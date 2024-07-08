// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { GridLayout as GridLayoutComponent, VideoTile, StreamMedia } from '@azure/communication-react';
import React, { useMemo } from 'react';
import { useVideoStreams } from '../../utils';

const GridLayoutStory = (args: any): JSX.Element => {
  const videoStreamElements = useVideoStreams(
    args.participants.filter((participant: any) => {
      return participant.isVideoReady;
    }).length
  );

  const participantsComponents = useMemo(() => {
    let videoStreamElementIndex = 0;
    return args.participants.map((participant: any, index: any) => {
      let videoRenderElement: JSX.Element | undefined = undefined;
      if (participant.isVideoReady) {
        const videoStreamElement = videoStreamElements[videoStreamElementIndex];
        videoStreamElementIndex++;
        videoRenderElement = <StreamMedia videoStreamElement={videoStreamElement} />;
      }
      return <VideoTile renderElement={videoRenderElement} displayName={participant.displayName} key={index} />;
    });
  }, [args.participants, videoStreamElements]);

  return (
    <div
      style={{
        height: `${args.height}px`,
        width: `${args.width}px`
      }}
    >
      <GridLayoutComponent>{participantsComponents}</GridLayoutComponent>
    </div>
  );
};

export const GridLayout = GridLayoutStory.bind({});
