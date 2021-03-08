// © Microsoft Corporation. All rights reserved.

import { ErrorHandlingProps } from '../providers/ErrorProvider';
import React, { useEffect, useRef } from 'react';
import { invertedVideoStyle, mediaContainer } from './styles/StreamMedia.styles';
import { WithErrorHandling } from '../utils/WithErrorHandling';

export interface StreamMediaProps {
  videoStreamElement: HTMLElement | null;
  invertVideo?: boolean;
}

const StreamMediaComponent = (props: StreamMediaProps & ErrorHandlingProps): JSX.Element => {
  const containerEl = useRef<HTMLDivElement>(null);
  const { invertVideo, videoStreamElement } = props;

  useEffect(() => {
    const container = containerEl.current;
    if (container && container.childElementCount === 0 && videoStreamElement) {
      container.appendChild(videoStreamElement);
    }
  }, [videoStreamElement]);

  return <div className={invertVideo ? invertedVideoStyle : mediaContainer} ref={containerEl} />;
};

export const StreamMedia = (props: StreamMediaProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(StreamMediaComponent, props);
