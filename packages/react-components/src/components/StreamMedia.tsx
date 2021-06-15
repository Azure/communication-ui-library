// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useRef } from 'react';
import { invertedVideoStyle, mediaContainer } from './styles/StreamMedia.styles';
import { BaseCustomStylesProps } from '../types';
import { mergeStyles } from '@fluentui/react';

/**
 * Props for StreamMedia component
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
  styles?: BaseCustomStylesProps;
}

/**
 * StreamMedia component converts a HTMLElement to a JSX Element.
 * This component becomes very handy when you get the video stream HTMLElement from the calling sdk and want to render it in components like VideoTile.
 */
export const StreamMedia = (props: StreamMediaProps): JSX.Element => {
  const containerEl = useRef<HTMLDivElement>(null);
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
    <div className={mergeStyles(isMirrored ? invertedVideoStyle : mediaContainer, styles?.root)} ref={containerEl} />
  );
};
