// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { CreateVideoStreamViewResult, OnRenderAvatarCallback, ParticipantState, VideoStreamOptions } from '../types';
import { StreamMedia } from './StreamMedia';
import {
  useRemoteVideoStreamLifecycleMaintainer,
  RemoteVideoStreamLifecycleMaintainerProps
} from './VideoGallery/useVideoStreamLifecycleMaintainer';
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
    onCreateRemoteStreamView?: (
      userId: string,
      options?: VideoStreamOptions
    ) => Promise<void | CreateVideoStreamViewResult>;
    onDisposeRemoteStreamView?: (userId: string) => Promise<void>;
    isAvailable?: boolean;
    isReceiving?: boolean;
    isMuted?: boolean;
    isSpeaking?: boolean;
    isScreenSharingOn?: boolean; // TODO: Remove this once onDisposeRemoteStreamView no longer disposes of screen share stream
    renderElement?: HTMLElement;
    displayName?: string;
    remoteVideoViewOptions?: VideoStreamOptions;
    onRenderAvatar?: OnRenderAvatarCallback;
    showMuteIndicator?: boolean;
    showLabel?: boolean;
    personaMinSize?: number;
    participantState?: ParticipantState;
  }) => {
    const {
      isAvailable,
      isReceiving = true, // default to true to prevent any breaking change
      isMuted,
      isSpeaking,
      isScreenSharingOn,
      onCreateRemoteStreamView,
      onDisposeRemoteStreamView,
      remoteVideoViewOptions,
      renderElement,
      userId,
      displayName,
      onRenderAvatar,
      showMuteIndicator
    } = props;

    // Initialize the scaling mode with the value from the props. Default is 'Crop'
    const [scalingMode, setScalingMode] = React.useState<VideoStreamOptions['scalingMode']>(
      remoteVideoViewOptions?.scalingMode ?? 'Crop'
    );

    // Called when Video Tile contextual menu item `Fill Frame` is clicked
    const fillFrame = useMemo(() => {
      setScalingMode('Crop');
    }, [scalingMode]);

    // Called when Video Tile contextual menu item `Fit to Frame` is clicked
    const fitToFrame = useMemo(() => {
      setScalingMode('Fit');
    }, [scalingMode]);

    // Use this attribute to display the contextual menu item text in Video Tile
    const fitOrFillText = useMemo(() => {
      // The strings here should come from localized video tile strings.
      return scalingMode === 'Crop' ? 'Fit to Frame' : 'Fill Frame';
    }, [scalingMode]);

    // Use this function to provide onClick behavior to the contextual menu item in Video Tile for fill/fit
    const toggleFitOrFill = useMemo(() => {
      return scalingMode === 'Crop' ? fitToFrame : fillFrame;
    }, [scalingMode]);

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
        scalingMode: scalingMode
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
    useRemoteVideoStreamLifecycleMaintainer(remoteVideoStreamProps);

    const showLoadingIndicator = isAvailable && isReceiving === false && props.participantState !== 'Disconnected';

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

    return (
      <VideoTile
        key={userId}
        userId={userId}
        renderElement={renderVideoStreamElement}
        displayName={displayName}
        onRenderPlaceholder={onRenderAvatar}
        isMuted={isMuted}
        isSpeaking={isSpeaking}
        showMuteIndicator={showMuteIndicator}
        personaMinSize={props.personaMinSize}
        showLabel={props.showLabel}
        /* @conditional-compile-remove(one-to-n-calling) */
        /* @conditional-compile-remove(PSTN-calls) */
        participantState={props.participantState}
      />
    );
  }
);
