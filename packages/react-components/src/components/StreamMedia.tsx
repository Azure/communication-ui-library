// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Spinner } from '@fluentui/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  invertedVideoInPipStyle,
  mediaContainer,
  container,
  loadingSpinnerContainer,
  loadSpinnerStyles,
  mediaParentContainer
} from './styles/StreamMedia.styles';
import { useTheme } from '../theming';
import { BaseCustomStyles } from '../types';
import { PanZoomWrapperComponent } from './PanZoomManager/PanZoomWrapperComponent';

/**
 * Whether the stream is loading or not.
 * @public
 */
export type LoadingState = 'loading' | 'none';

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
   * Support pan and zoom gestures with mouse, keyboard and touch
   * @defaultValue false
   */
  enablePanAndZoomGestures?: boolean;
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

  const streamContainer = useMemo(
    () => (
      <div className={mediaParentContainer()}>
        <div
          className={mergeStyles(
            isMirrored && pipEnabled ? invertedVideoInPipStyle(theme) : mediaContainer(theme),
            styles?.root
          )}
          ref={containerEl}
        />
      </div>
    ),
    [isMirrored, pipEnabled, styles?.root, theme]
  );

  return (
    <div className={container(theme)}>
      {!props.enablePanAndZoomGestures ? (
        <PanZoomWrapperComponent ariaLabel="" className={mergeStyles({ height: '100%', width: '100%' })}>
          {streamContainer}
        </PanZoomWrapperComponent>
      ) : (
        streamContainer
      )}
      {loadingState === 'loading' && (
        <div className={loadingSpinnerContainer()}>
          <Spinner data-ui-id="stream-media-loading-spinner" styles={loadSpinnerStyles} />
        </div>
      )}
    </div>
  );
};
