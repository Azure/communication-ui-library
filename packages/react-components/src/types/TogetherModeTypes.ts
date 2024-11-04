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
export interface TogetherModeVideoStreamProp {
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
export interface TogetherModeStreamsProp {
  mainVideoStream?: TogetherModeVideoStreamProp;
}

/* @conditional-compile-remove(together-mode) */
/**
 * Represents the seating positions of participants in Together Mode.
 *
 * @beta
 */
export type TogetherModeParticipantSeatingProp = Record<string, TogetherModeSeatingPositionProp>;

/* @conditional-compile-remove(together-mode) */
/**
 * Interface representing the position of a participant in Together Mode.
 * @beta
 */
export interface TogetherModeSeatingPositionProp {
  top: number;
  left: number;
  width: number;
  height: number;
}
