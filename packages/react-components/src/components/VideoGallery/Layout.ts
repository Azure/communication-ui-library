// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { VideoGalleryParticipant, VideoGalleryRemoteParticipant } from '../../types';
import { VideoGalleryStyles } from '../VideoGallery';
/* @conditional-compile-remove(vertical-gallery) */
import { OverflowGalleryPosition } from '../VideoGallery';

/**
 * Props for a layout component
 *
 * @private
 */
export interface LayoutProps {
  /**
   * Styles for the {@link DefaultLayout}
   */
  styles?: Omit<VideoGalleryStyles, 'root'>;
  /** List of remote video particpants */
  remoteParticipants?: VideoGalleryRemoteParticipant[];
  /** Local participant information */
  localParticipant?: VideoGalleryParticipant;
  /** Callback to render each remote participant */
  onRenderRemoteParticipant: (participant: VideoGalleryRemoteParticipant, isVideoParticipant?: boolean) => JSX.Element;
  /** List of dominant speaker userIds in the order of their dominance. 0th index is the most dominant. */
  dominantSpeakers?: string[];
  /** Component that contains local video content */
  localVideoComponent?: JSX.Element;
  /** Component that contains screen share content */
  screenShareComponent?: JSX.Element;
  /**
   * Maximum number of participant remote video streams that is rendered.
   * @defaultValue 4
   */
  maxRemoteVideoStreams: number;
  /**
   * Width of parent element
   */
  parentWidth?: number;
  /**
   * Height of parent element
   */
  parentHeight?: number;
  /**
   * List of pinned participant userIds
   */
  pinnedParticipantUserIds?: string[];
  /* @conditional-compile-remove(vertical-gallery) */
  /**
   * Determines the layout of the overflowGallery.
   * @defaultValue 'HorizontalBottom'
   */
  overflowGalleryPosition?: OverflowGalleryPosition;
}
