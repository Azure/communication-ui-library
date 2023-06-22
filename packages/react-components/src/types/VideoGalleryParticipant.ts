// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(one-to-n-calling) */
/* @conditional-compile-remove(PSTN-calls) */
import { ParticipantState } from './ParticipantListParticipant';

/* conditional-compile-remove(raise-hands) */
import { RaisedHand } from './ParticipantListParticipant';
/**
 * Scaling mode of a {@link VideoGalleryStream}.
 *
 * @public
 */
export type ViewScalingMode = 'Stretch' | 'Crop' | 'Fit';

/**
 * Options to control how video streams are rendered.
 *
 * @public
 */
export declare interface VideoStreamOptions {
  /** Whether the video stream is mirrored or not */
  isMirrored?: boolean;
  /** Scaling mode. It can be `Stretch`, `Crop` or `Fit` */
  scalingMode?: ViewScalingMode;
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
  /** Whether the video stream is receiving data or not */
  isReceiving?: boolean;
  /** Whether the video stream is mirrored or not */
  isMirrored?: boolean;
  /** Render element of the video stream */
  renderElement?: HTMLElement;
  /* @conditional-compile-remove(pinned-participants) */
  /** Scaling mode of the video stream */
  scalingMode?: ViewScalingMode;
}

/**
 * Object returned after creating a local or remote VideoStream.
 * This contains helper functions to manipulate the render of the stream.
 *
 * @public
 */
export interface CreateVideoStreamViewResult {
  /** View handle of the rendered video stream */
  view: {
    /**
     * Update the scale mode for this view.
     * @param scalingMode - The new scale mode.
     */
    updateScalingMode: (scalingMode: ViewScalingMode) => Promise<void>;
  };
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
  /* @conditional-compile-remove(one-to-n-calling) */
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * @beta
   * The connection state of the participant. For example, 'Hold', 'Connecting' etc.
   */
  state?: ParticipantState;
  /* @conditional-compile-remove(raise-hands) */
  /** Whether participant is raised a hand */
  raisedHand?: RaisedHand;
}
