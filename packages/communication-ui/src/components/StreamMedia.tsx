// © Microsoft Corporation. All rights reserved.

import React, { useEffect, useRef } from 'react';
import { mediaContainer } from './styles/MediaGalleryTile.styles';

export interface StreamMediaProps {
  videoStreamElement: HTMLElement | null;
}

export const StreamMediaComponent = (props: StreamMediaProps): JSX.Element => {
  const containerEl = useRef<HTMLDivElement>(null);
  const { videoStreamElement } = props;

  useEffect(() => {
    const container = containerEl.current;
    if (container && container.childElementCount === 0 && videoStreamElement) {
      container.appendChild(videoStreamElement);
    }
  }, [videoStreamElement]);

  return <div className={mediaContainer} ref={containerEl} />;
};
