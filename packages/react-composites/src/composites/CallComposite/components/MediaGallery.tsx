// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  VideoGallery,
  VideoStreamOptions,
  OnRenderAvatarCallback,
  VideoGalleryRemoteParticipant
} from '@internal/react-components';
import { usePropsFor } from '../hooks/usePropsFor';
import { AvatarPersona, AvatarPersonaDataCallback } from '../../common/AvatarPersona';
import { mergeStyles, Stack } from '@fluentui/react';
import { getIsPreviewCameraOn } from '../selectors/baseSelectors';
import { useHandlers } from '../hooks/useHandlers';
import { useSelector } from '../hooks/useSelector';
import { localVideoCameraCycleButtonSelector } from '../selectors/LocalVideoTileSelector';
import { LocalVideoCameraCycleButton } from '@internal/react-components';
import { useCustomAvatarPersonaData } from '../../common/CustomDataModelUtils';

const VideoGalleryStyles = {
  root: {
    height: '100%',
    minHeight: '10rem', // space affordance to ensure media gallery is never collapsed
    minWidth: '6rem'
  }
};

const localVideoViewOptions = {
  scalingMode: 'Crop',
  isMirrored: true
} as VideoStreamOptions;

const remoteVideoViewOptions = {
  scalingMode: 'Crop'
} as VideoStreamOptions;

/**
 * @private
 */
export interface MediaGalleryProps {
  isVideoStreamOn?: boolean;
  isMicrophoneChecked?: boolean;
  onStartLocalVideo: () => Promise<void>;
  onRenderAvatar?: OnRenderAvatarCallback;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  isMobile?: boolean;
}

/**
 * @private
 */
export const MediaGallery = (props: MediaGalleryProps): JSX.Element => {
  const videoGalleryProps = usePropsFor(VideoGallery);
  const cameraSwitcherCameras = useSelector(localVideoCameraCycleButtonSelector);
  const cameraSwitcherCallback = useHandlers(LocalVideoCameraCycleButton);
  const cameraSwitcherProps = useMemo(() => {
    return {
      ...cameraSwitcherCallback,
      ...cameraSwitcherCameras
    };
  }, [cameraSwitcherCallback, cameraSwitcherCameras]);

  const remoteParticipants = useRemoteParticipantsWithCustomDisplayNames(
    videoGalleryProps.remoteParticipants,
    props.onFetchAvatarPersonaData
  );

  const onRenderAvatar = useCallback(
    (userId, options) => (
      <Stack className={mergeStyles({ position: 'absolute', height: '100%', width: '100%' })}>
        <AvatarPersona userId={userId} {...options} dataProvider={props.onFetchAvatarPersonaData} />
      </Stack>
    ),
    [props.onFetchAvatarPersonaData]
  );

  useLocalVideoStartTrigger(!!props.isVideoStreamOn);
  const VideoGalleryMemoized = useMemo(() => {
    return (
      <VideoGallery
        {...videoGalleryProps}
        remoteParticipants={remoteParticipants}
        localVideoViewOptions={localVideoViewOptions}
        remoteVideoViewOptions={remoteVideoViewOptions}
        styles={VideoGalleryStyles}
        layout="floatingLocalVideo"
        showCameraSwitcherInLocalPreview={props.isMobile}
        localVideoCameraCycleButtonProps={cameraSwitcherProps}
        onRenderAvatar={onRenderAvatar}
      />
    );
  }, [videoGalleryProps, props.isMobile, onRenderAvatar, remoteParticipants, cameraSwitcherProps]);

  return VideoGalleryMemoized;
};

/**
 * @private
 *
 * `shouldTransition` is an extra predicate that controls whether this hooks actually transitions the call.
 * The rule of hooks disallows calling the hook conditionally, so this predicate can be used to make the decision.
 */
export const useLocalVideoStartTrigger = (isLocalVideoAvailable: boolean, shouldTransition?: boolean): void => {
  // Once a call is joined, we need to transition the local preview camera setting into the call.
  // This logic is needed on any screen that we might join a call from:
  // - The Media gallery
  // - The lobby page
  // - The networkReconnect interstitial that may show at the start of a call.
  //
  // @TODO: Can we simply have the callHandlers handle this transition logic.
  const [isButtonStatusSynced, setIsButtonStatusSynced] = useState(false);
  const isPreviewCameraOn = useSelector(getIsPreviewCameraOn);
  const mediaGalleryHandlers = useHandlers(MediaGallery);
  useEffect(() => {
    if (shouldTransition !== false) {
      if (isPreviewCameraOn && !isLocalVideoAvailable && !isButtonStatusSynced) {
        mediaGalleryHandlers.onStartLocalVideo();
      }
      setIsButtonStatusSynced(true);
    }
  }, [shouldTransition, isButtonStatusSynced, isPreviewCameraOn, isLocalVideoAvailable, mediaGalleryHandlers]);
};

/**
 * Hook to fetch new participant avatar and video gallery displayName information if it is present.
 * @param onFetchAvatarPersonaData
 */
const useRemoteParticipantsWithCustomDisplayNames = (
  remoteParticipants: VideoGalleryRemoteParticipant[],
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback
): VideoGalleryRemoteParticipant[] => {
  const userIds = useMemo(() => {
    return remoteParticipants.map((p) => p.userId);
  }, [remoteParticipants]);

  const avatarPersonaData = useCustomAvatarPersonaData(userIds, onFetchAvatarPersonaData);
  const newParticipants = remoteParticipants.map((p, i) => {
    const newName = avatarPersonaData[i]?.text;
    if (!newName) {
      return p;
    }
    return { ...p, displayName: newName };
  });

  return newParticipants;
};
