// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Options to control how video streams are rendered.
 *
 * @public
 */
export declare interface VideoStreamOptions {
  /** Whether the video stream is mirrored or not */
  isMirrored?: boolean;
  /** Scaling mode. It can be `Stretch`, `Crop` or `Fit` */
  scalingMode?: 'Stretch' | 'Crop' | 'Fit';
}

/**
 * The state of a participant in the {@link VideoGallery}.
 *
 * @public
 */
export type VideoGalleryParticipant = {
  /** User ID of participant */
  userId: string;
  /** Whether participant is muted */
  isMuted?: boolean;
  /** Display name of participant */
  displayName?: string;
  /** Video stream of participant */
  videoStream?: VideoGalleryStream;
  /** Whether participant is screen sharing or not */
  isScreenSharingOn?: boolean;
};

/**
 * Video stream of a participant in {@link VideoGallery}.
 *
 * @public
 */
export interface VideoGalleryStream {
  /** ID of the video stream */
  id?: number;
  /** Whether the video stream is available or not */
  isAvailable?: boolean;
  /** Whether the video stream is mirrored or not */
  isMirrored?: boolean;
  /** Render element of the video stream */
  renderElement?: HTMLElement;
}

// set the required attribs in selector. (Further simplifying our component logic) For example
// isLocalVideoReady can be calculated inside selector.
/**
 * The state of the local participant in the {@link VideoGallery}.
 *
 * @public
 */
export type VideoGalleryLocalParticipant = VideoGalleryParticipant;

/**
 * The state of a remote participant in the {@link VideoGallery}.
 *
 * @public
 */
export interface VideoGalleryRemoteParticipant extends VideoGalleryParticipant {
  /** Whether participant is speaking or not */
  isSpeaking?: boolean;
  /** Video stream of shared screen */
  screenShareStream?: VideoGalleryStream;
}
