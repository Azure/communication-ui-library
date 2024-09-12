// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IContextualMenuProps, Layer, Stack } from '@fluentui/react';
import React, { useMemo } from 'react';
import { KeyboardEvent, useCallback } from 'react';
import {
  CreateVideoStreamViewResult,
  OnRenderAvatarCallback,
  ParticipantState,
  VideoGalleryRemoteParticipant,
  VideoStreamOptions,
  ViewScalingMode
} from '../types';
import { _DrawerMenu, _DrawerMenuItemProps } from './Drawer';
import { StreamMedia } from './StreamMedia';
import { VideoGalleryStrings } from './VideoGallery';
import { drawerMenuWrapperStyles, remoteVideoTileWrapperStyle } from './VideoGallery/styles/RemoteVideoTile.styles';
import {
  RemoteVideoStreamLifecycleMaintainerProps,
  useRemoteVideoStreamLifecycleMaintainer
} from './VideoGallery/useVideoStreamLifecycleMaintainer';
import { useVideoTileContextualMenuProps } from './VideoGallery/useVideoTileContextualMenuProps';
import { VideoTile } from './VideoTile';
import { _formatString } from '@internal/acs-ui-common';
import { ReactionResources } from '../types/ReactionTypes';
import { MeetingReactionOverlay } from './MeetingReactionOverlay';

/**
 * A memoized version of VideoTile for rendering remote participants. React.memo is used for a performance
 * boost by memoizing the same rendered component to avoid rerendering a VideoTile when its position in the
 * array changes causing a rerender in the parent component. https://reactjs.org/docs/react-api.html#reactmemo
 *
 * @internal
 */
export const _RemoteVideoTile = React.memo(
  (props: {
    userId: string;
    remoteParticipant: VideoGalleryRemoteParticipant;
    onCreateRemoteStreamView?: (
      userId: string,
      options?: VideoStreamOptions
    ) => Promise<void | CreateVideoStreamViewResult>;
    onDisposeRemoteStreamView?: (userId: string) => Promise<void>;
    isAvailable?: boolean;
    isReceiving?: boolean;
    streamId?: number;
    isScreenSharingOn?: boolean; // TODO: Remove this once onDisposeRemoteStreamView no longer disposes of screen share stream
    renderElement?: HTMLElement;
    remoteVideoViewOptions?: VideoStreamOptions;
    onRenderAvatar?: OnRenderAvatarCallback;
    showMuteIndicator?: boolean;
    showLabel?: boolean;
    alwaysShowLabelBackground?: boolean;
    personaMinSize?: number;
    strings: VideoGalleryStrings;
    participantState?: ParticipantState;
    menuKind?: 'contextual' | 'drawer';
    drawerMenuHostId?: string;
    onPinParticipant?: (userId: string) => void;
    onUnpinParticipant?: (userId: string) => void;
    onUpdateScalingMode?: (userId: string, scalingMode: ViewScalingMode) => void;
    isPinned?: boolean;
    spotlightedParticipantUserIds?: string[];
    isSpotlighted?: boolean;
    onStartSpotlight?: (userIds: string[]) => void;
    onStopSpotlight?: (userIds: string[]) => void;
    maxParticipantsToSpotlight?: number;
    /* @conditional-compile-remove(soft-mute) */ onMuteParticipant?: (userId: string) => void;
    disablePinMenuItem?: boolean;
    toggleAnnouncerString?: (announcerString: string) => void;
    reactionResources?: ReactionResources;
    onLongTouch?: (() => void) | undefined;
  }) => {
    const {
      isAvailable,
      isReceiving = true, // default to true to prevent any breaking change
      isScreenSharingOn,
      onCreateRemoteStreamView,
      onDisposeRemoteStreamView,
      remoteVideoViewOptions,
      renderElement,
      userId,
      onRenderAvatar,
      showMuteIndicator,
      remoteParticipant,
      participantState,
      menuKind,
      isPinned,
      onPinParticipant,
      onUnpinParticipant,
      spotlightedParticipantUserIds,
      isSpotlighted,
      onStartSpotlight,
      onStopSpotlight,
      maxParticipantsToSpotlight,
      /* @conditional-compile-remove(soft-mute) */ onMuteParticipant,
      onUpdateScalingMode,
      disablePinMenuItem,
      toggleAnnouncerString,
      strings,
      reactionResources,
      streamId
    } = props;

    const remoteVideoStreamProps: RemoteVideoStreamLifecycleMaintainerProps = useMemo(
      () => ({
        isMirrored: remoteVideoViewOptions?.isMirrored,
        isScreenSharingOn,
        isStreamAvailable: isAvailable,
        isStreamReceiving: isReceiving,
        onCreateRemoteStreamView,
        onDisposeRemoteStreamView,
        remoteParticipantId: userId,
        renderElementExists: !!renderElement,
        scalingMode: remoteVideoViewOptions?.scalingMode,
        streamId
      }),
      [
        isAvailable,
        isReceiving,
        isScreenSharingOn,
        onCreateRemoteStreamView,
        onDisposeRemoteStreamView,
        remoteVideoViewOptions?.isMirrored,
        remoteVideoViewOptions?.scalingMode,
        renderElement,
        userId,
        streamId
      ]
    );

    // Handle creating, destroying and updating the video stream as necessary
    const createVideoStreamResult = useRemoteVideoStreamLifecycleMaintainer(remoteVideoStreamProps);
    const contextualMenuProps = useVideoTileContextualMenuProps({
      participant: remoteParticipant,
      view: createVideoStreamResult?.view,
      strings: { ...props.strings },
      isPinned,
      onPinParticipant,
      onUnpinParticipant,
      onUpdateScalingMode,
      disablePinMenuItem,
      toggleAnnouncerString,
      spotlightedParticipantUserIds,
      isSpotlighted,
      onStartSpotlight,
      onStopSpotlight,
      maxParticipantsToSpotlight,
      /* @conditional-compile-remove(soft-mute) */ onMuteParticipant
    });

    const videoTileContextualMenuProps = useMemo(() => {
      if (menuKind !== 'contextual' || !contextualMenuProps) {
        return {};
      }
      return {
        contextualMenu: contextualMenuProps
      };
    }, [contextualMenuProps, menuKind]);

    const showLoadingIndicator = isAvailable && isReceiving === false && participantState !== 'Disconnected';

    const [drawerMenuItemProps, setDrawerMenuItemProps] = React.useState<_DrawerMenuItemProps[]>([]);

    const renderVideoStreamElement = useMemo(() => {
      // Checking if renderElement is well defined or not as calling SDK has a number of video streams limitation which
      // implies that, after their threshold, all streams have no child (blank video)
      if (!renderElement || !renderElement.childElementCount) {
        // Returning `undefined` results in the placeholder with avatar being shown
        return undefined;
      }

      return (
        <StreamMedia videoStreamElement={renderElement} loadingState={showLoadingIndicator ? 'loading' : 'none'} />
      );
    }, [renderElement, showLoadingIndicator]);

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

    let displayName = remoteParticipant.displayName || strings.displayNamePlaceholder;
    const attendeeRoleString = props.strings?.attendeeRole;

    const formatDisplayName = (): string => {
      if (displayName && attendeeRoleString) {
        return _formatString(displayName, { AttendeeRole: attendeeRoleString });
      }
      return displayName;
    };

    const formatInitialsName = (): string | undefined => {
      if (remoteParticipant.displayName && attendeeRoleString) {
        return _formatString(remoteParticipant.displayName, { AttendeeRole: attendeeRoleString });
      }
      return remoteParticipant.displayName;
    };

    const reactionOverlay = reactionResources && (
      <MeetingReactionOverlay
        overlayMode="grid-tiles"
        reaction={remoteParticipant.reaction}
        reactionResources={reactionResources}
      />
    );

    displayName = formatDisplayName();
    return (
      <Stack
        tabIndex={menuKind === 'drawer' ? 0 : undefined}
        onKeyDown={menuKind === 'drawer' ? onKeyDown : undefined}
        style={remoteVideoTileWrapperStyle}
      >
        <VideoTile
          key={userId}
          userId={userId}
          initialsName={formatInitialsName() ?? ''}
          renderElement={renderVideoStreamElement}
          displayName={displayName}
          onRenderPlaceholder={onRenderAvatar}
          isMuted={remoteParticipant.isMuted}
          raisedHand={remoteParticipant.raisedHand}
          isSpeaking={remoteParticipant.isSpeaking}
          showMuteIndicator={showMuteIndicator}
          personaMinSize={props.personaMinSize}
          showLabel={props.showLabel}
          alwaysShowLabelBackground={props.alwaysShowLabelBackground}
          /* @conditional-compile-remove(one-to-n-calling) */
          /* @conditional-compile-remove(PSTN-calls) */
          participantState={participantState}
          {...videoTileContextualMenuProps}
          isPinned={props.isPinned}
          onLongTouch={
            props.onLongTouch
              ? props.onLongTouch
              : () =>
                  setDrawerMenuItemProps(
                    convertContextualMenuItemsToDrawerMenuItemProps(contextualMenuProps, () =>
                      setDrawerMenuItemProps([])
                    )
                  )
          }
          isSpotlighted={isSpotlighted}
          overlay={reactionOverlay}
        />
        {drawerMenuItemProps.length > 0 && (
          <Layer hostId={props.drawerMenuHostId}>
            <Stack styles={drawerMenuWrapperStyles}>
              <_DrawerMenu
                onLightDismiss={() => setDrawerMenuItemProps([])}
                items={drawerMenuItemProps}
                heading={displayName}
              />
            </Stack>
          </Layer>
        )}
      </Stack>
    );
  }
);

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
