// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { VideoStreamOptions, CreateVideoStreamViewResult, ViewScalingMode } from '../../types';
import { callingComponentLogger } from '../utils/Logger';

/** @private */
export interface VideoStreamLifecycleMaintainerExtendableProps {
  isStreamAvailable?: boolean;
  renderElementExists?: boolean;
  isMirrored?: boolean;
  scalingMode?: ViewScalingMode;
  isScreenSharingOn?: boolean;
  streamId?: number;
  isVideoPermitted?: boolean;
}

interface VideoStreamLifecycleMaintainerProps extends VideoStreamLifecycleMaintainerExtendableProps {
  onCreateStreamView: (options?: VideoStreamOptions) => Promise<void | CreateVideoStreamViewResult> | undefined;
  onDisposeStreamView: () => void | undefined;
}

/**
 * Helper hook to maintain the video stream lifecycle. This calls onCreateStreamView and onDisposeStreamView
 * appropriately based on react lifecycle events and prop changes.
 *
 * @remarks
 *
 * Notes on handling changes to scaling mode:
 *
 * Ideally we have access to the original StreamRenderView and can call view.updateScalingMode() and do not need to recreate the stream view.
 * However, to support backwards compat we cannot guarantee this. If we don't have access to the original StreamRenderView we need to dispose
 * the old view and create a new one.
 *
 * Supporting both of these scenarios became too complex and fragile. When we introduce a breaking change this should be update to ensure that
 * onCreateStreamView _must_ return a view object with updateScalingMode and update logic in this hook to call view.updateScalingMode instead
 * of recreating the stream.
 *
 * @private
 */
const useVideoStreamLifecycleMaintainer = (
  props: VideoStreamLifecycleMaintainerProps
): CreateVideoStreamViewResult | undefined => {
  const {
    isMirrored,
    isScreenSharingOn,
    isStreamAvailable,
    onCreateStreamView,
    onDisposeStreamView,
    renderElementExists,
    scalingMode,
    streamId,
    isVideoPermitted
  } = props;

  const [videoStreamViewResult, setVideoStreamViewResult] = useState<CreateVideoStreamViewResult | undefined>();

  useEffect(() => {
    if (isVideoPermitted !== false && isStreamAvailable && !renderElementExists) {
      onCreateStreamView?.({ isMirrored, scalingMode })?.then((result) => {
        result && setVideoStreamViewResult(result);
      });
    }

    // Always clean up element to make tile up to date and be able to dispose correctly
    return () => {
      if (renderElementExists) {
        // TODO: Remove `if isScreenSharingOn` when we isolate dispose behavior for screen share
        if (!isScreenSharingOn) {
          onDisposeStreamView?.();
        }
      } else {
        callingComponentLogger.warning('Stream view element does not exist when disposing stream view');
      }
    };
  }, [
    isMirrored,
    isScreenSharingOn,
    isStreamAvailable,
    onCreateStreamView,
    onDisposeStreamView,
    renderElementExists,
    scalingMode,
    streamId,
    isVideoPermitted
  ]);

  // The execution order for above useEffect is onCreateRemoteStreamView =>(async time gap) RenderElement generated => element disposed => onDisposeRemoteStreamView
  // Element disposed could happen during async time gap, which still cause leaks for unused renderElement.
  // Need to do an entire cleanup when remoteTile gets disposed and make sure element gets correctly disposed
  useEffect(() => {
    return () => {
      // TODO: Remove `if isScreenSharingOn` when we isolate dispose behavior for screen share
      if (!isScreenSharingOn) {
        onDisposeStreamView?.();
      }
    };
  }, [isScreenSharingOn, onDisposeStreamView]);

  return videoStreamViewResult;
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
export const useLocalVideoStreamLifecycleMaintainer = (
  props: LocalVideoStreamLifecycleMaintainerProps
): CreateVideoStreamViewResult | undefined => {
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
export const useRemoteVideoStreamLifecycleMaintainer = (
  props: RemoteVideoStreamLifecycleMaintainerProps
): CreateVideoStreamViewResult | undefined => {
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
