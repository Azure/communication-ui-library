// © Microsoft Corporation. All rights reserved.

import { ErrorHandlingProps } from '../providers/ErrorProvider';
import React, { useEffect, useRef } from 'react';
import { invertedVideoStyle, mediaContainer } from './styles/StreamMedia.styles';

export interface StreamMediaComponentProps {
  videoStreamElement: HTMLElement | null;
  invertVideo?: boolean;
}

export const StreamMediaComponent = (props: StreamMediaComponentProps & ErrorHandlingProps): JSX.Element => {
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
