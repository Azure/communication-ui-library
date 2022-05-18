// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { MutableRefObject, useEffect, useRef } from 'react';
import { VideoStreamOptions, CreateVideoStreamViewResult, ScalingMode } from '../../types';

/**
 * Helper hook to maintain the video stream lifecycle. This calls onCreateStreamView and onDisposeStreamView
 * appropriately based on react lifecycle events and prop changes.
 * This also handles calls to view.update* appropriately such as view.updateScalingMode().
 *
 * @private
 */
export const useVideoStreamLifecycleMaintainer = (props: {
  isStreamAvailable?: boolean;
  renderElementExists?: boolean;
  isMirrored?: boolean;
  scalingMode?: ScalingMode;
  onCreateStreamView?: (options?: VideoStreamOptions) => Promise<void | CreateVideoStreamViewResult>;
  onDisposeStreamView?: () => void;
}): void => {
  const { onCreateStreamView, onDisposeStreamView, isStreamAvailable, renderElementExists, isMirrored, scalingMode } =
    props;

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

  const rescaleCanceller = useRef(new CancelMarkerStore());
  const createStreamViewCanceller = useRef(new CancelMarkerStore());

  if (isStreamAvailable && renderElementExists && scalingMode && updatingScalingModeDirectly) {
    const cancelMarker = rescaleCanceller.current.createNewMarker();
    (async () => {
      streamRendererResult && (await streamRendererResult.view.updateScalingMode(scalingMode));
      if (cancelMarker.set) {
        return;
      }
      scalingModeRef.current = scalingMode;
    })();
  }

  // scalingModeForUseEffect will trigger the useEffect to recreate the stream view only if the scaling mode has changed and
  // we cannot call updateScalingMode on the view object directly. Otherwise it will be null to ensure the useEffect does not trigger
  // when scaling mode changes.
  const scalingModeForUseEffect = updatingScalingModeDirectly ? null : scalingMode;

  useEffect(() => {
    if (isStreamAvailable && !renderElementExists) {
      // Avoid race condition where onDisposeStreamView is called before onCreateStreamView
      // and setStreamRendererResult have completed
      const cancelMarker = createStreamViewCanceller.current.createNewMarker();

      (async (): Promise<void> => {
        const streamRendererResult = await onCreateStreamView?.({
          isMirrored: isMirrored,
          scalingMode: scalingModeForUseEffect === null ? scalingModeRef.current : scalingModeForUseEffect
        });

        if (cancelMarker.set) {
          return;
        }
        streamRendererResult && setStreamRendererResult(streamRendererResult);
      })();
    }
    // Always clean up element to make tile up to date and be able to dispose correctly
    return () => {
      if (renderElementExists) {
        rescaleCanceller.current.cancel();
        createStreamViewCanceller.current.cancel();
        onDisposeStreamView?.();
      }
    };
  }, [
    isStreamAvailable,
    isMirrored,
    onCreateStreamView,
    onDisposeStreamView,
    renderElementExists,
    scalingModeForUseEffect
  ]);

  // The execution order for above useEffect is onCreateRemoteStreamView =>(async time gap) RenderElement generated => element disposed => onDisposeRemoteStreamView
  // Element disposed could happen during async time gap, which still cause leaks for unused renderElement.
  // Need to do an entire cleanup when remoteTile gets disposed and make sure element gets correctly disposed
  useEffect(() => {
    return () => {
      rescaleCanceller.current.cancel();
      createStreamViewCanceller.current.cancel();
      onDisposeStreamView?.();
    };
  }, [onDisposeStreamView]);
};

interface CancelMarker {
  set: boolean;
}

class CancelMarkerStore {
  private marker: CancelMarker | null = null;
  public cancel() {
    if (this.marker) {
      this.marker.set = true;
      this.marker = null;
    }
  }
  public createNewMarker(): CancelMarker {
    this.cancel();
    const marker = { set: false };
    this.marker = marker;
    return marker;
  }
}
