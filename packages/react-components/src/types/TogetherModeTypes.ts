// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(together-mode) */
import { CreateVideoStreamViewResult } from './VideoGalleryParticipant';

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
export interface TogetherModeVideoStream {
  isAvailable?: boolean;
  /**
   * The HTML element used to render the video stream.
   *
   */
  renderElement?: HTMLElement;

  /**
   * The size of the video stream.
   * @optional
   */
  streamSize?: { width: number; height: number };
}

/* @conditional-compile-remove(together-mode) */
/**
 * Interface representing the streams in Together Mode.
 * @beta
 */
export interface TogetherModeStreams {
  mainVideoStream?: TogetherModeVideoStream;
}

/**
 * Interface representing the seating information in Together Mode.
 * @beta
 */
export interface TogetherModeSeatingInfo {
  top: number;
  left: number;
  width: number;
  height: number;
}

/* @conditional-compile-remove(together-mode) */
/**
 * Interface representing the position of a participant in Together Mode.
 * @beta
 */
export type TogetherModeParticipantPosition = Record<string, TogetherModeSeatingInfo>;
