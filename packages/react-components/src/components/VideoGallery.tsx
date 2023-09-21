// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { concatStyleSets, IStyle, mergeStyles, Stack } from '@fluentui/react';
import React, { useCallback, useMemo, useRef } from 'react';
import { GridLayoutStyles } from '.';
/* @conditional-compile-remove(pinned-participants) */
import { Announcer } from './Announcer';
/* @conditional-compile-remove(pinned-participants) */
import { useEffect } from 'react';
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
/* @conditional-compile-remove(pinned-participants) */
import { ViewScalingMode } from '../types';
import { HorizontalGalleryStyles } from './HorizontalGallery';
import { _RemoteVideoTile } from './RemoteVideoTile';
import { isNarrowWidth, _useContainerHeight, _useContainerWidth } from './utils/responsive';
import { LocalScreenShare } from './VideoGallery/LocalScreenShare';
import { RemoteScreenShare } from './VideoGallery/RemoteScreenShare';
import { LocalVideoCameraCycleButtonProps } from './LocalVideoCameraButton';
import { _ICoordinates, _ModalClone } from './ModalClone/ModalClone';
import { _formatString } from '@internal/acs-ui-common';
import { _LocalVideoTile } from './LocalVideoTile';
import { DefaultLayout } from './VideoGallery/DefaultLayout';
import { FloatingLocalVideoLayout } from './VideoGallery/FloatingLocalVideoLayout';
import { useIdentifiers } from '../identifiers';
import { localVideoTileContainerStyles, videoGalleryOuterDivStyle } from './styles/VideoGallery.styles';
import { floatingLocalVideoTileStyle } from './VideoGallery/styles/FloatingLocalVideo.styles';
/* @conditional-compile-remove(pinned-participants) */
import { useId } from '@fluentui/react-hooks';
/* @conditional-compile-remove(vertical-gallery) */
import { VerticalGalleryStyles } from './VerticalGallery';
/* @conditional-compile-remove(gallery-layouts) */
import { SpeakerVideoLayout } from './VideoGallery/SpeakerVideoLayout';
/* @conditional-compile-remove(gallery-layouts) */
import { FocusedContentLayout } from './VideoGallery/FocusContentLayout';
/* @conditional-compile-remove(gallery-layouts) */
import { LargeGalleryLayout } from './VideoGallery/LargeGalleryLayout';

/**
 * @private
 * Currently the Calling JS SDK supports up to 4 remote video streams
 */
export const DEFAULT_MAX_REMOTE_VIDEO_STREAMS = 4;

/**
 * @private
 * Styles to disable the selectivity of a text in video gallery
 */
export const unselectable = {
  '-webkit-user-select': 'none',
  '-webkit-touch-callout': 'none',
  '-moz-user-select': 'none',
  '-ms-user-select': 'none',
  'user-select': 'none'
};
/**
 * @private
 * Set aside only 6 dominant speakers for remaining audio participants
 */
export const MAX_AUDIO_DOMINANT_SPEAKERS = 6;
/**
 * @private
 * Default remote video tile menu options
 */
export const DEFAULT_REMOTE_VIDEO_TILE_MENU_OPTIONS = {
  kind: 'contextual'
};

/* @conditional-compile-remove(pinned-participants) */
/**
 * @private
 * Maximum number of remote video tiles that can be pinned
 */
export const MAX_PINNED_REMOTE_VIDEO_TILES = 4;

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
  /* @conditional-compile-remove(pinned-participants) */
  /** Menu text shown in Video Tile contextual menu for pinning a remote participant's video tile */
  pinParticipantForMe: string;
  /* @conditional-compile-remove(pinned-participants) */
  /** Menu text shown in Video Tile contextual menu for setting a remote participant's video tile */
  unpinParticipantForMe: string;
  /* @conditional-compile-remove(pinned-participants) */
  /** Aria label for pin participant menu item of remote participant's video tile */
  pinParticipantMenuItemAriaLabel: string;
  /* @conditional-compile-remove(pinned-participants) */
  /** Aria label for unpin participant menu item of remote participant's video tile */
  unpinParticipantMenuItemAriaLabel: string;
  /* @conditional-compile-remove(pinned-participants) */
  /** Aria label to announce when remote participant's video tile is pinned */
  pinnedParticipantAnnouncementAriaLabel: string;
  /* @conditional-compile-remove(pinned-participants) */
  /** Aria label to announce when remote participant's video tile is unpinned */
  unpinnedParticipantAnnouncementAriaLabel: string;
}

/**
 * @public
 */
export type VideoGalleryLayout =
  | 'default'
  | 'floatingLocalVideo'
  | /* @conditional-compile-remove(gallery-layouts) */ 'speaker'
  | /* @conditional-compile-remove(large-gallery) */ 'largeGallery'
  | /* @conditional-compile-remove(gallery-layouts) */ 'focusedContent';

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
  /* @conditional-compile-remove(vertical-gallery) */
  /** Styles for the vertical gallery */
  verticalGallery?: VerticalGalleryStyles;
}

/* @conditional-compile-remove(vertical-gallery) */
/**
 * Different modes and positions of the overflow gallery in the VideoGallery
 *
 * @beta
 */
export type OverflowGalleryPosition =
  | 'HorizontalBottom'
  | 'VerticalRight'
  | /* @conditional-compile-remove(gallery-layouts) */ 'HorizontalTop';

/* @conditional-compile-remove(click-to-call) */ /* @conditional-compile-remove(rooms) */
/**
 * different modes of the local video tile
 *
 * @beta
 */
export type LocalVideoTileSize = '9:16' | '16:9' | 'hidden' | 'followDeviceOrientation';

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
  /**
   * @deprecated use {@link onDisposeRemoteVideoStreamView} and {@link onDisposeRemoteScreenShareStreamView} instead
   *
   * Callback to dispose a remote video stream view
   */
  onDisposeRemoteStreamView?: (userId: string) => Promise<void>;
  /** Callback to dispose a remote video stream view */
  onDisposeRemoteVideoStreamView?: (userId: string) => Promise<void>;
  /** Callback to dispose a remote screen share stream view */
  onDisposeRemoteScreenShareStreamView?: (userId: string) => Promise<void>;
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
   * List of pinned participant userIds.
   */
  pinnedParticipants?: string[];
  /* @conditional-compile-remove(pinned-participants) */
  /**
   * This callback will be called when a participant video tile is pinned.
   */
  onPinParticipant?: (userId: string) => void;
  /* @conditional-compile-remove(pinned-participants) */
  /**
   * This callback will be called when a participant video tile is un-pinned.
   */
  onUnpinParticipant?: (userId: string) => void;
  /* @conditional-compile-remove(pinned-participants) */
  /**
   * Options for showing the remote video tile menu.
   *
   * @defaultValue \{ kind: 'contextual' \}
   */
  remoteVideoTileMenu?: false | VideoTileContextualMenuProps | VideoTileDrawerMenuProps;
  /* @conditional-compile-remove(vertical-gallery) */
  /**
   * Determines the layout of the overflowGallery inside the VideoGallery.
   * @defaultValue 'HorizontalBottom'
   */
  overflowGalleryPosition?: OverflowGalleryPosition;
  /* @conditional-compile-remove(click-to-call) */ /* @conditional-compile-remove(rooms) */
  /**
   * Determines the aspect ratio of local video tile in the video gallery.
   * @remarks 'followDeviceOrientation' will be responsive to the screen orientation and will change between 9:16 (portrait) and
   * 16:9 (landscape) aspect ratios.
   * @defaultValue 'followDeviceOrientation'
   */
  localVideoTileSize?: LocalVideoTileSize;
}

/* @conditional-compile-remove(pinned-participants) */
/**
 * Properties for showing contextual menu for remote {@link VideoTile} components in {@link VideoGallery}.
 *
 * @public
 */
export interface VideoTileContextualMenuProps {
  /**
   * The menu property kind
   */
  kind: 'contextual';
}

/* @conditional-compile-remove(pinned-participants) */
/**
 * Properties for showing drawer menu on remote {@link VideoTile} long touch in {@link VideoGallery}.
 *
 * @public
 */
export interface VideoTileDrawerMenuProps {
  /**
   * The menu property kind
   */
  kind: 'drawer';
  /**
   * The optional id property provided on an element that the drawer menu should render within when a
   * remote participant video tile Drawer is shown. If an id is not provided, then a drawer menu will
   * render within the VideoGallery component.
   */
  hostId?: string;
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
    onDisposeRemoteScreenShareStreamView,
    onDisposeRemoteVideoStreamView,
    styles,
    layout,
    onRenderAvatar,
    showMuteIndicator,
    maxRemoteVideoStreams = DEFAULT_MAX_REMOTE_VIDEO_STREAMS,
    showCameraSwitcherInLocalPreview,
    localVideoCameraCycleButtonProps,
    /* @conditional-compile-remove(pinned-participants) */
    onPinParticipant: onPinParticipantHandler,
    /* @conditional-compile-remove(pinned-participants) */
    onUnpinParticipant: onUnpinParticipantHandler,
    /* @conditional-compile-remove(pinned-participants) */
    remoteVideoTileMenu = DEFAULT_REMOTE_VIDEO_TILE_MENU_OPTIONS,
    /* @conditional-compile-remove(vertical-gallery) */
    overflowGalleryPosition = 'HorizontalBottom',
    /* @conditional-compile-remove(rooms) */
    localVideoTileSize = 'followDeviceOrientation'
  } = props;

  const ids = useIdentifiers();
  const theme = useTheme();
  const localeStrings = useLocale().strings.videoGallery;
  const strings = useMemo(() => ({ ...localeStrings, ...props.strings }), [localeStrings, props.strings]);

  /* @conditional-compile-remove(pinned-participants) */
  const drawerMenuHostIdFromProp =
    remoteVideoTileMenu && remoteVideoTileMenu.kind === 'drawer'
      ? (remoteVideoTileMenu as VideoTileDrawerMenuProps).hostId
      : undefined;
  /* @conditional-compile-remove(pinned-participants) */
  const drawerMenuHostId = useId('drawerMenuHost', drawerMenuHostIdFromProp);

  const localTileNotInGrid = !!(
    (layout === 'floatingLocalVideo' || /* @conditional-compile-remove(gallery-layouts) */ layout === 'speaker') &&
    remoteParticipants.length > 0
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = _useContainerWidth(containerRef);
  const containerHeight = _useContainerHeight(containerRef);
  const isNarrow = containerWidth ? isNarrowWidth(containerWidth) : false;

  /* @conditional-compile-remove(pinned-participants) */
  const [pinnedParticipantsState, setPinnedParticipantsState] = React.useState<string[]>([]);
  /* @conditional-compile-remove(pinned-participants) */
  const [selectedScalingModeState, setselectedScalingModeState] = React.useState<Record<string, VideoStreamOptions>>(
    {}
  );

  /* @conditional-compile-remove(pinned-participants) */
  const onUpdateScalingMode = useCallback(
    (remoteUserId: string, scalingMode: ViewScalingMode) => {
      setselectedScalingModeState((current) => ({
        ...current,
        [remoteUserId]: {
          scalingMode,
          isMirrored: remoteVideoViewOptions?.isMirrored
        }
      }));
    },
    [remoteVideoViewOptions?.isMirrored]
  );
  /* @conditional-compile-remove(pinned-participants) */
  useEffect(() => {
    props.pinnedParticipants?.forEach((pinParticipant) => {
      if (!props.remoteParticipants?.find((t) => t.userId === pinParticipant)) {
        // warning will be logged in the console when invalid participant id is passed in pinned participants
        console.warn('Invalid pinned participant UserId :' + pinParticipant);
      }
    });
  }, [props.pinnedParticipants, props.remoteParticipants]);
  /* @conditional-compile-remove(pinned-participants) */
  // Use pinnedParticipants from props but if it is not defined use the maintained state of pinned participants
  const pinnedParticipants = props.pinnedParticipants ?? pinnedParticipantsState;

  /**
   * Utility function for memoized rendering of LocalParticipant.
   */
  const localVideoTile = useMemo((): JSX.Element /* @conditional-compile-remove(rooms) */ | undefined => {
    /* @conditional-compile-remove(click-to-call) */
    if (localVideoTileSize === 'hidden') {
      return undefined;
    }
    if (onRenderLocalVideoTile) {
      return onRenderLocalVideoTile(localParticipant);
    }

    const localVideoTileStyles = concatStyleSets(
      localTileNotInGrid ? floatingLocalVideoTileStyle : {},
      {
        root: { borderRadius: theme.effects.roundedCorner4 }
      },
      styles?.localVideo
    );

    const initialsName = !localParticipant.displayName ? '' : localParticipant.displayName;

    return (
      <Stack
        styles={localVideoTileContainerStyles}
        key="local-video-tile-key"
        tabIndex={0}
        aria-label={strings.localVideoMovementLabel}
        role={'dialog'}
      >
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
          showLabel={
            !(
              (localTileNotInGrid && isNarrow) ||
              /*@conditional-compile-remove(click-to-call) */ /* @conditional-compile-remove(rooms) */ localVideoTileSize ===
                '9:16'
            )
          }
          showMuteIndicator={showMuteIndicator}
          showCameraSwitcherInLocalPreview={showCameraSwitcherInLocalPreview}
          localVideoCameraCycleButtonProps={localVideoCameraCycleButtonProps}
          localVideoCameraSwitcherLabel={strings.localVideoCameraSwitcherLabel}
          localVideoSelectedDescription={strings.localVideoSelectedDescription}
          styles={localVideoTileStyles}
          /* @conditional-compile-remove(raise-hand) */
          raisedHand={localParticipant.raisedHand}
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
    localTileNotInGrid,
    showCameraSwitcherInLocalPreview,
    showMuteIndicator,
    strings.localVideoCameraSwitcherLabel,
    strings.localVideoLabel,
    strings.localVideoMovementLabel,
    strings.localVideoSelectedDescription,
    styles?.localVideo,
    theme.effects.roundedCorner4,
    /*@conditional-compile-remove(click-to-call) */
    localVideoTileSize
  ]);

  /* @conditional-compile-remove(pinned-participants) */
  const onPinParticipant = useCallback(
    (userId: string) => {
      if (pinnedParticipants.length >= MAX_PINNED_REMOTE_VIDEO_TILES) {
        return;
      }
      if (!pinnedParticipantsState.includes(userId)) {
        setPinnedParticipantsState(pinnedParticipantsState.concat(userId));
      }
      onPinParticipantHandler?.(userId);
    },
    [pinnedParticipants.length, pinnedParticipantsState, setPinnedParticipantsState, onPinParticipantHandler]
  );
  /* @conditional-compile-remove(pinned-participants) */
  const onUnpinParticipant = useCallback(
    (userId: string) => {
      setPinnedParticipantsState(pinnedParticipantsState.filter((p) => p !== userId));
      onUnpinParticipantHandler?.(userId);
    },
    [pinnedParticipantsState, setPinnedParticipantsState, onUnpinParticipantHandler]
  );

  /* @conditional-compile-remove(pinned-participants) */
  const [announcementString, setAnnouncementString] = React.useState<string>('');
  /* @conditional-compile-remove(pinned-participants) */
  /**
   * sets the announcement string for VideoGallery actions so that the screenreader will trigger
   */
  const toggleAnnouncerString = useCallback(
    (announcement) => {
      setAnnouncementString(announcement);
      /**
       * Clears the announcer string after VideoGallery action allowing it to be re-announced.
       */
      setTimeout(() => {
        setAnnouncementString('');
      }, 3000);
    },
    [setAnnouncementString]
  );

  const defaultOnRenderVideoTile = useCallback(
    (participant: VideoGalleryRemoteParticipant, isVideoParticipant?: boolean) => {
      const remoteVideoStream = participant.videoStream;
      /* @conditional-compile-remove(pinned-participants) */
      const selectedScalingMode = remoteVideoStream ? selectedScalingModeState[participant.userId] : undefined;

      /* @conditional-compile-remove(pinned-participants) */
      const isPinned = pinnedParticipants?.includes(participant.userId);

      const createViewOptions = (): VideoStreamOptions | undefined => {
        /* @conditional-compile-remove(pinned-participants) */
        if (selectedScalingMode) {
          return selectedScalingMode;
        }
        /* @conditional-compile-remove(pinned-participants) */
        return remoteVideoStream?.streamSize &&
          remoteVideoStream.streamSize?.height > remoteVideoStream.streamSize?.width
          ? ({
              scalingMode: 'Fit',
              isMirrored: remoteVideoViewOptions?.isMirrored
            } as VideoStreamOptions)
          : remoteVideoViewOptions;
        return remoteVideoViewOptions;
      };

      return (
        <_RemoteVideoTile
          key={participant.userId}
          userId={participant.userId}
          remoteParticipant={participant}
          onCreateRemoteStreamView={isVideoParticipant ? onCreateRemoteStreamView : undefined}
          onDisposeRemoteStreamView={isVideoParticipant ? onDisposeRemoteVideoStreamView : undefined}
          isAvailable={isVideoParticipant ? remoteVideoStream?.isAvailable : false}
          isReceiving={isVideoParticipant ? remoteVideoStream?.isReceiving : false}
          renderElement={isVideoParticipant ? remoteVideoStream?.renderElement : undefined}
          remoteVideoViewOptions={isVideoParticipant && createViewOptions() ? createViewOptions() : undefined}
          onRenderAvatar={onRenderAvatar}
          showMuteIndicator={showMuteIndicator}
          strings={strings}
          /* @conditional-compile-remove(PSTN-calls) */
          participantState={participant.state}
          /* @conditional-compile-remove(pinned-participants) */
          menuKind={
            participant.userId === localParticipant.userId
              ? undefined
              : remoteVideoTileMenu
              ? remoteVideoTileMenu.kind === 'drawer'
                ? 'drawer'
                : 'contextual'
              : undefined
          }
          /* @conditional-compile-remove(pinned-participants) */
          drawerMenuHostId={drawerMenuHostId}
          /* @conditional-compile-remove(pinned-participants) */
          onPinParticipant={onPinParticipant}
          /* @conditional-compile-remove(pinned-participants) */
          onUnpinParticipant={onUnpinParticipant}
          /* @conditional-compile-remove(pinned-participants) */
          onUpdateScalingMode={onUpdateScalingMode}
          /* @conditional-compile-remove(pinned-participants) */
          isPinned={isPinned}
          /* @conditional-compile-remove(pinned-participants) */
          disablePinMenuItem={pinnedParticipants.length >= MAX_PINNED_REMOTE_VIDEO_TILES}
          /* @conditional-compile-remove(pinned-participants) */
          toggleAnnouncerString={toggleAnnouncerString}
        />
      );
    },
    [
      onCreateRemoteStreamView,
      onDisposeRemoteVideoStreamView,
      remoteVideoViewOptions,
      localParticipant,
      onRenderAvatar,
      showMuteIndicator,
      strings,
      /* @conditional-compile-remove(pinned-participants) */ drawerMenuHostId,
      /* @conditional-compile-remove(pinned-participants) */ remoteVideoTileMenu,
      /* @conditional-compile-remove(pinned-participants) */ selectedScalingModeState,
      /* @conditional-compile-remove(pinned-participants) */ pinnedParticipants,
      /* @conditional-compile-remove(pinned-participants) */ onPinParticipant,
      /* @conditional-compile-remove(pinned-participants) */ onUnpinParticipant,
      /* @conditional-compile-remove(pinned-participants) */ toggleAnnouncerString,
      /* @conditional-compile-remove(pinned-participants) */ onUpdateScalingMode
    ]
  );

  const screenShareParticipant = remoteParticipants.find((participant) => participant.screenShareStream?.isAvailable);

  const localScreenShareStreamComponent = <LocalScreenShare localParticipant={localParticipant} />;

  const remoteScreenShareComponent = screenShareParticipant && (
    <RemoteScreenShare
      {...screenShareParticipant}
      renderElement={screenShareParticipant.screenShareStream?.renderElement}
      onCreateRemoteStreamView={onCreateRemoteStreamView}
      onDisposeRemoteStreamView={onDisposeRemoteScreenShareStreamView}
      isReceiving={screenShareParticipant.screenShareStream?.isReceiving}
    />
  );

  const screenShareComponent = remoteScreenShareComponent
    ? remoteScreenShareComponent
    : localParticipant.isScreenSharingOn
    ? localScreenShareStreamComponent
    : undefined;

  const layoutProps = useMemo(
    () => ({
      remoteParticipants,
      localParticipant,
      screenShareComponent,
      showCameraSwitcherInLocalPreview,
      maxRemoteVideoStreams,
      dominantSpeakers,
      styles,
      onRenderRemoteParticipant: onRenderRemoteVideoTile ?? defaultOnRenderVideoTile,
      localVideoComponent: localVideoTile,
      parentWidth: containerWidth,
      parentHeight: containerHeight,
      /* @conditional-compile-remove(pinned-participants) */ pinnedParticipantUserIds: pinnedParticipants,
      /* @conditional-compile-remove(vertical-gallery) */ overflowGalleryPosition,
      /* @conditional-compile-remove(click-to-call) */ localVideoTileSize
    }),
    [
      remoteParticipants,
      localParticipant,
      screenShareComponent,
      showCameraSwitcherInLocalPreview,
      maxRemoteVideoStreams,
      dominantSpeakers,
      styles,
      localVideoTile,
      containerWidth,
      containerHeight,
      onRenderRemoteVideoTile,
      defaultOnRenderVideoTile,
      /* @conditional-compile-remove(pinned-participants) */ pinnedParticipants,
      /* @conditional-compile-remove(vertical-gallery) */ overflowGalleryPosition,
      /* @conditional-compile-remove(click-to-call) */ localVideoTileSize
    ]
  );

  const videoGalleryLayout = useMemo(() => {
    /* @conditional-compile-remove(gallery-layouts) */
    if (screenShareParticipant && layout === 'focusedContent') {
      return <FocusedContentLayout {...layoutProps} />;
    }
    if (layout === 'floatingLocalVideo') {
      return <FloatingLocalVideoLayout {...layoutProps} />;
    }
    /* @conditional-compile-remove(gallery-layouts) */
    if (layout === 'speaker') {
      return <SpeakerVideoLayout {...layoutProps} />;
    }
    /* @conditional-compile-remove(large-gallery) */
    if (layout === 'largeGallery') {
      return <LargeGalleryLayout {...layoutProps} />;
    }
    return <DefaultLayout {...layoutProps} />;
  }, [layout, layoutProps, /* @conditional-compile-remove(gallery-layouts) */ screenShareParticipant]);

  return (
    <div
      /* @conditional-compile-remove(pinned-participants) */
      // We don't assign an drawer menu host id to the VideoGallery when a drawerMenuHostId is assigned from props
      id={drawerMenuHostIdFromProp ? undefined : drawerMenuHostId}
      data-ui-id={ids.videoGallery}
      ref={containerRef}
      className={mergeStyles(videoGalleryOuterDivStyle, styles?.root, unselectable)}
    >
      {videoGalleryLayout}
      {
        /* @conditional-compile-remove(pinned-participants) */
        <Announcer announcementString={announcementString} ariaLive="polite" />
      }
    </div>
  );
};
