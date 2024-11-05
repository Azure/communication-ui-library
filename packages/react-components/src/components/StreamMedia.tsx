// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles, Spinner } from '@fluentui/react';
/* @conditional-compile-remove(remote-ufd) */
import { Stack } from '@fluentui/react';
import React, { useEffect, useRef, useState } from 'react';
import {
  invertedVideoInPipStyle,
  mediaContainer,
  container,
  loadingSpinnerContainer,
  loadSpinnerStyles
} from './styles/StreamMedia.styles';
/* @conditional-compile-remove(remote-ufd) */
import { reconnectingContainer, reconnectSpinnerStyles } from './styles/StreamMedia.styles';
/* @conditional-compile-remove(remote-ufd) */
import { useLocale } from '../localization';
import { useTheme } from '../theming';
import { BaseCustomStyles } from '../types';

/**
 * Whether the stream is loading or not.
 * @public
 */
export type LoadingState = 'loading' | 'none' | 'reconnecting';

/**
 * Props for {@link StreamMedia}.
 *
 * @public
 */
export interface StreamMediaProps {
  /** Video stream element to render. */
  videoStreamElement: HTMLElement | null;
  /** Decides whether to mirror the video or not. */
  isMirrored?: boolean;
  /** Whether the stream is loading data */
  loadingState?: LoadingState;
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
  /* @conditional-compile-remove(remote-ufd) */
  const reconnectingText = useLocale().strings.videoTile.participantReconnecting || 'Reconnecting...';

  const { isMirrored, videoStreamElement, styles, loadingState = 'none' } = props;
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
        data-ui-id="stream-media-container"
        className={mergeStyles(
          isMirrored && pipEnabled ? invertedVideoInPipStyle(theme) : mediaContainer(theme),
          styles?.root
        )}
        ref={containerEl}
      />
      {loadingState === 'loading' && (
        <div className={loadingSpinnerContainer()}>
          <Spinner data-ui-id="stream-media-loading-spinner" styles={loadSpinnerStyles} />
        </div>
      )}
      {
        /* @conditional-compile-remove(remote-ufd) */
        loadingState === 'reconnecting' && (
          <Stack className={reconnectingContainer()}>
            <Spinner
              data-ui-id="stream-media-loading-spinner"
              styles={reconnectSpinnerStyles()}
              label={reconnectingText}
            />
          </Stack>
        )
      }
    </div>
  );
};
