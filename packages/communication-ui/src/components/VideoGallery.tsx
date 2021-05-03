// © Microsoft Corporation. All rights reserved.

import { memoizeFnAll } from '@azure/acs-calling-selector';
import { Label, Stack } from '@fluentui/react';
import React, { useMemo } from 'react';
import { disabledVideoHint, gridStyle, videoHint } from '../composites/GroupCall/styles/MediaGallery.styles';
import { VideoGalleryRemoteParticipant, VideoGalleryLocalParticipant } from '../types';
import { GridLayout } from './GridLayout';
import { StreamMedia } from './StreamMedia';
import { VideoTile } from './VideoTile';

export interface VideoGalleryProps {
  remoteParticipants?: VideoGalleryRemoteParticipant[];
  localParticipant?: VideoGalleryLocalParticipant;
}

const memoizeAllRemoteParticipants = memoizeFnAll(
  (remoteParticipantkey: number, isAvailable?: boolean, target?: HTMLElement, displayName?: string): JSX.Element => {
    return (
      <Stack className={gridStyle} key={remoteParticipantkey} grow>
        <VideoTile
          isVideoReady={isAvailable}
          videoProvider={<StreamMedia videoStreamElement={target ?? null} />}
          avatarName={displayName}
        >
          <Label className={isAvailable ? videoHint : disabledVideoHint}>{displayName}</Label>
        </VideoTile>
      </Stack>
    );
  }
);

export const VideoGallery = (props: VideoGalleryProps): JSX.Element => {
  const { localParticipant, remoteParticipants } = props;
  const localVideoStream = localParticipant?.videoStream;

  const localParticipantComponent = useMemo(() => {
    return (
      <VideoTile
        isVideoReady={localVideoStream?.isAvailable}
        videoProvider={<StreamMedia videoStreamElement={localVideoStream?.target ?? null} />}
        avatarName={localParticipant?.displayName}
      >
        <Label className={localVideoStream?.isAvailable ? videoHint : disabledVideoHint}>
          {localParticipant?.displayName}
        </Label>
      </VideoTile>
    );
  }, [localParticipant?.displayName, localVideoStream]);

  const gridLayoutRemoteParticipants = useMemo(() => {
    return memoizeAllRemoteParticipants((memoizedRemoteParticipantFn) => {
      return remoteParticipants
        ? remoteParticipants.map((participant, key) => {
            const remoteVideoStream = participant.videoStream;

            return memoizedRemoteParticipantFn(
              key,
              remoteVideoStream?.isAvailable,
              remoteVideoStream?.target,
              participant.displayName
            );
          })
        : [];
    });
  }, [remoteParticipants]);

  return (
    <GridLayout>
      <Stack horizontalAlign="center" verticalAlign="center" className={gridStyle} grow>
        {localParticipant && localParticipantComponent}
      </Stack>
      {gridLayoutRemoteParticipants}
    </GridLayout>
  );
};
