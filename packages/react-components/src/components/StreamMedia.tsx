// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Spinner } from '@fluentui/react';
import React, { useEffect, useRef, useState } from 'react';
import {
  invertedVideoInPipStyle,
  mediaContainer,
  container,
  loadingSpinnerContainer
} from './styles/StreamMedia.styles';
import { useTheme } from '../theming';
import { BaseCustomStyles } from '../types';
// eslint-disable-next-line no-restricted-imports
import { VideoRenderingControlOptions } from '../../../react-composites/src/composites/CallComposite/types/VideoRenderingControlOptions';

/**
 * Props for {@link StreamMedia}.
 *
 * @public
 */
export interface StreamMediaProps {
  videoRenderingControls: VideoRenderingControlOptions;
  /** Video stream element to render. */
  videoStreamElement: HTMLElement | null;
  /** Decides whether to mirror the video or not. */
  isMirrored?: boolean;
  /** Weather the remote stream is receiving data */
  isReceiving?: boolean;
  /** Weather it is a remote video stream */
  isRemoteVideoStream?: boolean;
  /**
   * Allows users to pass in an object contains custom CSS styles.
   * @Example
   * ```
   * <StreamMedia styles={{ root: { background: 'blue' } }} />
   * ```
   */
  styles?: BaseCustomStyles;
}

/**
 * Utility component to convert an HTMLElement with a video stream into a JSX element.
 *
 * Use to convert an HTMLElement returned by headless calling API into a component that can be rendered as a {@link VideoTile}.
 *
 * @public
 */
export const StreamMedia = (props: StreamMediaProps): JSX.Element => {
  const containerEl = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const { isMirrored, videoStreamElement, styles, isReceiving, isRemoteVideoStream, videoRenderingControls } = props;
  const [pipEnabled, setPipEnabled] = useState(false);

  useEffect(() => {
    const container = containerEl.current;
    if (!container) {
      return;
    }

    // If videoStreamElement changes, we clear the container to make sure we don't have duplicate, and replace it with
    // the new videoStreamElement. If videoStreamElement is undefined nothing is appended and container should be empty
    // and we don't render anyting.
    container.innerHTML = '';
    setPipEnabled(false);
    if (videoStreamElement) {
      videoStreamElement.addEventListener('enterpictureinpicture', () => {
        setPipEnabled(true);
      });
      videoStreamElement.addEventListener('leavepictureinpicture', () => {
        setPipEnabled(false);
      });
      container.appendChild(videoStreamElement);
    }

    return () => {
      container.innerHTML = '';
      setPipEnabled(false);
    };
  }, [videoStreamElement]);

  return (
    <div className={container()}>
      <div
        className={mergeStyles(
          isMirrored && pipEnabled ? invertedVideoInPipStyle(theme) : mediaContainer(theme),
          styles?.root
        )}
        ref={containerEl}
      />
      {isRemoteVideoStream && videoRenderingControls?.remoteVideoStreamLoadingSpinner && !isReceiving && (
        <div className={loadingSpinnerContainer()}>
          <Spinner styles={{ circle: { height: '5rem', width: '5rem', borderWidth: '0.25em' } }} />
        </div>
      )}
    </div>
  );
};
