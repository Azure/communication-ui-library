// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { concatStyleSets, IStyle, mergeStyles, Stack } from '@fluentui/react';
import React, { useCallback, useMemo, useRef } from 'react';
/* @conditional-compile-remove(pinned-participants) */
import { useState } from 'react';
import { GridLayoutStyles } from '.';
import { useLocale } from '../localization';
import { useTheme } from '../theming';
import {
  BaseCustomStyles,
  OnRenderAvatarCallback,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant,
  VideoStreamOptions,
  CreateVideoStreamViewResult
} from '../types';
import { HorizontalGalleryStyles } from './HorizontalGallery';
import { _RemoteVideoTile } from './RemoteVideoTile';
import { isNarrowWidth, _useContainerHeight, _useContainerWidth } from './utils/responsive';
import { LocalScreenShare } from './VideoGallery/LocalScreenShare';
import { RemoteScreenShare } from './VideoGallery/RemoteScreenShare';
import { LocalVideoCameraCycleButtonProps } from './LocalVideoCameraButton';
import { _ICoordinates, _ModalClone } from './ModalClone/ModalClone';
import { _formatString } from '@internal/acs-ui-common';
import { _LocalVideoTile } from './LocalVideoTile';
/* @conditional-compile-remove(rooms) */
import { _usePermissions } from '../permissions';
import { DefaultLayout } from './VideoGallery/DefaultLayout';
import { FloatingLocalVideoLayout } from './VideoGallery/FloatingLocalVideoLayout';
import { useIdentifiers } from '../identifiers';
import { videoGalleryOuterDivStyle } from './styles/VideoGallery.styles';
import { floatingLocalVideoTileStyle } from './VideoGallery/styles/FloatingLocalVideo.styles';
/* @conditional-compile-remove(pinned-participants) */
import { PinnedParticipantsLayout } from './VideoGallery/PinnedParticipantsLayout';

/**
 * @private
 * Currently the Calling JS SDK supports up to 4 remote video streams
 */
export const DEFAULT_MAX_REMOTE_VIDEO_STREAMS = 4;
/**
 * @private
 * Set aside only 6 dominant speakers for remaining audio participants
 */
export const MAX_AUDIO_DOMINANT_SPEAKERS = 6;

/**
 * All strings that may be shown on the UI in the {@link VideoGallery}.
 *
 * @public
 */
export interface VideoGalleryStrings {
  /** String to notify that local user is sharing their screen */
  screenIsBeingSharedMessage: string;
  /** String to show when remote screen share stream is loading */
  screenShareLoadingMessage: string;
  /** String for local video label. Default is "You" */
  localVideoLabel: string;
  /** String for local video camera switcher */
  localVideoCameraSwitcherLabel: string;
  /** String for announcing the local video tile can be moved by keyboard controls */
  localVideoMovementLabel: string;
  /** String for announcing the selected camera */
  localVideoSelectedDescription: string;
  /** placeholder text for participants who does not have a display name*/
  displayNamePlaceholder: string;
  /* @conditional-compile-remove(pinned-participants) */
  /** Menu text shown in Video Tile contextual menu for setting a remote participants video to fit in frame */
  fitRemoteParticipantToFrame: string;
  /* @conditional-compile-remove(pinned-participants) */
  /** Menu text shown in Video Tile contextual menu for setting a remote participants video to fill the frame */
  fillRemoteParticipantFrame: string;
}

/**
 * @public
 */
export type VideoGalleryLayout = 'default' | 'floatingLocalVideo';

/**
 * {@link VideoGallery} Component Styles.
 * @public
 */
export interface VideoGalleryStyles extends BaseCustomStyles {
  /** Styles for the grid layout */
  gridLayout?: GridLayoutStyles;
  /** Styles for the horizontal gallery  */
  horizontalGallery?: HorizontalGalleryStyles;
  /** Styles for the local video  */
  localVideo?: IStyle;
}

/**
 * Props for {@link VideoGallery}.
 *
 * @public
 */
export interface VideoGalleryProps {
  /**
   * Allows users to pass an object containing custom CSS styles for the gallery container.
   *
   * @Example
   * ```
   * <VideoGallery styles={{ root: { border: 'solid 1px red' } }} />
   * ```
   */
  styles?: VideoGalleryStyles;
  /** Layout of the video tiles. */
  layout?: VideoGalleryLayout;
  /** Local video particpant */
  localParticipant: VideoGalleryLocalParticipant;
  /** List of remote video particpants */
  remoteParticipants?: VideoGalleryRemoteParticipant[];
  /** List of dominant speaker userIds in the order of their dominance. 0th index is the most dominant. */
  dominantSpeakers?: string[];
  /** Local video view options */
  localVideoViewOptions?: VideoStreamOptions;
  /** Remote videos view options */
  remoteVideoViewOptions?: VideoStreamOptions;
  /** Callback to create the local video stream view */
  onCreateLocalStreamView?: (options?: VideoStreamOptions) => Promise<void | CreateVideoStreamViewResult>;
  /** Callback to dispose of the local video stream view */
  onDisposeLocalStreamView?: () => void;
  /** Callback to render the local video tile*/
  onRenderLocalVideoTile?: (localParticipant: VideoGalleryLocalParticipant) => JSX.Element;
  /** Callback to create a remote video stream view */
  onCreateRemoteStreamView?: (
    userId: string,
    options?: VideoStreamOptions
  ) => Promise<void | CreateVideoStreamViewResult>;
  /** Callback to render a remote video tile */
  onRenderRemoteVideoTile?: (remoteParticipant: VideoGalleryRemoteParticipant) => JSX.Element;
  /** Callback to dispose a remote video stream view */
  onDisposeRemoteStreamView?: (userId: string) => Promise<void>;
  /** Callback to render a particpant avatar */
  onRenderAvatar?: OnRenderAvatarCallback;
  /**
   * Whether to display the local video camera switcher button
   */
  showCameraSwitcherInLocalPreview?: boolean;
  /**
   * Whether to display a mute icon beside the user's display name.
   * @defaultValue `true`
   */
  showMuteIndicator?: boolean;
  /** Optional strings to override in component  */
  strings?: Partial<VideoGalleryStrings>;
  /**
   * Maximum number of participant remote video streams that is rendered.
   * @defaultValue 4
   */
  maxRemoteVideoStreams?: number;
  /**
   * Camera control information for button to switch cameras.
   */
  localVideoCameraCycleButtonProps?: LocalVideoCameraCycleButtonProps;
  /* @conditional-compile-remove(pinned-participants) */
  /**
   * List of pinned participant userIds
   */
  pinnedParticipants?: string[];
  /* @conditional-compile-remove(pinned-participants) */
  /**
   * Whether to show the remote video tile contextual menu.
   * @defaultValue `true`
   */
  showRemoteVideoTileContextualMenu?: boolean;
}

/**
 * VideoGallery represents a layout of video tiles for a specific call.
 * It displays a {@link VideoTile} for the local user as well as for each remote participant who has joined the call.
 *
 * @public
 */
export const VideoGallery = (props: VideoGalleryProps): JSX.Element => {
  const {
    localParticipant,
    remoteParticipants = [],
    localVideoViewOptions,
    remoteVideoViewOptions,
    dominantSpeakers,
    onRenderLocalVideoTile,
    onRenderRemoteVideoTile,
    onCreateLocalStreamView,
    onDisposeLocalStreamView,
    onCreateRemoteStreamView,
    onDisposeRemoteStreamView,
    styles,
    layout,
    onRenderAvatar,
    showMuteIndicator,
    maxRemoteVideoStreams = DEFAULT_MAX_REMOTE_VIDEO_STREAMS,
    showCameraSwitcherInLocalPreview,
    localVideoCameraCycleButtonProps
  } = props;

  const ids = useIdentifiers();
  const theme = useTheme();
  const localeStrings = useLocale().strings.videoGallery;
  const strings = useMemo(() => ({ ...localeStrings, ...props.strings }), [localeStrings, props.strings]);

  const shouldFloatLocalVideo = !!(layout === 'floatingLocalVideo' && remoteParticipants.length > 0);

  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = _useContainerWidth(containerRef);
  const containerHeight = _useContainerHeight(containerRef);
  const isNarrow = containerWidth ? isNarrowWidth(containerWidth) : false;

  /* @conditional-compile-remove(pinned-participants) */
  const [pinnedParticipants, _] = useState(props.pinnedParticipants);

  /* @conditional-compile-remove(rooms) */
  const permissions = _usePermissions();

  /**
   * Utility function for memoized rendering of LocalParticipant.
   */
  const localVideoTile = useMemo((): JSX.Element /* @conditional-compile-remove(rooms) */ | undefined => {
    /* @conditional-compile-remove(rooms) */
    if (!permissions.cameraButton) {
      return undefined;
    }
    if (onRenderLocalVideoTile) {
      return onRenderLocalVideoTile(localParticipant);
    }

    const localVideoTileStyles = concatStyleSets(
      shouldFloatLocalVideo ? floatingLocalVideoTileStyle : {},
      {
        root: { borderRadius: theme.effects.roundedCorner4 }
      },
      styles?.localVideo
    );

    const initialsName = !localParticipant.displayName ? strings.displayNamePlaceholder : localParticipant.displayName;

    return (
      <Stack key="local-video-tile-key" tabIndex={0} aria-label={strings.localVideoMovementLabel} role={'dialog'}>
        <_LocalVideoTile
          userId={localParticipant.userId}
          onCreateLocalStreamView={onCreateLocalStreamView}
          onDisposeLocalStreamView={onDisposeLocalStreamView}
          isAvailable={localParticipant?.videoStream?.isAvailable}
          isMuted={localParticipant.isMuted}
          renderElement={localParticipant?.videoStream?.renderElement}
          displayName={isNarrow ? '' : strings.localVideoLabel}
          initialsName={initialsName}
          localVideoViewOptions={localVideoViewOptions}
          onRenderAvatar={onRenderAvatar}
          showLabel={!(shouldFloatLocalVideo && isNarrow)}
          showMuteIndicator={showMuteIndicator}
          showCameraSwitcherInLocalPreview={showCameraSwitcherInLocalPreview}
          localVideoCameraCycleButtonProps={localVideoCameraCycleButtonProps}
          localVideoCameraSwitcherLabel={strings.localVideoCameraSwitcherLabel}
          localVideoSelectedDescription={strings.localVideoSelectedDescription}
          styles={localVideoTileStyles}
        />
      </Stack>
    );
  }, [
    isNarrow,
    localParticipant,
    localVideoCameraCycleButtonProps,
    localVideoViewOptions,
    onCreateLocalStreamView,
    onDisposeLocalStreamView,
    onRenderAvatar,
    onRenderLocalVideoTile,
    shouldFloatLocalVideo,
    showCameraSwitcherInLocalPreview,
    showMuteIndicator,
    strings.localVideoCameraSwitcherLabel,
    strings.localVideoLabel,
    strings.localVideoMovementLabel,
    strings.localVideoSelectedDescription,
    strings.displayNamePlaceholder,
    styles?.localVideo,
    theme.effects.roundedCorner4,
    /* @conditional-compile-remove(rooms) */ permissions.cameraButton
  ]);

  const defaultOnRenderVideoTile = useCallback(
    (participant: VideoGalleryRemoteParticipant, isVideoParticipant?: boolean) => {
      const remoteVideoStream = participant.videoStream;
      return (
        <_RemoteVideoTile
          key={participant.userId}
          userId={participant.userId}
          remoteParticipant={participant}
          onCreateRemoteStreamView={isVideoParticipant ? onCreateRemoteStreamView : undefined}
          onDisposeRemoteStreamView={isVideoParticipant ? onDisposeRemoteStreamView : undefined}
          isAvailable={isVideoParticipant ? remoteVideoStream?.isAvailable : false}
          isReceiving={isVideoParticipant ? remoteVideoStream?.isReceiving : false}
          renderElement={isVideoParticipant ? remoteVideoStream?.renderElement : undefined}
          remoteVideoViewOptions={isVideoParticipant ? remoteVideoViewOptions : undefined}
          onRenderAvatar={onRenderAvatar}
          showMuteIndicator={showMuteIndicator}
          strings={strings}
          /* @conditional-compile-remove(PSTN-calls) */
          participantState={participant.state}
          /* @conditional-compile-remove(pinned-participants) */
          showRemoteVideoTileContextualMenu={props.showRemoteVideoTileContextualMenu}
        />
      );
    },
    [
      onCreateRemoteStreamView,
      onDisposeRemoteStreamView,
      remoteVideoViewOptions,
      onRenderAvatar,
      showMuteIndicator,
      strings,
      /* @conditional-compile-remove(pinned-participants) */
      props.showRemoteVideoTileContextualMenu
    ]
  );

  const screenShareParticipant = remoteParticipants.find((participant) => participant.screenShareStream?.isAvailable);

  const localScreenShareStreamComponent = <LocalScreenShare localParticipant={localParticipant} />;

  const remoteScreenShareComponent = screenShareParticipant && (
    <RemoteScreenShare
      {...screenShareParticipant}
      renderElement={screenShareParticipant.screenShareStream?.renderElement}
      onCreateRemoteStreamView={onCreateRemoteStreamView}
      onDisposeRemoteStreamView={onDisposeRemoteStreamView}
      isReceiving={screenShareParticipant.screenShareStream?.isReceiving}
    />
  );

  const screenShareComponent = remoteScreenShareComponent
    ? remoteScreenShareComponent
    : localParticipant.isScreenSharingOn
    ? localScreenShareStreamComponent
    : undefined;

  let videoGalleryLayout: JSX.Element;
  /* @conditional-compile-remove(pinned-participants) */
  if (pinnedParticipants && pinnedParticipants.length > 0) {
    videoGalleryLayout = (
      <PinnedParticipantsLayout
        remoteParticipants={remoteParticipants}
        pinnedParticipants={pinnedParticipants}
        onRenderRemoteParticipant={onRenderRemoteVideoTile ?? defaultOnRenderVideoTile}
        localVideoComponent={localVideoTile}
        screenShareComponent={screenShareComponent}
        showCameraSwitcherInLocalPreview={showCameraSwitcherInLocalPreview}
        maxRemoteVideoStreams={maxRemoteVideoStreams}
        dominantSpeakers={dominantSpeakers}
        parentWidth={containerWidth}
        parentHeight={containerHeight}
        styles={styles}
        isLocalVideoFloating={layout === 'floatingLocalVideo'}
      />
    );
  }

  if (layout === 'floatingLocalVideo') {
    videoGalleryLayout = (
      <FloatingLocalVideoLayout
        remoteParticipants={remoteParticipants}
        onRenderRemoteParticipant={onRenderRemoteVideoTile ?? defaultOnRenderVideoTile}
        localVideoComponent={localVideoTile}
        screenShareComponent={screenShareComponent}
        showCameraSwitcherInLocalPreview={showCameraSwitcherInLocalPreview}
        maxRemoteVideoStreams={maxRemoteVideoStreams}
        dominantSpeakers={dominantSpeakers}
        parentWidth={containerWidth}
        parentHeight={containerHeight}
        styles={styles}
      />
    );
  } else {
    videoGalleryLayout = (
      <DefaultLayout
        remoteParticipants={remoteParticipants}
        onRenderRemoteParticipant={onRenderRemoteVideoTile ?? defaultOnRenderVideoTile}
        localVideoComponent={localVideoTile}
        screenShareComponent={screenShareComponent}
        maxRemoteVideoStreams={maxRemoteVideoStreams}
        dominantSpeakers={dominantSpeakers}
        parentWidth={containerWidth}
        styles={styles}
      />
    );
  }

  return (
    <div
      data-ui-id={ids.videoGallery}
      ref={containerRef}
      className={mergeStyles(videoGalleryOuterDivStyle, styles?.root)}
    >
      {videoGalleryLayout}
    </div>
  );
};
