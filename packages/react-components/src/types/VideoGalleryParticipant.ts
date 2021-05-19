// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export declare interface VideoStreamOptions {
  isMirrored?: boolean;
  scalingMode?: 'Stretch' | 'Crop' | 'Fit';
}

export type VideoGalleryParticipant = {
  userId: string;
  isMuted?: boolean;
  displayName?: string;
  videoStream?: VideoGalleryStream;
  isScreenSharingOn?: boolean;
};

/**
 * Stores the status of a video render of a stream as rendering could take a long time. If the status is 'NotRendered'
 * you can safely call createView on the stream. For other status you should not call createView on the stream.
 * disposeView can be called on any status. See {@Link RemoteVideoStream} and {@Link LocalVideoStream}.
 *
 * Copy of VideoStreamRendererViewStatus but renamed to avoid some conflicts. If VideoStreamRendererViewStatus is
 * updated please update this.
 */
export type VideoGalleryStreamRenderStatus = 'NotRendered' | 'Rendering' | 'Rendered' | 'Stopping';

export interface VideoGalleryStream {
  id?: number;
  isAvailable?: boolean;
  isMirrored?: boolean;
  renderStatus: VideoGalleryStreamRenderStatus;
  renderElement?: HTMLElement;
}

// set the required attribs in selector. (Further simplifying our component logic) For example
// isLocalVideoReady can be calculated inside selector.
export type VideoGalleryLocalParticipant = VideoGalleryParticipant;

export interface VideoGalleryRemoteParticipant extends VideoGalleryParticipant {
  isSpeaking?: boolean;
  screenShareStream?: VideoGalleryStream;
}
