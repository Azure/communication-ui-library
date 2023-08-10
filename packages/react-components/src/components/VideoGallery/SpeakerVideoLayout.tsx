// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useTheme } from '@fluentui/react';
import { LocalVideoTileSize } from '../VideoGallery';
import { LayoutProps } from './Layout';
import { isNarrowWidth } from '../utils/responsive';

/**
 * Props for {@link FloatingLocalVideoLayout}.
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
    showCameraSwitcherInLocalPreview,
    parentWidth,
    parentHeight,
    /* @conditional-compile-remove(vertical-gallery) */ overflowGalleryPosition = 'HorizontalBottom',
    pinnedParticipantUserIds = [],
    /* @conditional-compile-remove(click-to-call) */ localVideoTileSize
  } = props;

  const theme = useTheme();

  const isNarrow = parentWidth ? isNarrowWidth(parentWidth) : false;
};
