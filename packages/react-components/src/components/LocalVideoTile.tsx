// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { _formatString } from '@internal/acs-ui-common';
import React, { useEffect, useMemo } from 'react';
import { OnRenderAvatarCallback, VideoStreamOptions } from '../types';
import { LocalVideoCameraCycleButton, LocalVideoCameraCycleButtonProps } from './LocalVideoCameraButton';
import { StreamMedia } from './StreamMedia';
import { VideoTile, VideoTileStylesProps } from './VideoTile';

/**
 * A memoized version of VideoTile for rendering local participant.
 *
 * @private
 */
export const LocalVideoTile = React.memo(
  (props: {
    userId: string;
    onCreateLocalStreamView?: (options?: VideoStreamOptions) => Promise<void>;
    onDisposeLocalStreamView?: () => void;
    isAvailable?: boolean;
    isMuted?: boolean;
    renderElement?: HTMLElement;
    displayName?: string;
    initialsName?: string;
    localVideoViewOptions?: VideoStreamOptions;
    onRenderAvatar?: OnRenderAvatarCallback;
    showLabel: boolean;
    showMuteIndicator?: boolean;
    showCameraSwitcherInLocalPreview?: boolean;
    localVideoCameraCycleButtonProps?: LocalVideoCameraCycleButtonProps;
    localVideoCameraSwitcherLabel?: string;
    localVideoSelectedDescription?: string;
    styles?: VideoTileStylesProps;
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
      displayName,
      initialsName,
      onRenderAvatar,
      showMuteIndicator,
      styles,
      showCameraSwitcherInLocalPreview,
      localVideoCameraCycleButtonProps,
      localVideoCameraSwitcherLabel,
      localVideoSelectedDescription
    } = props;

    useEffect(() => {
      console.log('useEffect. isAvailable: ', isAvailable, ', renderElement: ', renderElement);
      if (isAvailable && !renderElement) {
        console.log(`${!!onCreateLocalStreamView} CREATING LOCAL STREAM VIEW in useeffect: `, localVideoViewOptions);
        onCreateLocalStreamView && onCreateLocalStreamView(localVideoViewOptions);
      }
      // Always clean up element to make tile up to date and be able to dispose correctly
      return () => {
        if (renderElement) {
          console.log('DISPOSING localVideoTile disposing in useeffect');
          onDisposeLocalStreamView && onDisposeLocalStreamView();
        }
      };
    }, [isAvailable, onCreateLocalStreamView, onDisposeLocalStreamView, localVideoViewOptions, renderElement]);

    // The execution order for above useEffect is onCreateRemoteStreamView =>(async time gap) RenderElement generated => element disposed => onDisposeRemoteStreamView
    // Element disposed could happen during async time gap, which still cause leaks for unused renderElement.
    // Need to do an entire cleanup when remoteTile gets disposed and make sure element gets correctly disposed
    useEffect(() => {
      return () => {
        console.log('SECONDARY DISPOSING');
        onDisposeLocalStreamView && onDisposeLocalStreamView();
      };
    }, [onDisposeLocalStreamView]);

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
          <StreamMedia videoStreamElement={renderElement} />
        </>
      );
    }, [
      localVideoCameraCycleButtonProps,
      localVideoCameraSwitcherLabel,
      localVideoSelectedDescription,
      renderElement,
      showCameraSwitcherInLocalPreview
    ]);

    return (
      <VideoTile
        key={userId}
        userId={userId}
        renderElement={renderVideoStreamElement}
        showLabel={showLabel}
        displayName={displayName}
        initialsName={initialsName}
        styles={styles}
        onRenderPlaceholder={onRenderAvatar}
        isMuted={isMuted}
        showMuteIndicator={showMuteIndicator}
      />
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
