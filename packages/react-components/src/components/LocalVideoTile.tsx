// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles, Stack, Spinner } from '@fluentui/react';
import { concatStyleSets, IContextualMenuProps, Layer } from '@fluentui/react';
import { _formatString } from '@internal/acs-ui-common';
import React, { useMemo } from 'react';
import { KeyboardEvent, useCallback } from 'react';
import { OnRenderAvatarCallback, VideoStreamOptions, CreateVideoStreamViewResult } from '../types';
import { Reaction } from '../types';
import { LocalVideoCameraCycleButton, LocalVideoCameraCycleButtonProps } from './LocalVideoCameraButton';
import { StreamMedia } from './StreamMedia';
import {
  useLocalVideoStreamLifecycleMaintainer,
  LocalVideoStreamLifecycleMaintainerProps
} from './VideoGallery/useVideoStreamLifecycleMaintainer';
import { VideoTile, VideoTileStylesProps } from './VideoTile';
import { RaisedHand } from '../types';
import { useTheme } from '../theming';
import { ReactionResources } from '../types/ReactionTypes';
import { MeetingReactionOverlay } from './MeetingReactionOverlay';
import { useVideoTileContextualMenuProps } from './VideoGallery/useVideoTileContextualMenuProps';
import { VideoGalleryStrings } from './VideoGallery';
import { _DrawerMenu, _DrawerMenuItemProps } from './Drawer';
import { drawerMenuWrapperStyles } from './VideoGallery/styles/RemoteVideoTile.styles';
import {
  videoContainerStyles,
  overlayStyles,
  overlayStylesTransparent,
  loadSpinnerStyles
} from './styles/VideoTile.styles';
/* @conditional-compile-remove(media-access) */
import { MediaAccess } from '../types';

/**
 * A memoized version of VideoTile for rendering local participant.
 *
 * @internal
 */
export const _LocalVideoTile = React.memo(
  (props: {
    userId?: string;
    onCreateLocalStreamView?: (options?: VideoStreamOptions) => Promise<void | CreateVideoStreamViewResult>;
    onDisposeLocalStreamView?: () => void;
    isAvailable?: boolean;
    isMuted?: boolean;
    renderElement?: HTMLElement;
    displayName?: string;
    initialsName?: string;
    localVideoViewOptions?: VideoStreamOptions;
    onRenderAvatar?: OnRenderAvatarCallback;
    showLabel: boolean;
    alwaysShowLabelBackground?: boolean;
    showMuteIndicator?: boolean;
    showCameraSwitcherInLocalPreview?: boolean;
    localVideoCameraCycleButtonProps?: LocalVideoCameraCycleButtonProps;
    localVideoCameraSwitcherLabel?: string;
    localVideoSelectedDescription?: string;
    styles?: VideoTileStylesProps;
    personaMinSize?: number;
    raisedHand?: RaisedHand;
    reaction?: Reaction;
    spotlightedParticipantUserIds?: string[];
    isSpotlighted?: boolean;
    onStartSpotlight?: () => void;
    onStopSpotlight?: () => void;
    maxParticipantsToSpotlight?: number;
    menuKind?: 'contextual' | 'drawer';
    drawerMenuHostId?: string;
    strings?: VideoGalleryStrings;
    reactionResources?: ReactionResources;
    participantsCount?: number;
    isScreenSharingOn?: boolean;
    /* @conditional-compile-remove(media-access) */
    mediaAccess?: MediaAccess;
  }) => {
    const {
      isAvailable,
      isMuted,
      onCreateLocalStreamView,
      onDisposeLocalStreamView,
      localVideoViewOptions,
      renderElement,
      userId,
      showLabel,
      alwaysShowLabelBackground,
      displayName,
      initialsName,
      onRenderAvatar,
      showMuteIndicator,
      styles,
      showCameraSwitcherInLocalPreview,
      localVideoCameraCycleButtonProps,
      localVideoCameraSwitcherLabel,
      localVideoSelectedDescription,
      raisedHand,
      reaction,
      isSpotlighted,
      spotlightedParticipantUserIds,
      onStartSpotlight,
      onStopSpotlight,
      maxParticipantsToSpotlight,
      menuKind,
      strings,
      reactionResources,
      isScreenSharingOn,
      /* @conditional-compile-remove(media-access) */
      mediaAccess
    } = props;

    const theme = useTheme();

    const localVideoStreamProps: LocalVideoStreamLifecycleMaintainerProps = useMemo(
      () => ({
        isMirrored: localVideoViewOptions?.isMirrored,
        isStreamAvailable: isAvailable,
        onCreateLocalStreamView,
        onDisposeLocalStreamView,
        renderElementExists: !!renderElement,
        scalingMode: localVideoViewOptions?.scalingMode,
        /* @conditional-compile-remove(media-access) */
        isVideoPermitted: mediaAccess?.isVideoPermitted
      }),
      [
        isAvailable,
        localVideoViewOptions?.isMirrored,
        localVideoViewOptions?.scalingMode,
        onCreateLocalStreamView,
        onDisposeLocalStreamView,
        renderElement,
        /* @conditional-compile-remove(media-access) */
        mediaAccess?.isVideoPermitted
      ]
    );

    // Handle creating, destroying and updating the video stream as necessary
    useLocalVideoStreamLifecycleMaintainer(localVideoStreamProps);

    const contextualMenuProps = useVideoTileContextualMenuProps({
      participant: { userId: userId ?? '' },
      strings: { ...strings },
      spotlightedParticipantUserIds,
      isSpotlighted,
      onStartSpotlight,
      onStopSpotlight,
      maxParticipantsToSpotlight,
      myUserId: userId
    });

    const videoTileContextualMenuProps = useMemo(() => {
      if (menuKind !== 'contextual' || !contextualMenuProps) {
        return {};
      }
      return {
        contextualMenu: contextualMenuProps
      };
      return {};
    }, [contextualMenuProps, menuKind]);

    const videoTileStyles = useMemo(() => {
      if (isSpotlighted) {
        return concatStyleSets(
          {
            root: {
              outline: `0.25rem solid ${theme.palette.neutralTertiaryAlt}`,
              outlineOffset: '-0.25rem'
            }
          },
          styles
        );
      }
      return styles;
    }, [isSpotlighted, theme.palette.neutralTertiaryAlt, styles]);

    const [drawerMenuItemProps, setDrawerMenuItemProps] = React.useState<_DrawerMenuItemProps[]>([]);

    const onKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          setDrawerMenuItemProps(
            convertContextualMenuItemsToDrawerMenuItemProps(contextualMenuProps, () => setDrawerMenuItemProps([]))
          );
        }
      },
      [setDrawerMenuItemProps, contextualMenuProps]
    );

    const renderVideoStreamElement = useMemo(() => {
      // Checking if renderElement is well defined or not as calling SDK has a number of video streams limitation which
      // implies that, after their threshold, all streams have no child (blank video)
      if (!renderElement || !renderElement.childElementCount) {
        // Returning `undefined` results in the placeholder with avatar being shown
        return undefined;
      }

      return (
        <>
          <FloatingLocalCameraCycleButton
            showCameraSwitcherInLocalPreview={showCameraSwitcherInLocalPreview ?? false}
            localVideoCameraCycleButtonProps={localVideoCameraCycleButtonProps}
            localVideoCameraSwitcherLabel={localVideoCameraSwitcherLabel}
            localVideoSelectedDescription={localVideoSelectedDescription}
          />
          <StreamMedia videoStreamElement={renderElement} isMirrored={true} />
          {props.participantsCount === 1 && !isScreenSharingOn && (
            <Stack className={mergeStyles(videoContainerStyles, overlayStyles())}>
              <Spinner
                label={strings?.waitingScreenText}
                ariaLive="assertive"
                role="alert"
                labelPosition="bottom"
                styles={loadSpinnerStyles(theme, true)}
              />
            </Stack>
          )}
        </>
      );
    }, [
      localVideoCameraCycleButtonProps,
      localVideoCameraSwitcherLabel,
      localVideoSelectedDescription,
      renderElement,
      showCameraSwitcherInLocalPreview,
      props.participantsCount,
      strings?.waitingScreenText,
      theme,
      isScreenSharingOn
    ]);

    const videoTileOverlay = useMemo(() => {
      const reactionOverlay =
        reactionResources !== undefined ? (
          <MeetingReactionOverlay overlayMode="grid-tiles" reaction={reaction} reactionResources={reactionResources} />
        ) : undefined;
      return reactionOverlay;
    }, [reaction, reactionResources]);

    const onRenderAvatarOneParticipant = useCallback(() => {
      return (
        <Stack className={mergeStyles(videoContainerStyles, overlayStylesTransparent())}>
          <Spinner
            label={strings?.waitingScreenText}
            ariaLive="assertive"
            labelPosition="bottom"
            role="alert"
            styles={loadSpinnerStyles(theme, false)}
          />
        </Stack>
      );
    }, [strings?.waitingScreenText, theme]);

    return (
      <Stack
        data-ui-id="local-video-tile"
        className={mergeStyles({ width: '100%', height: '100%' })}
        onKeyDown={menuKind === 'drawer' ? onKeyDown : undefined}
      >
        <VideoTile
          key={userId ?? 'local-video-tile'}
          userId={userId}
          renderElement={renderVideoStreamElement}
          showLabel={showLabel}
          alwaysShowLabelBackground={alwaysShowLabelBackground}
          displayName={displayName}
          initialsName={initialsName}
          styles={videoTileStyles}
          onRenderPlaceholder={
            props.participantsCount === 1 && !isScreenSharingOn ? onRenderAvatarOneParticipant : onRenderAvatar
          }
          isMuted={isMuted}
          showMuteIndicator={showMuteIndicator}
          personaMinSize={props.personaMinSize}
          raisedHand={raisedHand}
          isSpotlighted={isSpotlighted}
          {...videoTileContextualMenuProps}
          onLongTouch={() =>
            setDrawerMenuItemProps(
              convertContextualMenuItemsToDrawerMenuItemProps(contextualMenuProps, () => setDrawerMenuItemProps([]))
            )
          }
          overlay={videoTileOverlay}
          /* @conditional-compile-remove(media-access) */ mediaAccess={mediaAccess}
        >
          {drawerMenuItemProps.length > 0 && (
            <Layer hostId={props.drawerMenuHostId}>
              <Stack styles={drawerMenuWrapperStyles}>
                <_DrawerMenu onLightDismiss={() => setDrawerMenuItemProps([])} items={drawerMenuItemProps} />
              </Stack>
            </Layer>
          )}
        </VideoTile>
      </Stack>
    );
  }
);

const FloatingLocalCameraCycleButton = (props: {
  showCameraSwitcherInLocalPreview: boolean;
  localVideoCameraCycleButtonProps?: LocalVideoCameraCycleButtonProps;
  localVideoCameraSwitcherLabel?: string;
  localVideoSelectedDescription?: string;
}): JSX.Element => {
  const {
    showCameraSwitcherInLocalPreview,
    localVideoCameraCycleButtonProps,
    localVideoCameraSwitcherLabel,
    localVideoSelectedDescription
  } = props;
  const ariaDescription =
    localVideoCameraCycleButtonProps?.selectedCamera &&
    localVideoSelectedDescription &&
    _formatString(localVideoSelectedDescription, {
      cameraName: localVideoCameraCycleButtonProps.selectedCamera.name
    });
  return (
    <Stack horizontalAlign="end">
      {showCameraSwitcherInLocalPreview &&
        localVideoCameraCycleButtonProps?.cameras !== undefined &&
        localVideoCameraCycleButtonProps?.selectedCamera !== undefined &&
        localVideoCameraCycleButtonProps?.onSelectCamera !== undefined && (
          <LocalVideoCameraCycleButton
            cameras={localVideoCameraCycleButtonProps.cameras}
            selectedCamera={localVideoCameraCycleButtonProps.selectedCamera}
            onSelectCamera={localVideoCameraCycleButtonProps.onSelectCamera}
            label={localVideoCameraSwitcherLabel}
            ariaDescription={ariaDescription}
          />
        )}
    </Stack>
  );
};

const convertContextualMenuItemsToDrawerMenuItemProps = (
  contextualMenuProps?: IContextualMenuProps,
  onLightDismiss?: () => void
): _DrawerMenuItemProps[] => {
  if (!contextualMenuProps) {
    return [];
  }
  return contextualMenuProps.items.map((item) => {
    return {
      itemKey: item.key,
      text: item.text,
      iconProps: item.iconProps,
      disabled: item.disabled,
      onItemClick: () => {
        item.onClick?.();
        onLightDismiss?.();
      }
    };
  });
};
