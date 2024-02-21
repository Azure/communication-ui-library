// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { CSSProperties, useCallback, useMemo } from 'react';
/* @conditional-compile-remove(vertical-gallery) */ /* @conditional-compile-remove(rooms) */
import { useRef } from 'react';
import {
  VideoGallery,
  VideoStreamOptions,
  CustomAvatarOptions,
  Announcer,
  VideoTileContextualMenuProps,
  VideoTileDrawerMenuProps
} from '@internal/react-components';
import { VideoGalleryLayout } from '@internal/react-components';
/* @conditional-compile-remove(vertical-gallery) */ /* @conditional-compile-remove(rooms) */
import { _useContainerWidth, _useContainerHeight } from '@internal/react-components';
import { usePropsFor } from '../hooks/usePropsFor';
import { AvatarPersona, AvatarPersonaDataCallback } from '../../common/AvatarPersona';
import { mergeStyles, Stack } from '@fluentui/react';
import { useHandlers } from '../hooks/useHandlers';
import { useSelector } from '../hooks/useSelector';
import { localVideoCameraCycleButtonSelector } from '../selectors/LocalVideoTileSelector';
import { LocalVideoCameraCycleButton } from '@internal/react-components';
import { _formatString } from '@internal/acs-ui-common';
import { useParticipantChangedAnnouncement } from '../utils/MediaGalleryUtils';
import { RemoteVideoTileMenuOptions } from '../CallComposite';
/* @conditional-compile-remove(click-to-call) */ /* @conditional-compile-remove(rooms) */ /* @conditional-compile-remove(vertical-gallery) */
import { LocalVideoTileOptions } from '../CallComposite';
/* @conditional-compile-remove(rooms) */
import { useAdapter } from '../adapter/CallAdapterProvider';
/* @conditional-compile-remove(spotlight) */
import { PromptProps } from './Prompt';
/* @conditional-compile-remove(spotlight) */
import { useLocalSpotlightCallbacksWithPrompt, useRemoteSpotlightCallbacksWithPrompt } from '../utils/spotlightUtils';

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
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  isMobile?: boolean;
  drawerMenuHostId?: string;
  remoteVideoTileMenuOptions?: RemoteVideoTileMenuOptions;
  /* @conditional-compile-remove(click-to-call) */ /* @conditional-compile-remove(rooms) */ /* @conditional-compile-remove(vertical-gallery) */
  localVideoTileOptions?: boolean | LocalVideoTileOptions;
  /* @conditional-compile-remove(gallery-layouts) */
  userSetOverflowGalleryPosition?: 'Responsive' | 'horizontalTop';
  /* @conditional-compile-remove(gallery-layouts) */
  userSetGalleryLayout: VideoGalleryLayout;
  /* @conditional-compile-remove(spotlight) */
  setIsPromptOpen: (isOpen: boolean) => void;
  /* @conditional-compile-remove(spotlight) */
  setPromptProps: (props: PromptProps) => void;
}

/**
 * @private
 */
export const MediaGallery = (props: MediaGalleryProps): JSX.Element => {
  /* @conditional-compile-remove(spotlight) */
  const { setIsPromptOpen, setPromptProps } = props;

  const videoGalleryProps = usePropsFor(VideoGallery);
  const cameraSwitcherCameras = useSelector(localVideoCameraCycleButtonSelector);
  const cameraSwitcherCallback = useHandlers(LocalVideoCameraCycleButton);
  const announcerString = useParticipantChangedAnnouncement();

  /* @conditional-compile-remove(rooms) */
  const adapter = useAdapter();
  /* @conditional-compile-remove(rooms) */
  const userRole = adapter.getState().call?.role;
  /* @conditional-compile-remove(rooms) */
  const isRoomsCall = adapter.getState().isRoomsCall;

  /* @conditional-compile-remove(vertical-gallery) */ /* @conditional-compile-remove(rooms) */
  const containerRef = useRef<HTMLDivElement>(null);
  /* @conditional-compile-remove(vertical-gallery) */ /* @conditional-compile-remove(rooms) */
  const containerWidth = _useContainerWidth(containerRef);
  /* @conditional-compile-remove(vertical-gallery) */ /* @conditional-compile-remove(rooms) */
  const containerHeight = _useContainerHeight(containerRef);
  /* @conditional-compile-remove(click-to-call) */ /* @conditional-compile-remove(rooms) */ /* @conditional-compile-remove(vertical-gallery) */
  const containerAspectRatio = containerWidth && containerHeight ? containerWidth / containerHeight : 0;
  /* @conditional-compile-remove(reaction) */
  const reactionResources = adapter.getState().reactions;

  const layoutBasedOnTilePosition: VideoGalleryLayout = localVideoTileLayoutTrampoline(
    /* @conditional-compile-remove(click-to-call) */ (props.localVideoTileOptions as LocalVideoTileOptions)?.position
  );

  const cameraSwitcherProps = useMemo(() => {
    return {
      ...cameraSwitcherCallback,
      ...cameraSwitcherCameras
    };
  }, [cameraSwitcherCallback, cameraSwitcherCameras]);

  const onRenderAvatar = useCallback(
    (userId?: string, options?: CustomAvatarOptions) => {
      return (
        <Stack className={mergeStyles({ position: 'absolute', height: '100%', width: '100%' })}>
          <Stack styles={{ root: { margin: 'auto', maxHeight: '100%' } }}>
            {options?.coinSize && (
              <AvatarPersona userId={userId} {...options} dataProvider={props.onFetchAvatarPersonaData} />
            )}
          </Stack>
        </Stack>
      );
    },
    [props.onFetchAvatarPersonaData]
  );

  const remoteVideoTileMenuOptions: false | VideoTileContextualMenuProps | VideoTileDrawerMenuProps = useMemo(() => {
    return props.remoteVideoTileMenuOptions?.isHidden
      ? false
      : props.isMobile
      ? { kind: 'drawer', hostId: props.drawerMenuHostId }
      : { kind: 'contextual' };
  }, [props.remoteVideoTileMenuOptions?.isHidden, props.isMobile, props.drawerMenuHostId]);

  /* @conditional-compile-remove(vertical-gallery) */
  const overflowGalleryPosition = useMemo(() => {
    /* @conditional-compile-remove(gallery-layouts) */
    if (props.userSetOverflowGalleryPosition === 'horizontalTop') {
      return props.userSetOverflowGalleryPosition;
    }
    return containerWidth && containerHeight && containerWidth / containerHeight >= 16 / 9
      ? 'verticalRight'
      : 'horizontalBottom';
  }, [
    /* @conditional-compile-remove(gallery-layouts) */ props.userSetOverflowGalleryPosition,
    containerWidth,
    containerHeight
  ]);

  /* @conditional-compile-remove(spotlight) */
  const { onStartLocalSpotlight, onStopLocalSpotlight, onStartRemoteSpotlight, onStopRemoteSpotlight } =
    videoGalleryProps;

  /* @conditional-compile-remove(spotlight) */
  const { onStartLocalSpotlightWithPrompt, onStopLocalSpotlightWithPrompt } = useLocalSpotlightCallbacksWithPrompt(
    onStartLocalSpotlight,
    onStopLocalSpotlight,
    setIsPromptOpen,
    setPromptProps
  );

  /* @conditional-compile-remove(spotlight) */
  const { onStartRemoteSpotlightWithPrompt, onStopRemoteSpotlightWithPrompt } = useRemoteSpotlightCallbacksWithPrompt(
    onStartRemoteSpotlight,
    onStopRemoteSpotlight,
    setIsPromptOpen,
    setPromptProps
  );

  const VideoGalleryMemoized = useMemo(() => {
    const layoutBasedOnUserSelection = (): VideoGalleryLayout => {
      /* @conditional-compile-remove(gallery-layouts) */
      return props.localVideoTileOptions ? layoutBasedOnTilePosition : props.userSetGalleryLayout;
      return layoutBasedOnTilePosition;
    };

    return (
      <VideoGallery
        {...videoGalleryProps}
        localVideoViewOptions={localVideoViewOptions}
        remoteVideoViewOptions={remoteVideoViewOptions}
        styles={VideoGalleryStyles}
        layout={layoutBasedOnUserSelection()}
        showCameraSwitcherInLocalPreview={props.isMobile}
        localVideoCameraCycleButtonProps={cameraSwitcherProps}
        onRenderAvatar={onRenderAvatar}
        remoteVideoTileMenu={remoteVideoTileMenuOptions}
        /* @conditional-compile-remove(vertical-gallery) */
        overflowGalleryPosition={overflowGalleryPosition}
        /* @conditional-compile-remove(rooms) */
        localVideoTileSize={
          props.localVideoTileOptions === false || userRole === 'Consumer' || (isRoomsCall && userRole === 'Unknown')
            ? 'hidden'
            : props.isMobile && containerAspectRatio < 1
            ? '9:16'
            : '16:9'
        }
        /* @conditional-compile-remove(reaction) */
        reactionResources={reactionResources}
        /* @conditional-compile-remove(spotlight) */
        onStartLocalSpotlight={onStartLocalSpotlightWithPrompt}
        /* @conditional-compile-remove(spotlight) */
        onStopLocalSpotlight={onStopLocalSpotlightWithPrompt}
        /* @conditional-compile-remove(spotlight) */
        onStartRemoteSpotlight={onStartRemoteSpotlightWithPrompt}
        /* @conditional-compile-remove(spotlight) */
        onStopRemoteSpotlight={onStopRemoteSpotlightWithPrompt}
      />
    );
  }, [
    videoGalleryProps,
    props.isMobile,
    /* @conditional-compile-remove(rooms) */
    props.localVideoTileOptions,
    cameraSwitcherProps,
    onRenderAvatar,
    remoteVideoTileMenuOptions,
    /* @conditional-compile-remove(vertical-gallery) */
    overflowGalleryPosition,
    /* @conditional-compile-remove(rooms) */
    userRole,
    /* @conditional-compile-remove(rooms) */
    isRoomsCall,
    /* @conditional-compile-remove(vertical-gallery) */
    containerAspectRatio,
    /* @conditional-compile-remove(gallery-layouts) */
    props.userSetGalleryLayout,
    layoutBasedOnTilePosition,
    /* @conditional-compile-remove(reaction) */
    reactionResources,
    /* @conditional-compile-remove(spotlight) */
    onStartLocalSpotlightWithPrompt,
    /* @conditional-compile-remove(spotlight) */
    onStopLocalSpotlightWithPrompt,
    /* @conditional-compile-remove(spotlight) */
    onStartRemoteSpotlightWithPrompt,
    /* @conditional-compile-remove(spotlight) */
    onStopRemoteSpotlightWithPrompt
  ]);

  return (
    <div /* @conditional-compile-remove(vertical-gallery) */ ref={containerRef} style={mediaGalleryContainerStyles}>
      <Announcer announcementString={announcerString} ariaLive={'polite'} />
      {VideoGalleryMemoized}
    </div>
  );
};

const mediaGalleryContainerStyles: CSSProperties = { width: '100%', height: '100%' };

const localVideoTileLayoutTrampoline = (
  /* @conditional-compile-remove(click-to-call) */ localTileOptions?: string
): VideoGalleryLayout => {
  /* @conditional-compile-remove(click-to-call) */
  return localTileOptions === 'grid' ? 'default' : 'floatingLocalVideo';
  return 'floatingLocalVideo';
};
