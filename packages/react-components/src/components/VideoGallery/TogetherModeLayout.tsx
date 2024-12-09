// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(together-mode) */
import React, { useMemo, useRef, useState } from 'react';
/* @conditional-compile-remove(together-mode) */
import { useId } from '@fluentui/react-hooks';
/* @conditional-compile-remove(together-mode) */
import { _formatString } from '@internal/acs-ui-common';
/* @conditional-compile-remove(together-mode) */
import { LayoutProps } from './Layout';
/* @conditional-compile-remove(together-mode) */
import { LayerHost, mergeStyles, Stack } from '@fluentui/react';
/* @conditional-compile-remove(together-mode) */
import { renderTiles, useOrganizedParticipants } from './utils/videoGalleryLayoutUtils';
/* @conditional-compile-remove(together-mode) */
import { OverflowGallery } from './OverflowGallery';
/* @conditional-compile-remove(together-mode) */
import { rootLayoutStyle } from './styles/DefaultLayout.styles';
/* @conditional-compile-remove(together-mode) */
import { isNarrowWidth, isShortHeight } from '../utils/responsive';
/* @conditional-compile-remove(together-mode) */
import { innerLayoutStyle, layerHostStyle } from './styles/FloatingLocalVideoLayout.styles';
/* @conditional-compile-remove(together-mode) */
import { videoGalleryLayoutGap } from './styles/Layout.styles';

/* @conditional-compile-remove(together-mode) */
/**
 * A memoized version of local screen share component. React.memo is used for a performance
 * boost by memoizing the same rendered component to avoid rerendering this when the parent component rerenders.
 * https://reactjs.org/docs/react-api.html#reactmemo
 */
export const TogetherModeLayout = (props: LayoutProps): JSX.Element => {
  const {
    remoteParticipants = [],
    dominantSpeakers,
    screenShareComponent,
    onRenderRemoteParticipant,
    styles,
    maxRemoteVideoStreams,
    parentWidth,
    parentHeight,
    overflowGalleryPosition = 'horizontalBottom',
    pinnedParticipantUserIds = [],
    togetherModeStreamComponent
  } = props;
  const isNarrow = parentWidth ? isNarrowWidth(parentWidth) : false;

  const isShort = parentHeight ? isShortHeight(parentHeight) : false;

  const [indexesToRender, setIndexesToRender] = useState<number[]>([]);
  const childrenPerPage = useRef(4);

  const { gridParticipants, overflowGalleryParticipants } = useOrganizedParticipants({
    remoteParticipants,
    dominantSpeakers,
    maxGridParticipants: maxRemoteVideoStreams,
    isScreenShareActive: !!screenShareComponent,
    maxOverflowGalleryDominantSpeakers: screenShareComponent
      ? childrenPerPage.current - (pinnedParticipantUserIds.length % childrenPerPage.current)
      : childrenPerPage.current,
    pinnedParticipantUserIds,
    layout: 'floatingLocalVideo'
  });
  const { gridTiles, overflowGalleryTiles } = renderTiles(
    gridParticipants,
    onRenderRemoteParticipant,
    maxRemoteVideoStreams,
    indexesToRender,
    overflowGalleryParticipants,
    dominantSpeakers
  );

  const layerHostId = useId('layerhost');
  const togetherModeOverFlowGalleryTiles = useMemo(() => {
    let newTiles = overflowGalleryTiles;
    if (togetherModeStreamComponent) {
      if (screenShareComponent) {
        newTiles = gridTiles.concat(overflowGalleryTiles);
      }
    }
    return newTiles;
  }, [gridTiles, overflowGalleryTiles, screenShareComponent, togetherModeStreamComponent]);

  const overflowGallery = useMemo(() => {
    if (overflowGalleryTiles.length === 0 && !props.screenShareComponent) {
      return null;
    }
    return (
      <OverflowGallery
        isShort={isShort}
        onFetchTilesToRender={setIndexesToRender}
        isNarrow={isNarrow}
        shouldFloatLocalVideo={false}
        overflowGalleryElements={togetherModeOverFlowGalleryTiles}
        horizontalGalleryStyles={styles?.horizontalGallery}
        verticalGalleryStyles={styles?.verticalGallery}
        overflowGalleryPosition={overflowGalleryPosition}
        onChildrenPerPageChange={(n: number) => {
          childrenPerPage.current = n;
        }}
        parentWidth={parentWidth}
      />
    );
  }, [
    overflowGalleryTiles.length,
    props.screenShareComponent,
    isShort,
    isNarrow,
    togetherModeOverFlowGalleryTiles,
    styles?.horizontalGallery,
    styles?.verticalGallery,
    overflowGalleryPosition,
    parentWidth
  ]);

  return screenShareComponent ? (
    <Stack styles={rootLayoutStyle}>
      <LayerHost id={layerHostId} className={mergeStyles(layerHostStyle)} />
      <Stack
        horizontal={overflowGalleryPosition === 'verticalRight'}
        styles={innerLayoutStyle}
        tokens={videoGalleryLayoutGap}
      >
        {props.overflowGalleryPosition === 'horizontalTop' ? overflowGallery : <></>}
        {screenShareComponent}
        {overflowGalleryTrampoline(overflowGallery, props.overflowGalleryPosition)}
      </Stack>
    </Stack>
  ) : (
    <Stack>{props.togetherModeStreamComponent}</Stack>
  );
};

/* @conditional-compile-remove(together-mode) */
const overflowGalleryTrampoline = (
  gallery: JSX.Element | null,
  galleryPosition?: 'horizontalBottom' | 'verticalRight' | 'horizontalTop'
): JSX.Element | null => {
  return galleryPosition !== 'horizontalTop' ? gallery : <></>;
  return gallery;
};
