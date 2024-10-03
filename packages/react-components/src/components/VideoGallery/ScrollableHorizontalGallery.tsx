// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStyle, Stack, mergeStyles } from '@fluentui/react';
import React, { useEffect, useRef } from 'react';
import { useDraggable } from 'react-use-draggable-scroll';
import {
  scrollableHorizontalGalleryContainerStyles,
  scrollableHorizontalGalleryStyles
} from './styles/ScrollableHorizontalGallery.style';

/**
 * Component to display elements horizontally in a scrollable container
 * @private
 */
export const ScrollableHorizontalGallery = (props: {
  horizontalGalleryElements?: JSX.Element[];
  onFetchTilesToRender?: (indexes: number[]) => void;
  containerStyles?: IStyle;
}): JSX.Element => {
  const { horizontalGalleryElements, onFetchTilesToRender, containerStyles } = props;

  useEffect(() => {
    const indexesArray = [...Array(horizontalGalleryElements?.length).keys()];
    if (onFetchTilesToRender && indexesArray) {
      onFetchTilesToRender(indexesArray ?? []);
    }
  }, [onFetchTilesToRender, horizontalGalleryElements?.length]);

  const ref = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const { events: dragabbleEvents } = useDraggable(ref);

  return (
    <div
      ref={ref}
      {...dragabbleEvents}
      className={mergeStyles(scrollableHorizontalGalleryContainerStyles, containerStyles)}
    >
      <Stack
        data-ui-id="scrollable-horizontal-gallery"
        horizontal={true}
        styles={scrollableHorizontalGalleryStyles}
        tokens={{ childrenGap: '0.5rem' }}
      >
        {horizontalGalleryElements}
      </Stack>
    </div>
  );
};
