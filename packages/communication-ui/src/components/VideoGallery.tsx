// © Microsoft Corporation. All rights reserved.

import { Label, Stack } from '@fluentui/react';
import React, { useMemo } from 'react';
import { disabledVideoHint, gridStyle, videoHint } from '../composites/GroupCall/styles/MediaGallery.styles';
// import { MapToLocalVideoProps } from '../consumers';
import { VideoGalleryRemoteParticipant, VideoGalleryLocalParticipant } from '../types';
import { GridLayout } from './GridLayout';
import { StreamMedia } from './StreamMedia';
import { VideoTile } from './VideoTile';

export interface VideoGalleryProps {
  remoteParticipants?: VideoGalleryRemoteParticipant[];
  localParticipant?: VideoGalleryLocalParticipant;
}

export const VideoGallery = (props: VideoGalleryProps): JSX.Element => {
  const { localParticipant } = props;
  const localVideoStream = localParticipant?.videoStreams[0];

  const layoutLocalParticipant = useMemo(() => {
    return (
      localParticipant && (
        <VideoTile
          isVideoReady={localVideoStream?.isAvailable}
          videoProvider={<StreamMedia videoStreamElement={localVideoStream?.target ?? null} />}
          avatarName={localParticipant.displayName}
        >
          <Label className={localVideoStream?.isAvailable ? videoHint : disabledVideoHint}>
            {localParticipant.displayName}
          </Label>
        </VideoTile>
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localParticipant]);

  return (
    <GridLayout>
      <Stack horizontalAlign="center" verticalAlign="center" className={gridStyle} grow>
        {layoutLocalParticipant}
      </Stack>
      {/* {gridLayoutRemoteParticipants} */}
    </GridLayout>
  );
};
