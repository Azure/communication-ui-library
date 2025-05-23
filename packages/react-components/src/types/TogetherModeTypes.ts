// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CreateVideoStreamViewResult, VideoGalleryStream, VideoStreamOptions } from './VideoGalleryParticipant';

/**
 * Interface representing the result of a Together Mode stream view.
 * @public
 */
export interface TogetherModeStreamOptions extends VideoStreamOptions {
  /**
   * The kind of together mode view to be created. Default is 'main'.
   */
  viewKind?: 'main' | 'panoramic';
}

/**
 * Interface representing the result of a Together Mode stream view.
 * @public
 */
export interface TogetherModeStreamViewResult {
  /**
   * Together mode stream view id.
   */
  mainVideoView?: CreateVideoStreamViewResult;
}

/**
 * Interface representing the streams in Together Mode.
 * @public
 */
export interface VideoGalleryTogetherModeStreams {
  /**
   * The main video stream in Together Mode.
   */
  mainVideoStream?: VideoGalleryStream;
}

/**
 * Interface representing the seating information in Together Mode.
 * @public
 */
export interface VideoGalleryTogetherModeSeatingInfo {
  /**
   * The top left offset from the top of the together mode view.
   */
  top: number;
  /**
   * The left offset position from the left of the together mode view.
   */
  left: number;
  /**
   *The width of the seating area
   */
  width: number;
  /**
   * The height of the seating area.
   */
  height: number;
}

/**
 * Interface representing the position of a participant in Together Mode.
 * @public
 */
export type VideoGalleryTogetherModeParticipantPosition = Record<string, VideoGalleryTogetherModeSeatingInfo>;
