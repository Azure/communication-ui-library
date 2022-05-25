// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useMemo, useRef } from 'react';
import { VideoStreamOptions, CreateVideoStreamViewResult, ViewScalingMode } from '../../types';
import { Cancellable, useCancellableTask } from '../utils/useCancellableTask';

interface VideoStreamLifecycleMaintainerExtendableProps {
  isStreamAvailable?: boolean;
  renderElementExists?: boolean;
  isMirrored?: boolean;
  scalingMode?: ViewScalingMode;
  isScreenSharingOn?: boolean;
}

interface VideoStreamLifecycleMaintainerProps extends VideoStreamLifecycleMaintainerExtendableProps {
  onCreateStreamView: (options?: VideoStreamOptions) => Promise<void | CreateVideoStreamViewResult> | undefined;
  onDisposeStreamView: () => void | undefined;
}

/**
 * Helper hook to maintain the video stream lifecycle. This calls onCreateStreamView and onDisposeStreamView
 * appropriately based on react lifecycle events and prop changes.
 * This also handles calls to view.update* appropriately such as view.updateScalingMode().
 */
const useVideoStreamLifecycleMaintainer = (props: VideoStreamLifecycleMaintainerProps): void => {
  const {
    isMirrored,
    isScreenSharingOn,
    isStreamAvailable,
    onCreateStreamView,
    onDisposeStreamView,
    renderElementExists,
    scalingMode
  } = props;

  // HANDLING CHANGES TO VIDEO VIEW OPTIONS
  //
  // When VideoViewOptions change two things may happen:
  //
  // 1. Just the scaling mode has changed and we have access to the original StreamRenderView
  //   - In this case we just need to call updateScalingMode on the view and do not need to recreate the stream view
  // 2. isMirrored has changed, or scalingMode change and we don't have access to the original StreamRenderView
  //   - In this case we need to dispose the old view and create a new one
  //
  // For scenario 1, we hold onto a ref to the scalingMode that persists across renders. When VideoViewOptions.scalingMode
  // differs from the persistent ref, we know to call updateScalingMode. We then subsequently update the ref to the new value for
  // future renders.
  //
  // For scenario 2, we extract the VideoViewOptions.isMirrored to ensure any change to the isMirrored prop triggers the useEffect
  // that recreates the stream view. We must also here add an extra check for when the scaling mode changes and we do not have
  // access to the original StreamView (and hence cannot call updateScalingMode). When this happens we must also trigger the useEffect
  // that recreates the stream view.

  const [streamRendererResult, setStreamRendererResult] = React.useState<CreateVideoStreamViewResult>();
  const scalingModeRef = useRef(scalingMode);
  const hasScalingModeChanged = scalingModeRef.current !== scalingMode;
  const updatingScalingModeDirectly = hasScalingModeChanged && !!streamRendererResult;

  const [triggerRescale, cancelRescale] = useCancellableTask();
  const [triggerCreateStreamView, cancelCreateStreamView] = useCancellableTask();

  if (isStreamAvailable && renderElementExists && scalingMode && updatingScalingModeDirectly) {
    triggerRescale(async (cancellable: Cancellable) => {
      streamRendererResult && (await streamRendererResult.view.updateScalingMode(scalingMode));
      if (cancellable.cancelled) {
        return;
      }
      scalingModeRef.current = scalingMode;
    });
  }

  // scalingModeForUseEffect will trigger the useEffect to recreate the stream view only if the scaling mode has changed and
  // we cannot call updateScalingMode on the view object directly. Otherwise it will be null to ensure the useEffect does not trigger
  // when scaling mode changes.
  const scalingModeForUseEffect = updatingScalingModeDirectly ? null : scalingMode;

  useEffect(() => {
    if (isStreamAvailable && !renderElementExists) {
      triggerCreateStreamView(async (cancellable: Cancellable): Promise<void> => {
        const streamViewOptions = {
          isMirrored: isMirrored,
          scalingMode: scalingModeForUseEffect === null ? scalingModeRef.current : scalingModeForUseEffect
        };

        const streamRendererResult = await onCreateStreamView?.(streamViewOptions);
        // Avoid race condition where onDisposeStreamView is called before onCreateStreamView
        // and setStreamRendererResult have completed
        if (cancellable.cancelled) {
          return;
        }
        streamRendererResult && setStreamRendererResult(streamRendererResult);
      });
    }
    // Always clean up element to make tile up to date and be able to dispose correctly
    return () => {
      if (renderElementExists) {
        cancelRescale();
        cancelCreateStreamView();
        // TODO: Remove `if isScreenSharingOn` when we isolate dispose behavior for screen share
        if (!isScreenSharingOn) {
          onDisposeStreamView?.();
        }
      }
    };
  }, [
    cancelCreateStreamView,
    cancelRescale,
    isMirrored,
    isScreenSharingOn,
    isStreamAvailable,
    onCreateStreamView,
    onDisposeStreamView,
    renderElementExists,
    scalingModeForUseEffect,
    triggerCreateStreamView
  ]);

  // The execution order for above useEffect is onCreateRemoteStreamView =>(async time gap) RenderElement generated => element disposed => onDisposeRemoteStreamView
  // Element disposed could happen during async time gap, which still cause leaks for unused renderElement.
  // Need to do an entire cleanup when remoteTile gets disposed and make sure element gets correctly disposed
  useEffect(() => {
    return () => {
      cancelRescale();
      cancelCreateStreamView();
      // TODO: Remove `if isScreenSharingOn` when we isolate dispose behavior for screen share
      if (!isScreenSharingOn) {
        onDisposeStreamView?.();
      }
    };
  }, [cancelCreateStreamView, cancelRescale, isScreenSharingOn, onDisposeStreamView]);
};

/** @private */
export interface LocalVideoStreamLifecycleMaintainerProps extends VideoStreamLifecycleMaintainerExtendableProps {
  onCreateLocalStreamView?: (options?: VideoStreamOptions) => Promise<void | CreateVideoStreamViewResult>;
  onDisposeLocalStreamView?: () => void;
}

/**
 * Extension of {@link useVideoStreamLifecycleMaintainer} specifically for local video streams
 *
 * @private
 */
export const useLocalVideoStreamLifecycleMaintainer = (props: LocalVideoStreamLifecycleMaintainerProps): void => {
  const { onCreateLocalStreamView, onDisposeLocalStreamView } = props;
  const onCreateStreamView = useMemo(
    () => (options?: VideoStreamOptions) => {
      return onCreateLocalStreamView?.(options);
    },
    [onCreateLocalStreamView]
  );
  const onDisposeStreamView = useMemo(
    () => () => {
      onDisposeLocalStreamView?.();
    },
    [onDisposeLocalStreamView]
  );
  return useVideoStreamLifecycleMaintainer({
    ...props,
    onCreateStreamView,
    onDisposeStreamView
  });
};

/** @private */
export interface RemoteVideoStreamLifecycleMaintainerProps extends VideoStreamLifecycleMaintainerExtendableProps {
  onCreateRemoteStreamView?: (
    userId: string,
    options?: VideoStreamOptions
  ) => Promise<void | CreateVideoStreamViewResult>;
  onDisposeRemoteStreamView?: (userId: string) => Promise<void>;
  remoteParticipantId: string;
}

/**
 * Extension of {@link useVideoStreamLifecycleMaintainer} specifically for remote video streams
 *
 * @private
 */
export const useRemoteVideoStreamLifecycleMaintainer = (props: RemoteVideoStreamLifecycleMaintainerProps): void => {
  const { remoteParticipantId, onCreateRemoteStreamView, onDisposeRemoteStreamView } = props;
  const onCreateStreamView = useMemo(
    () => (options?: VideoStreamOptions) => {
      return onCreateRemoteStreamView?.(remoteParticipantId, options);
    },
    [onCreateRemoteStreamView, remoteParticipantId]
  );
  const onDisposeStreamView = useMemo(
    () => () => {
      onDisposeRemoteStreamView?.(remoteParticipantId);
    },
    [onDisposeRemoteStreamView, remoteParticipantId]
  );

  return useVideoStreamLifecycleMaintainer({
    ...props,
    onCreateStreamView,
    onDisposeStreamView
  });
};
