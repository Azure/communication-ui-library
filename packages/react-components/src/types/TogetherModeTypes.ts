// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(together-mode) */
import { CreateVideoStreamViewResult, ViewScalingMode } from './VideoGalleryParticipant';

/* @conditional-compile-remove(together-mode) */
/**
 * Interface representing the result of a Together Mode stream view.
 * @beta
 */
export interface TogetherModeStreamViewResult {
  mainVideoView?: CreateVideoStreamViewResult;
}

/* @conditional-compile-remove(together-mode) */
/**
 * Represents a video stream in Together Mode.
 * @beta
 */
export interface TogetherModeStream {
  /**
   * Flag indicating whether the video stream is available for rendering
   */
  isAvailable?: boolean;
  /**
   * Flag indicating whether the together mode stream is packets are being received.
   */
  isReceiving?: boolean;
  /**
   * The HTML element used to render the video stream.
   *
   */
  renderElement?: HTMLElement;
  /**
   * Scaling mode of the video stream
   */
  scalingMode?: ViewScalingMode;
  /**
   * The size of the video stream.
   *
   */
  streamSize?: { width: number; height: number };
}

/* @conditional-compile-remove(together-mode) */
/**
 * Interface representing the streams in Together Mode.
 * @beta
 */
export interface VideoGalleryTogetherModeStreams {
  mainVideoStream?: TogetherModeStream;
}

/* @conditional-compile-remove(together-mode) */
/**
 * Interface representing the seating information in Together Mode.
 * @beta
 */
export interface VideoGalleryTogetherModeSeatingInfo {
  /* The top left offset from the top of the together mode view.*/
  top: number;
  /* The left offset position from the left of the together mode view. */
  left: number;
  /*  The width of the seating area */
  width: number;
  /* The height of the seating area. */
  height: number;
}

/* @conditional-compile-remove(together-mode) */
/**
 * Interface representing the position of a participant in Together Mode.
 * @beta
 */
export type VideoGalleryTogetherModeParticipantPosition = Record<string, VideoGalleryTogetherModeSeatingInfo>;
