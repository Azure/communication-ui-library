// © Microsoft Corporation. All rights reserved.

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
  /** Decides whether invert the video or not. */
  invertVideo?: boolean;
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
  const { invertVideo, videoStreamElement, styles } = props;

  useEffect(() => {
    const container = containerEl.current;
    if (container && container.childElementCount === 0 && videoStreamElement) {
      container.appendChild(videoStreamElement);
    }
  }, [videoStreamElement]);

  return (
    <div className={mergeStyles(invertVideo ? invertedVideoStyle : mediaContainer, styles?.root)} ref={containerEl} />
  );
};
