// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';
import React, { useEffect, useRef } from 'react';
import { invertedVideoStyle, mediaContainer } from './styles/StreamMedia.styles';
import { useTheme } from '../theming';
import { BaseCustomStyles } from '../types';

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

  const { isMirrored, videoStreamElement, styles } = props;

  useEffect(() => {
    const container = containerEl.current;
    if (!container) {
      return;
    }

    // If videoStreamElement changes, we clear the container to make sure we don't have duplicate, and replace it with
    // the new videoStreamElement. If videoStreamElement is undefined nothing is appended and container should be empty
    // and we don't render anyting.
    container.innerHTML = '';
    if (videoStreamElement) {
      container.appendChild(videoStreamElement);
    }

    return () => {
      container.innerHTML = '';
    };
  }, [videoStreamElement]);

  return (
    <div
      className={mergeStyles(isMirrored ? invertedVideoStyle(theme) : mediaContainer(theme), styles?.root)}
      ref={containerEl}
    />
  );
};
