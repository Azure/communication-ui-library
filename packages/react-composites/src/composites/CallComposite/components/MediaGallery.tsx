// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  VideoGallery,
  OnRenderAvatarCallback,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant,
  RemoteVideoTile,
  RemoteScreenShare,
  LocalVideoTile,
  LocalScreenShare
} from '@internal/react-components';
import { useSelector } from '../hooks/useSelector';
import { usePropsFor } from '../hooks/usePropsFor';
import { getIsPreviewCameraOn } from '../selectors/baseSelectors';
import { AvatarPersona, AvatarPersonaDataCallback } from '../../common/AvatarPersona';
import { mergeStyles, Stack } from '@fluentui/react';

const VideoGalleryStyles = {
  root: {
    height: '100%',
    minHeight: '10rem', // space affordance to ensure media gallery is never collapsed
    minWidth: '6rem'
  }
};

/**
 * @private
 */
export interface MediaGalleryProps {
  isVideoStreamOn?: boolean;
  isMicrophoneChecked?: boolean;
  onStartLocalVideo: () => Promise<void>;
  onRenderAvatar?: OnRenderAvatarCallback;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
}

/**
 * @private
 */
export const MediaGallery = (props: MediaGalleryProps): JSX.Element => {
  const videoGalleryProps = usePropsFor(VideoGallery);

  // When transitioning to the call page we need to trigger onStartLocalVideo() to
  // transition the local preview camera setting into the call. @TODO: Can we simply
  // have the callHandlers handle this transition logic.
  const [isButtonStatusSynced, setIsButtonStatusSynced] = useState(false);
  const isPreviewCameraOn = useSelector(getIsPreviewCameraOn);

  const onRenderAvatar = useCallback(
    (userId, options): JSX.Element => (
      <Stack className={mergeStyles({ position: 'absolute', height: '100%', width: '100%' })}>
        <AvatarPersona userId={userId} {...options} dataProvider={props.onFetchAvatarPersonaData} />
      </Stack>
    ),
    [props.onFetchAvatarPersonaData]
  );

  useEffect(() => {
    if (isPreviewCameraOn && !props.isVideoStreamOn && !isButtonStatusSynced) {
      props.onStartLocalVideo();
    }
    setIsButtonStatusSynced(true);
  }, [isButtonStatusSynced, isPreviewCameraOn, props]);

  const onRenderTile = useCallback(
    (
      participant: VideoGalleryLocalParticipant | VideoGalleryRemoteParticipant,
      type: 'participant' | 'screenshare' | 'localParticipant' | 'localScreenshare'
    ): JSX.Element => {
      if (type === 'screenshare') {
        return <RemoteScreenShare {...videoGalleryProps} screenShareParticipant={participant} />;
      } else if (type === 'localScreenshare') {
        return <LocalScreenShare localParticipant={participant} />;
      } else if (type === 'localParticipant') {
        return <LocalVideoTile {...videoGalleryProps} participant={participant} />;
      }

      return (
        <RemoteVideoTile
          {...videoGalleryProps}
          participant={participant}
          showMuteIndicator={true}
          onRenderAvatar={onRenderAvatar}
        />
      );
    },
    [videoGalleryProps, onRenderAvatar]
  );

  const VideoGalleryMemoized = useMemo(() => {
    return (
      <VideoGallery
        localParticipant={videoGalleryProps.localParticipant}
        remoteParticipants={videoGalleryProps.remoteParticipants}
        onRenderTile={onRenderTile}
        styles={VideoGalleryStyles}
        layout="floatingLocalVideo"
      />
    );
  }, [videoGalleryProps.localParticipant, videoGalleryProps.remoteParticipants, onRenderTile]);

  return VideoGalleryMemoized;
};
