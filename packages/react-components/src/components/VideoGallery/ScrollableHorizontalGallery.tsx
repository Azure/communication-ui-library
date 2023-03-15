// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
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
  setTilesToRender?: (indexes: number[]) => void;
}): JSX.Element => {
  const { horizontalGalleryElements, setTilesToRender } = props;

  const indexesArray = [...Array(horizontalGalleryElements?.length).keys()];

  useEffect(() => {
    if (setTilesToRender && indexesArray) {
      setTilesToRender(indexesArray);
    }
  }, [indexesArray, setTilesToRender]);

  const ref = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const { events: dragabbleEvents } = useDraggable(ref);

  return (
    <div ref={ref} {...dragabbleEvents} className={scrollableHorizontalGalleryContainerStyles}>
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
