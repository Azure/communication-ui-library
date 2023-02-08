// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IContextualMenuProps, Layer, Stack } from '@fluentui/react';
import React, { useMemo } from 'react';
/* @conditional-compile-remove(pinned-participants) */
import { KeyboardEvent, useCallback } from 'react';
import {
  CreateVideoStreamViewResult,
  OnRenderAvatarCallback,
  ParticipantState,
  VideoGalleryRemoteParticipant,
  VideoStreamOptions
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
    isScreenSharingOn?: boolean; // TODO: Remove this once onDisposeRemoteStreamView no longer disposes of screen share stream
    renderElement?: HTMLElement;
    remoteVideoViewOptions?: VideoStreamOptions;
    onRenderAvatar?: OnRenderAvatarCallback;
    showMuteIndicator?: boolean;
    showLabel?: boolean;
    personaMinSize?: number;
    strings?: VideoGalleryStrings;
    participantState?: ParticipantState;
    menuKind?: 'contextual' | 'drawer';
    drawerMenuHostId?: string;
    onPinParticipant?: (userId: string) => void;
    onUnpinParticipant?: (userId: string) => void;
    isPinned?: boolean;
    disablePinMenuItem?: boolean;
    toggleAnnouncerString?: (announcerString: string) => void;
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
      disablePinMenuItem,
      toggleAnnouncerString,
      strings
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
        scalingMode: remoteVideoViewOptions?.scalingMode
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
        userId
      ]
    );

    // Handle creating, destroying and updating the video stream as necessary
    const createVideoStreamResult = useRemoteVideoStreamLifecycleMaintainer(remoteVideoStreamProps);

    const contextualMenuProps = useVideoTileContextualMenuProps({
      remoteParticipant,
      view: createVideoStreamResult?.view,
      /* @conditional-compile-remove(pinned-participants) */
      strings: { ...props.strings },
      isPinned,
      onPinParticipant,
      onUnpinParticipant,
      disablePinMenuItem,
      toggleAnnouncerString
    });

    const videoTileContextualMenuProps = useMemo(() => {
      if (menuKind !== 'contextual') {
        return {};
      }
      return videoTileContextualMenuPropsTrampoline(contextualMenuProps);
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

    /* @conditional-compile-remove(pinned-participants) */
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

    return (
      <Stack
        /* @conditional-compile-remove(pinned-participants) */
        tabIndex={menuKind === 'drawer' ? 0 : undefined}
        /* @conditional-compile-remove(pinned-participants) */
        onKeyDown={menuKind === 'drawer' ? onKeyDown : undefined}
        style={remoteVideoTileWrapperStyle}
      >
        <VideoTile
          key={userId}
          userId={userId}
          initialsName={remoteParticipant.displayName ?? ''}
          renderElement={renderVideoStreamElement}
          displayName={remoteParticipant.displayName || strings?.displayNamePlaceholder}
          onRenderPlaceholder={onRenderAvatar}
          isMuted={remoteParticipant.isMuted}
          isSpeaking={remoteParticipant.isSpeaking}
          showMuteIndicator={showMuteIndicator}
          personaMinSize={props.personaMinSize}
          showLabel={props.showLabel}
          /* @conditional-compile-remove(one-to-n-calling) */
          /* @conditional-compile-remove(PSTN-calls) */
          participantState={participantState}
          {...videoTileContextualMenuProps}
          /* @conditional-compile-remove(pinned-participants) */
          isPinned={props.isPinned}
          /* @conditional-compile-remove(pinned-participants) */
          onLongTouch={() =>
            setDrawerMenuItemProps(
              convertContextualMenuItemsToDrawerMenuItemProps(contextualMenuProps, () => setDrawerMenuItemProps([]))
            )
          }
        />
        {drawerMenuItemProps.length > 0 && (
          <Layer hostId={props.drawerMenuHostId}>
            <Stack styles={drawerMenuWrapperStyles}>
              <_DrawerMenu
                onLightDismiss={() => setDrawerMenuItemProps([])}
                items={drawerMenuItemProps}
                heading={remoteParticipant.displayName}
              />
            </Stack>
          </Layer>
        )}
      </Stack>
    );
  }
);

const videoTileContextualMenuPropsTrampoline = (
  contextualMenuProps?: IContextualMenuProps
): { contextualMenu?: IContextualMenuProps } => {
  if (!contextualMenuProps) {
    return {};
  }
  /* @conditional-compile-remove(pinned-participants) */
  return {
    contextualMenu: contextualMenuProps
  };

  return {};
};

/* @conditional-compile-remove(pinned-participants) */
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
