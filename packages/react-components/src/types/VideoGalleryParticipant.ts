// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  ParticipantState,
  /* @conditional-compile-remove(media-access) */
  MediaAccess
} from './ParticipantListParticipant';

import { RaisedHand } from './ParticipantListParticipant';
import { Reaction } from './ParticipantListParticipant';
import { Spotlight } from './ParticipantListParticipant';
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
  /** Whether participant is spotlighted **/
  spotlight?: Spotlight;
  /* @conditional-compile-remove(remote-ufd) */
  /** Signal strength of the participant, range from 1 to 3, lower means better connection **/
  signalStrength?: number;
  /* @conditional-compile-remove(media-access) */
  /** Media audio video access states **/
  mediaAccess?: MediaAccess;
  /* @conditional-compile-remove(media-access) */
  /** Attendee can have audio be forbidden **/
  canAudioBeForbidden?: boolean;
  /* @conditional-compile-remove(media-access) */
  /** Attendee can have video be forbidden **/
  canVideoBeForbidden?: boolean;
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
  /** Scaling mode of the video stream */
  scalingMode?: ViewScalingMode;
  /** Stream Size of the video stream */
  streamSize?: { width: number; height: number };
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
export interface VideoGalleryLocalParticipant extends VideoGalleryParticipant {
  /** Whether local participant is raised a hand */
  raisedHand?: RaisedHand;
  /**
   * Whether local participant has reacted
   *
   * */
  reaction?: Reaction;
  /** Video stream of shared screen */
  screenShareStream?: VideoGalleryStream;
}

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
  /**
   * @public
   * The connection state of the participant. For example, 'Hold', 'Connecting' etc.
   */
  state?: ParticipantState;
  /** Whether participant is raised a hand */
  raisedHand?: RaisedHand;
  /**
   * Whether participant has reacted
   *
   * @public
   * */
  reaction?: Reaction;
  /* @conditional-compile-remove(media-access) */
  /** Media audio video access states **/
  mediaAccess?: MediaAccess;
}
