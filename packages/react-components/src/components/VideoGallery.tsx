// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { concatStyleSets, ContextualMenu, IDragOptions, IStyle, LayerHost, mergeStyles, Stack } from '@fluentui/react';
import React, { useCallback, useMemo, useRef } from 'react';
import { GridLayoutStyles } from '.';
import { smartDominantSpeakerParticipants } from '../gallery';
import { useIdentifiers } from '../identifiers/IdentifierProvider';
import { useLocale } from '../localization';
import { useTheme } from '../theming';
import {
  BaseCustomStyles,
  OnRenderAvatarCallback,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant,
  VideoStreamOptions
} from '../types';
import { GridLayout } from './GridLayout';
import { HorizontalGalleryStyles } from './HorizontalGallery';
import { RemoteVideoTile } from './RemoteVideoTile';
import { ResponsiveHorizontalGallery } from './ResponsiveHorizontalGallery';
import { StreamMedia } from './StreamMedia';
import { HORIZONTAL_GALLERY_BUTTON_WIDTH, HORIZONTAL_GALLERY_GAP } from './styles/HorizontalGallery.styles';
import {
  LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM,
  SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM,
  floatingLocalVideoModalStyle,
  floatingLocalVideoTileStyle,
  horizontalGalleryContainerStyle,
  horizontalGalleryStyle,
  layerHostStyle,
  localVideoTileContainerStyle,
  videoGalleryContainerStyle,
  videoGalleryOuterDivStyle
} from './styles/VideoGallery.styles';
import { isNarrowWidth, useContainerWidth } from './utils/responsive';
import { LocalScreenShare } from './VideoGallery/LocalScreenShare';
import { RemoteScreenShare } from './VideoGallery/RemoteScreenShare';
import { VideoTile } from './VideoTile';
import { useId } from '@fluentui/react-hooks';
/* @conditional-compile-remove(local-camera-switcher) */
import { LocalVideoCameraCycleButton, LocalVideoCameraCycleButtonProps } from './LocalVideoCameraButton';
/* @conditional-compile-remove(call-with-chat-composite) @conditional-compile-remove(local-camera-switcher) */
import { localVideoTileWithControlsContainerStyle, LOCAL_VIDEO_TILE_ZINDEX } from './styles/VideoGallery.styles';
import { ModalClone } from './ModalClone/ModalClone';

// Currently the Calling JS SDK supports up to 4 remote video streams
const DEFAULT_MAX_REMOTE_VIDEO_STREAMS = 4;
// Set aside only 6 dominant speakers for remaining audio participants
const MAX_AUDIO_DOMINANT_SPEAKERS = 6;

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
  /* @conditional-compile-remove(call-with-chat-composite) @conditional-compile-remove(local-camera-switcher) */
  /** String for local video camera switcher */
  localVideoCameraSwitcherLabel: string;
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
  onCreateLocalStreamView?: (options?: VideoStreamOptions) => Promise<void>;
  /** Callback to dispose of the local video stream view */
  onDisposeLocalStreamView?: () => void;
  /** Callback to render the local video tile*/
  onRenderLocalVideoTile?: (localParticipant: VideoGalleryLocalParticipant) => JSX.Element;
  /** Callback to create a remote video stream view */
  onCreateRemoteStreamView?: (userId: string, options?: VideoStreamOptions) => Promise<void>;
  /** Callback to render a remote video tile */
  onRenderRemoteVideoTile?: (remoteParticipant: VideoGalleryRemoteParticipant) => JSX.Element;
  /** Callback to dispose a remote video stream view */
  onDisposeRemoteStreamView?: (userId: string) => Promise<void>;
  /** Callback to render a particpant avatar */
  onRenderAvatar?: OnRenderAvatarCallback;
  /* @conditional-compile-remove(local-camera-switcher) */
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
  /* @conditional-compile-remove(call-with-chat-composite) @conditional-compile-remove(local-camera-switcher) */
  /**
   * Camera control information for button to switch cameras.
   */
  localVideoCameraCycleButtonProps?: LocalVideoCameraCycleButtonProps;
}

const DRAG_OPTIONS: IDragOptions = {
  moveMenuItemText: 'Move',
  closeMenuItemText: 'Close',
  menu: ContextualMenu,
  keepInBounds: true
};

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
    onCreateRemoteStreamView,
    onDisposeRemoteStreamView,
    styles,
    layout,
    onRenderAvatar,
    showMuteIndicator,
    maxRemoteVideoStreams = DEFAULT_MAX_REMOTE_VIDEO_STREAMS,
    /* @conditional-compile-remove(local-camera-switcher) */
    showCameraSwitcherInLocalPreview,
    /* @conditional-compile-remove(local-camera-switcher) */
    localVideoCameraCycleButtonProps
  } = props;

  const ids = useIdentifiers();
  const theme = useTheme();
  const localeStrings = useLocale().strings.videoGallery;
  const strings = { ...localeStrings, ...props.strings };

  const shouldFloatLocalVideo = !!(layout === 'floatingLocalVideo' && remoteParticipants.length > 0);
  /* @conditional-compile-remove(call-with-chat-composite) @conditional-compile-remove(local-camera-switcher) */
  const shouldFloatNonDraggableLocalVideo = !!(showCameraSwitcherInLocalPreview && shouldFloatLocalVideo);

  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(containerRef);
  const isNarrow = isNarrowWidth(containerWidth);
  const visibleVideoParticipants = useRef<VideoGalleryRemoteParticipant[]>([]);
  const visibleAudioParticipants = useRef<VideoGalleryRemoteParticipant[]>([]);

  visibleVideoParticipants.current = smartDominantSpeakerParticipants({
    participants: remoteParticipants?.filter((p) => p.videoStream?.isAvailable) ?? [],
    dominantSpeakers,
    lastVisibleParticipants: visibleVideoParticipants.current,
    maxDominantSpeakers: maxRemoteVideoStreams
  }).slice(0, maxRemoteVideoStreams);

  // This set will be used to filter out participants already in visibleVideoParticipants
  const visibleVideoParticipantsSet = new Set(visibleVideoParticipants.current.map((p) => p.userId));
  visibleAudioParticipants.current = smartDominantSpeakerParticipants({
    participants: remoteParticipants?.filter((p) => !visibleVideoParticipantsSet.has(p.userId)) ?? [],
    dominantSpeakers,
    lastVisibleParticipants: visibleAudioParticipants.current,
    maxDominantSpeakers: MAX_AUDIO_DOMINANT_SPEAKERS
  });

  /* @conditional-compile-remove(call-with-chat-composite) @conditional-compile-remove(local-camera-switcher) */
  const localCameraCycleButton = (localVideoCameraCycleButtonProps): JSX.Element => {
    return (
      <>
        {showCameraSwitcherInLocalPreview &&
          localVideoCameraCycleButtonProps?.cameras !== undefined &&
          localVideoCameraCycleButtonProps?.selectedCamera !== undefined &&
          localVideoCameraCycleButtonProps?.onSelectCamera !== undefined && (
            <LocalVideoCameraCycleButton
              cameras={localVideoCameraCycleButtonProps.cameras}
              selectedCamera={localVideoCameraCycleButtonProps.selectedCamera}
              onSelectCamera={localVideoCameraCycleButtonProps.onSelectCamera}
              label={strings.localVideoCameraSwitcherLabel}
            />
          )}
      </>
    );
  };

  /**
   * Utility function for memoized rendering of LocalParticipant.
   */
  const localVideoTile = useMemo((): JSX.Element => {
    const localVideoStream = localParticipant?.videoStream;

    if (onRenderLocalVideoTile) {
      return onRenderLocalVideoTile(localParticipant);
    }

    const localVideoTileStyles = shouldFloatLocalVideo ? floatingLocalVideoTileStyle : {};

    const localVideoTileStylesThemed = concatStyleSets(
      localVideoTileStyles,
      {
        root: { borderRadius: theme.effects.roundedCorner4 }
      },
      styles?.localVideo
    );

    if (localVideoStream && !localVideoStream.renderElement) {
      onCreateLocalStreamView && onCreateLocalStreamView(localVideoViewOptions);
    }
    return (
      <VideoTile
        key={localParticipant.userId}
        userId={localParticipant.userId}
        renderElement={
          localVideoStream?.renderElement ? (
            <>
              {
                /* @conditional-compile-remove(call-with-chat-composite) @conditional-compile-remove(local-camera-switcher) */
                localCameraCycleButton(localVideoCameraCycleButtonProps)
              }
              <StreamMedia videoStreamElement={localVideoStream.renderElement} />
            </>
          ) : undefined
        }
        showLabel={!(shouldFloatLocalVideo && isNarrow)}
        displayName={isNarrow ? '' : strings.localVideoLabel}
        initialsName={localParticipant.displayName}
        styles={localVideoTileStylesThemed}
        onRenderPlaceholder={onRenderAvatar}
        isMuted={localParticipant.isMuted}
        showMuteIndicator={showMuteIndicator}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    localParticipant,
    localParticipant.isScreenSharingOn,
    localParticipant.videoStream,
    localParticipant.videoStream?.renderElement,
    isNarrow,
    onCreateLocalStreamView,
    onRenderLocalVideoTile,
    onRenderAvatar,
    shouldFloatLocalVideo
  ]);

  const defaultOnRenderVideoTile = useCallback(
    (participant: VideoGalleryRemoteParticipant, isVideoParticipant?: boolean) => {
      const remoteVideoStream = participant.videoStream;
      return (
        <RemoteVideoTile
          key={participant.userId}
          {...participant}
          onCreateRemoteStreamView={isVideoParticipant ? onCreateRemoteStreamView : undefined}
          onDisposeRemoteStreamView={isVideoParticipant ? onDisposeRemoteStreamView : undefined}
          isAvailable={isVideoParticipant ? remoteVideoStream?.isAvailable : false}
          renderElement={isVideoParticipant ? remoteVideoStream?.renderElement : undefined}
          remoteVideoViewOptions={isVideoParticipant ? remoteVideoViewOptions : undefined}
          onRenderAvatar={onRenderAvatar}
          showMuteIndicator={showMuteIndicator}
        />
      );
    },
    [onCreateRemoteStreamView, onDisposeRemoteStreamView, remoteVideoViewOptions, onRenderAvatar, showMuteIndicator]
  );

  const videoTiles = onRenderRemoteVideoTile
    ? visibleVideoParticipants.current.map((participant) => onRenderRemoteVideoTile(participant))
    : visibleVideoParticipants.current.map((participant): JSX.Element => {
        return defaultOnRenderVideoTile(participant, true);
      });

  const audioTiles = onRenderRemoteVideoTile
    ? visibleAudioParticipants.current.map((participant) => onRenderRemoteVideoTile(participant))
    : visibleAudioParticipants.current.map((participant): JSX.Element => {
        return defaultOnRenderVideoTile(participant, false);
      });

  const screenShareParticipant = remoteParticipants.find((participant) => participant.screenShareStream?.isAvailable);
  const screenShareActive = screenShareParticipant || localParticipant?.isScreenSharingOn;

  let gridTiles: JSX.Element[] = [];
  let horizontalGalleryTiles: JSX.Element[] = [];

  if (screenShareActive) {
    // If screen sharing is active, assign video and audio participants as horizontal gallery participants
    horizontalGalleryTiles = videoTiles.concat(audioTiles);
  } else {
    // If screen sharing is not active, then assign all video tiles as grid tiles.
    // If there are no video tiles, then assign audio tiles as grid tiles.
    gridTiles = videoTiles.length > 0 ? videoTiles : audioTiles;
    horizontalGalleryTiles = videoTiles.length > 0 ? audioTiles : [];
  }

  if (
    !shouldFloatLocalVideo &&
    /* @conditional-compile-remove(call-with-chat-composite) @conditional-compile-remove(local-camera-switcher) */ !shouldFloatNonDraggableLocalVideo &&
    localParticipant
  ) {
    gridTiles.push(localVideoTile);
  }

  const localScreenShareStreamComponent = <LocalScreenShare localParticipant={localParticipant} />;

  const remoteScreenShareComponent = screenShareParticipant && (
    <RemoteScreenShare
      {...screenShareParticipant}
      renderElement={screenShareParticipant.screenShareStream?.renderElement}
      onCreateRemoteStreamView={onCreateRemoteStreamView}
      onDisposeRemoteStreamView={onDisposeRemoteStreamView}
    />
  );

  const horizontalGalleryPresent = horizontalGalleryTiles && horizontalGalleryTiles.length > 0;
  const layerHostId = useId('layerhost');

  return (
    <div
      data-ui-id={ids.videoGallery}
      ref={containerRef}
      className={mergeStyles(videoGalleryOuterDivStyle, styles?.root)}
    >
      {shouldFloatLocalVideo &&
        /* @conditional-compile-remove(call-with-chat-composite) @conditional-compile-remove(local-camera-switcher) */
        !shouldFloatNonDraggableLocalVideo &&
        localParticipant &&
        (horizontalGalleryPresent ? (
          <Stack className={mergeStyles(localVideoTileContainerStyle(theme, isNarrow))}>{localVideoTile}</Stack>
        ) : (
          <ModalClone
            isOpen={true}
            isModeless={true}
            dragOptions={DRAG_OPTIONS}
            styles={floatingLocalVideoModalStyle(theme, isNarrow)}
            layerProps={{ hostId: layerHostId }}
          >
            {localVideoTile}
          </ModalClone>
        ))}
      {
        /* @conditional-compile-remove(call-with-chat-composite) @conditional-compile-remove(local-camera-switcher) */
        // When we use showCameraSwitcherInLocalPreview it disables dragging to allow keyboard navigation.
        shouldFloatNonDraggableLocalVideo && localParticipant && remoteParticipants.length > 0 && (
          <Stack
            className={mergeStyles(localVideoTileWithControlsContainerStyle(theme, isNarrow), {
              boxShadow: theme.effects.elevation8,
              zIndex: LOCAL_VIDEO_TILE_ZINDEX
            })}
          >
            {localVideoTile}
          </Stack>
        )
      }
      <Stack horizontal={false} styles={videoGalleryContainerStyle}>
        {screenShareParticipant ? (
          remoteScreenShareComponent
        ) : localParticipant?.isScreenSharingOn ? (
          localScreenShareStreamComponent
        ) : (
          <GridLayout key="grid-layout" styles={styles?.gridLayout}>
            {gridTiles}
          </GridLayout>
        )}
        {horizontalGalleryPresent && (
          <div style={{ paddingTop: '0.5rem' }}>
            <ResponsiveHorizontalGallery
              key="responsive-horizontal-gallery"
              containerStyles={horizontalGalleryContainerStyle(shouldFloatLocalVideo, isNarrow)}
              horizontalGalleryStyles={concatStyleSets(horizontalGalleryStyle(isNarrow), styles?.horizontalGallery)}
              childWidthRem={
                isNarrow ? SMALL_HORIZONTAL_GALLERY_TILE_SIZE_REM.width : LARGE_HORIZONTAL_GALLERY_TILE_SIZE_REM.width
              }
              buttonWidthRem={HORIZONTAL_GALLERY_BUTTON_WIDTH}
              gapWidthRem={HORIZONTAL_GALLERY_GAP}
            >
              {horizontalGalleryTiles}
            </ResponsiveHorizontalGallery>
          </div>
        )}

        <LayerHost id={layerHostId} className={mergeStyles(layerHostStyle)} />
      </Stack>
    </div>
  );
};
