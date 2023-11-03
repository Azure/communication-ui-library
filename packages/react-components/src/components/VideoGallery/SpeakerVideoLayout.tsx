// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { LayerHost, Stack, mergeStyles, useTheme } from '@fluentui/react';
/* @conditional-compile-remove(click-to-call) */
import { LocalVideoTileSize } from '../VideoGallery';
import { LayoutProps } from './Layout';
import { isNarrowWidth } from '../utils/responsive';
/* @conditional-compile-remove(vertical-gallery) */
import { isShortHeight } from '../utils/responsive';
import React, { useMemo, useRef, useState } from 'react';
import { OverflowGallery } from './OverflowGallery';
import {
  SMALL_FLOATING_MODAL_SIZE_REM,
  LARGE_FLOATING_MODAL_SIZE_REM,
  localVideoTileContainerStyle
} from './styles/FloatingLocalVideo.styles';
/* @conditional-compile-remove(vertical-gallery) */
import {
  VERTICAL_GALLERY_FLOATING_MODAL_SIZE_REM,
  SHORT_VERTICAL_GALLERY_FLOATING_MODAL_SIZE_REM
} from './styles/FloatingLocalVideo.styles';
import { useOrganizedParticipants } from './utils/videoGalleryLayoutUtils';
import { GridLayout } from '../GridLayout';
import { rootLayoutStyle } from './styles/FloatingLocalVideoLayout.styles';
import { layerHostStyle, innerLayoutStyle } from './styles/FloatingLocalVideoLayout.styles';
import { videoGalleryLayoutGap } from './styles/Layout.styles';
import { useId } from '@fluentui/react-hooks';

/**
 * Props for {@link SpeakerVideoLayout}.
 *
 * @private
 */
export interface SpeakerVideoLayoutProps extends LayoutProps {
  /**
   * Whether to display the local video camera switcher button
   */
  showCameraSwitcherInLocalPreview?: boolean;
  /**
   * Height of parent element
   */
  parentHeight?: number;
  /* @conditional-compile-remove(click-to-call) */
  /**
   * Local video tile mode
   */
  localVideoTileSize?: LocalVideoTileSize;
}

/**
 * Layout for the gallery mode to highlight the current dominant speaker
 *
 * @private
 */
export const SpeakerVideoLayout = (props: SpeakerVideoLayoutProps): JSX.Element => {
  const {
    remoteParticipants = [],
    dominantSpeakers,
    localVideoComponent,
    screenShareComponent,
    onRenderRemoteParticipant,
    styles,
    maxRemoteVideoStreams,
    parentWidth,
    /* @conditional-compile-remove(vertical-gallery) */ parentHeight,
    /* @conditional-compile-remove(vertical-gallery) */ overflowGalleryPosition = 'horizontalBottom',
    pinnedParticipantUserIds = [],
    /* @conditional-compile-remove(click-to-call) */ localVideoTileSize
  } = props;

  const theme = useTheme();

  const isNarrow = parentWidth ? isNarrowWidth(parentWidth) : false;

  /* @conditional-compile-remove(vertical-gallery) */
  const isShort = parentHeight ? isShortHeight(parentHeight) : false;

  // This is for tracking the number of children in the first page of overflow gallery.
  // This number will be used for the maxOverflowGalleryDominantSpeakers when organizing the remote participants.
  const childrenPerPage = useRef(4);
  const { gridParticipants, overflowGalleryParticipants } = useOrganizedParticipants({
    remoteParticipants,
    dominantSpeakers,
    maxRemoteVideoStreams,
    isScreenShareActive: !!screenShareComponent,
    maxOverflowGalleryDominantSpeakers: screenShareComponent
      ? childrenPerPage.current - (pinnedParticipantUserIds.length % childrenPerPage.current)
      : childrenPerPage.current,
    /* @conditional-compile-remove(pinned-participants) */ pinnedParticipantUserIds,
    /* @conditional-compile-remove(gallery-layouts) */ layout: 'speaker'
  });

  let activeVideoStreams = 0;

  const gridTiles = gridParticipants.map((p) => {
    return onRenderRemoteParticipant(
      p,
      maxRemoteVideoStreams && maxRemoteVideoStreams >= 0
        ? p.videoStream?.isAvailable && activeVideoStreams++ < maxRemoteVideoStreams
        : p.videoStream?.isAvailable
    );
  });

  const shouldFloatLocalVideo = remoteParticipants.length > 0;

  if (!shouldFloatLocalVideo && localVideoComponent) {
    gridTiles.push(localVideoComponent);
  }

  /**
   * instantiate indexes available to render with indexes available that would be on first page
   *
   * For some components which do not strictly follow the order of the array, we might
   * re-render the initial tiles -> dispose them -> create new tiles, we need to take care of
   * this case when those components are here
   */
  const [indexesToRender, setIndexesToRender] = useState<number[]>([]);

  const overflowGalleryTiles = overflowGalleryParticipants.map((p, i) => {
    return onRenderRemoteParticipant(
      p,
      maxRemoteVideoStreams && maxRemoteVideoStreams >= 0
        ? p.videoStream?.isAvailable &&
            indexesToRender &&
            indexesToRender.includes(i) &&
            activeVideoStreams++ < maxRemoteVideoStreams
        : p.videoStream?.isAvailable
    );
  });

  const layerHostId = useId('layerhost');

  const localVideoSizeRem = useMemo(() => {
    if (isNarrow || /*@conditional-compile-remove(click-to-call) */ localVideoTileSize === '9:16') {
      return SMALL_FLOATING_MODAL_SIZE_REM;
    }
    /* @conditional-compile-remove(vertical-gallery) */
    if ((overflowGalleryTiles.length > 0 || screenShareComponent) && overflowGalleryPosition === 'verticalRight') {
      return isNarrow
        ? SMALL_FLOATING_MODAL_SIZE_REM
        : isShort
        ? SHORT_VERTICAL_GALLERY_FLOATING_MODAL_SIZE_REM
        : VERTICAL_GALLERY_FLOATING_MODAL_SIZE_REM;
    }
    /*@conditional-compile-remove(click-to-call) */
    if ((overflowGalleryTiles.length > 0 || screenShareComponent) && overflowGalleryPosition === 'horizontalBottom') {
      return localVideoTileSize === '16:9' || !isNarrow ? LARGE_FLOATING_MODAL_SIZE_REM : SMALL_FLOATING_MODAL_SIZE_REM;
    }
    return LARGE_FLOATING_MODAL_SIZE_REM;
  }, [
    overflowGalleryTiles.length,
    isNarrow,
    screenShareComponent,
    /* @conditional-compile-remove(vertical-gallery) */ isShort,
    /* @conditional-compile-remove(vertical-gallery) */ overflowGalleryPosition,
    /* @conditional-compile-remove(click-to-call) */ localVideoTileSize
  ]);

  const wrappedLocalVideoComponent =
    localVideoComponent || (screenShareComponent && localVideoComponent) ? (
      <Stack
        className={mergeStyles(
          localVideoTileContainerStyle(
            theme,
            localVideoSizeRem,
            !!screenShareComponent,
            /* @conditional-compile-remove(gallery-layouts) */ overflowGalleryPosition
          )
        )}
      >
        {localVideoComponent}
      </Stack>
    ) : undefined;

  const overflowGallery = useMemo(() => {
    if (overflowGalleryTiles.length === 0 && !screenShareComponent) {
      return null;
    }
    return (
      <OverflowGallery
        /* @conditional-compile-remove(vertical-gallery) */
        isShort={isShort}
        onFetchTilesToRender={setIndexesToRender}
        isNarrow={isNarrow}
        shouldFloatLocalVideo={true}
        overflowGalleryElements={overflowGalleryTiles}
        horizontalGalleryStyles={styles?.horizontalGallery}
        /* @conditional-compile-remove(vertical-gallery) */
        verticalGalleryStyles={styles?.verticalGallery}
        /* @conditional-compile-remove(vertical-gallery) */
        overflowGalleryPosition={overflowGalleryPosition}
        onChildrenPerPageChange={(n: number) => {
          childrenPerPage.current = n;
        }}
        parentWidth={parentWidth}
      />
    );
  }, [
    isNarrow,
    /* @conditional-compile-remove(vertical-gallery) */ isShort,
    screenShareComponent,
    overflowGalleryTiles,
    styles?.horizontalGallery,
    /* @conditional-compile-remove(vertical-gallery) */ overflowGalleryPosition,
    setIndexesToRender,
    /* @conditional-compile-remove(vertical-gallery) */ styles?.verticalGallery
  ]);

  return (
    <Stack styles={rootLayoutStyle}>
      {wrappedLocalVideoComponent}
      <LayerHost id={layerHostId} className={mergeStyles(layerHostStyle)} />
      <Stack
        /* @conditional-compile-remove(vertical-gallery) */
        horizontal={overflowGalleryPosition === 'verticalRight'}
        styles={innerLayoutStyle}
        tokens={videoGalleryLayoutGap}
      >
        {
          /* @conditional-compile-remove(gallery-layouts) */ props.overflowGalleryPosition === 'horizontalTop' ? (
            overflowGallery
          ) : (
            <></>
          )
        }
        {screenShareComponent ? (
          screenShareComponent
        ) : (
          <GridLayout key="grid-layout" styles={styles?.gridLayout}>
            {gridTiles}
          </GridLayout>
        )}
        {overflowGalleryTrampoline(
          overflowGallery,
          /* @conditional-compile-remove(gallery-layouts) */ props.overflowGalleryPosition
        )}
      </Stack>
    </Stack>
  );
};

const overflowGalleryTrampoline = (
  gallery: JSX.Element | null,
  galleryPosition?: 'horizontalBottom' | 'verticalRight' | 'horizontalTop'
): JSX.Element | null => {
  /* @conditional-compile-remove(gallery-layouts) */
  return galleryPosition !== 'horizontalTop' ? gallery : <></>;
  return gallery;
};
