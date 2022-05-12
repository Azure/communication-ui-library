// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { _formatString } from '@internal/acs-ui-common';
import React, { useEffect, useMemo, useRef } from 'react';
import { OnRenderAvatarCallback, VideoStreamOptions, CreateVideoStreamViewResult } from '../types';
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

    const [localStreamRendererResult, setLocalStreamRendererResult] = React.useState<CreateVideoStreamViewResult>();

    // When localVideoViewOptions change two things may happen:
    //
    // 1. Just the scaling mode has changed and we have access to the original LocalStreamRenderView
    //   - In this case we just need to call updateScalingMode on the view and do not need to recreate the stream view
    // 2. isMirrored has changed, or scalingMode change and we don't have access to the original LocalStreamRenderView
    //   - In this case we need to dispose the old view and create a new one
    //
    // For scenario 1, we hold onto a ref to the scalingMode that persists across renders. When localVideoViewOptions.scalingMode
    // differs from the persistent ref, we know to call updateScalingMode. We then subsequently update the ref to the new value for
    // future renders.
    //
    // For scenario 2, we extract the localVideoViewOptions.isMirrored to ensure any change to the isMirrorred prop triggers the useEffect
    // that recreates the local stream view. We must also here add an extra check for when the scaling mode changes and we do not have
    // access to the original LocalStreamView (and hence cannot call updateScalingMode). When this happens we must also trigger the useEffect
    // that recreates the local stream view.

    const scalingModeRef = useRef(localVideoViewOptions?.scalingMode);
    const newIsMirrored = localVideoViewOptions?.isMirrored;
    const newScalingMode = localVideoViewOptions?.scalingMode;
    const hasScalingModeChanged = scalingModeRef.current !== newScalingMode;
    const updatingScalingModeDirectly = hasScalingModeChanged && !!localStreamRendererResult;

    if (isAvailable && renderElement && newScalingMode && updatingScalingModeDirectly) {
      localStreamRendererResult && localStreamRendererResult.view.updateScalingMode(newScalingMode);
      scalingModeRef.current = localVideoViewOptions?.scalingMode;
    }

    // scalingModeForUseEffect will trigger the useEffect to recreate the local stream view only if the scaling mode has changed and
    // we cannot call updateScalingMode on the view object directly. Otherwise it will be null to ensure the useEffect does not trigger
    // when scaling mode changes.
    const scalingModeForUseEffect = updatingScalingModeDirectly ? null : newScalingMode;

    useEffect(() => {
      // Avoid race condition where onDisposeLocalStreamView is called before onCreateLocalStreamView
      // and setLocalStreamRendererResult have completed
      let wasLocalStreamDisposed = false;

      if (isAvailable && !renderElement) {
        (async (): Promise<void> => {
          console.log('calling onCreateLocalStreamView');
          const streamRendererResult = await onCreateLocalStreamView?.({
            isMirrored: newIsMirrored,
            scalingMode: scalingModeForUseEffect === null ? scalingModeRef.current : scalingModeForUseEffect
          });

          console.log(
            `completed onCreateLocalStreamView, wasLocalStreamDisposed: ${wasLocalStreamDisposed} streamRendererResult: `,
            streamRendererResult
          );
          if (!wasLocalStreamDisposed) {
            streamRendererResult && setLocalStreamRendererResult(streamRendererResult);
          }
        })();
      }
      // Always clean up element to make tile up to date and be able to dispose correctly
      return () => {
        if (renderElement) {
          wasLocalStreamDisposed = true;
          onDisposeLocalStreamView?.();
        }
      };
    }, [
      isAvailable,
      onCreateLocalStreamView,
      onDisposeLocalStreamView,
      localVideoViewOptions,
      renderElement,
      localStreamRendererResult,
      newIsMirrored,
      scalingModeForUseEffect
    ]);

    // The execution order for above useEffect is onCreateRemoteStreamView =>(async time gap) RenderElement generated => element disposed => onDisposeRemoteStreamView
    // Element disposed could happen during async time gap, which still cause leaks for unused renderElement.
    // Need to do an entire cleanup when remoteTile gets disposed and make sure element gets correctly disposed
    useEffect(() => {
      return () => {
        onDisposeLocalStreamView?.();
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
