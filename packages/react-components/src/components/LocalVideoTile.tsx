// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles, Stack } from '@fluentui/react';
/* @conditional-compile-remove(spotlight) */
import { concatStyleSets, IContextualMenuProps, Layer } from '@fluentui/react';
import { _formatString } from '@internal/acs-ui-common';
import React, { useMemo } from 'react';
/* @conditional-compile-remove(spotlight) */
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
/* @conditional-compile-remove(spotlight) */
import { useTheme } from '../theming';
import { ReactionResources } from '../types/ReactionTypes';
import { MeetingReactionOverlay } from './MeetingReactionOverlay';
/* @conditional-compile-remove(spotlight) */
import { useVideoTileContextualMenuProps } from './VideoGallery/useVideoTileContextualMenuProps';
/* @conditional-compile-remove(spotlight) */
import { VideoGalleryStrings } from './VideoGallery';
/* @conditional-compile-remove(spotlight) */
import { _DrawerMenu, _DrawerMenuItemProps } from './Drawer';
/* @conditional-compile-remove(spotlight) */
import { drawerMenuWrapperStyles } from './VideoGallery/styles/RemoteVideoTile.styles';
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
    /* @conditional-compile-remove(spotlight) */
    spotlightedParticipantUserIds?: string[];
    /* @conditional-compile-remove(spotlight) */
    isSpotlighted?: boolean;
    /* @conditional-compile-remove(spotlight) */
    onStartSpotlight?: () => void;
    /* @conditional-compile-remove(spotlight) */
    onStopSpotlight?: () => void;
    /* @conditional-compile-remove(spotlight) */
    maxParticipantsToSpotlight?: number;
    /* @conditional-compile-remove(spotlight) */
    menuKind?: 'contextual' | 'drawer';
    /* @conditional-compile-remove(spotlight) */
    drawerMenuHostId?: string;
    /* @conditional-compile-remove(spotlight) */
    strings?: VideoGalleryStrings;
    reactionResources?: ReactionResources;
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
      /* @conditional-compile-remove(spotlight) */
      isSpotlighted,
      /* @conditional-compile-remove(spotlight) */
      spotlightedParticipantUserIds,
      /* @conditional-compile-remove(spotlight) */
      onStartSpotlight,
      /* @conditional-compile-remove(spotlight) */
      onStopSpotlight,
      /* @conditional-compile-remove(spotlight) */
      maxParticipantsToSpotlight,
      /* @conditional-compile-remove(spotlight) */
      menuKind,
      /* @conditional-compile-remove(spotlight) */
      strings,
      reactionResources
    } = props;

    /* @conditional-compile-remove(spotlight) */
    const theme = useTheme();

    const localVideoStreamProps: LocalVideoStreamLifecycleMaintainerProps = useMemo(
      () => ({
        isMirrored: localVideoViewOptions?.isMirrored,
        isStreamAvailable: isAvailable,
        onCreateLocalStreamView,
        onDisposeLocalStreamView,
        renderElementExists: !!renderElement,
        scalingMode: localVideoViewOptions?.scalingMode
      }),
      [
        isAvailable,
        localVideoViewOptions?.isMirrored,
        localVideoViewOptions?.scalingMode,
        onCreateLocalStreamView,
        onDisposeLocalStreamView,
        renderElement
      ]
    );

    // Handle creating, destroying and updating the video stream as necessary
    useLocalVideoStreamLifecycleMaintainer(localVideoStreamProps);

    /* @conditional-compile-remove(spotlight) */
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
      /* @conditional-compile-remove(spotlight) */
      if (menuKind !== 'contextual' || !contextualMenuProps) {
        return {};
      }
      /* @conditional-compile-remove(spotlight) */
      return {
        contextualMenu: contextualMenuProps
      };
      return {};
    }, [
      /* @conditional-compile-remove(spotlight) */ contextualMenuProps,
      /* @conditional-compile-remove(spotlight) */ menuKind
    ]);

    const videoTileStyles = useMemo(() => {
      /* @conditional-compile-remove(spotlight) */
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
    }, [
      /* @conditional-compile-remove(spotlight) */ isSpotlighted,
      /* @conditional-compile-remove(spotlight) */ theme.palette.neutralTertiaryAlt,
      styles
    ]);

    /* @conditional-compile-remove(spotlight) */
    const [drawerMenuItemProps, setDrawerMenuItemProps] = React.useState<_DrawerMenuItemProps[]>([]);

    /* @conditional-compile-remove(spotlight) */
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
        </>
      );
    }, [
      localVideoCameraCycleButtonProps,
      localVideoCameraSwitcherLabel,
      localVideoSelectedDescription,
      renderElement,
      showCameraSwitcherInLocalPreview
    ]);

    const reactionOverlay =
      reactionResources !== undefined ? (
        <MeetingReactionOverlay overlayMode="grid-tiles" reaction={reaction} reactionResources={reactionResources} />
      ) : undefined;

    return (
      <Stack
        className={mergeStyles({ width: '100%', height: '100%' })}
        /* @conditional-compile-remove(spotlight) */ onKeyDown={menuKind === 'drawer' ? onKeyDown : undefined}
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
          onRenderPlaceholder={onRenderAvatar}
          isMuted={isMuted}
          showMuteIndicator={showMuteIndicator}
          personaMinSize={props.personaMinSize}
          raisedHand={raisedHand}
          /* @conditional-compile-remove(spotlight) */
          isSpotlighted={isSpotlighted}
          {...videoTileContextualMenuProps}
          /* @conditional-compile-remove(spotlight) */
          onLongTouch={() =>
            setDrawerMenuItemProps(
              convertContextualMenuItemsToDrawerMenuItemProps(contextualMenuProps, () => setDrawerMenuItemProps([]))
            )
          }
          overlay={reactionOverlay}
        >
          {
            /* @conditional-compile-remove(spotlight) */ drawerMenuItemProps.length > 0 && (
              <Layer hostId={props.drawerMenuHostId}>
                <Stack styles={drawerMenuWrapperStyles}>
                  <_DrawerMenu onLightDismiss={() => setDrawerMenuItemProps([])} items={drawerMenuItemProps} />
                </Stack>
              </Layer>
            )
          }
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

/* @conditional-compile-remove(spotlight) */
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
