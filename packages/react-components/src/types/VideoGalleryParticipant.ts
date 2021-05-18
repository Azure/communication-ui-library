// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FlatCommunicationIdentifier } from 'acs-ui-common';

export declare interface VideoStreamOptions {
  isMirrored?: boolean;
  scalingMode?: 'Stretch' | 'Crop' | 'Fit';
}

export type VideoGalleryParticipant = {
  userId: FlatCommunicationIdentifier;
  isMuted?: boolean;
  displayName?: string;
  videoStream?: VideoGalleryStream;
  isScreenSharingOn?: boolean;
};

export interface VideoGalleryStream {
  id?: number;
  isAvailable?: boolean;
  isMirrored?: boolean;
  renderElement?: HTMLElement;
}

// set the required attribs in selector. (Further simplifying our component logic) For example
// isLocalVideoReady can be calculated inside selector.
export type VideoGalleryLocalParticipant = VideoGalleryParticipant;

export interface VideoGalleryRemoteParticipant extends VideoGalleryParticipant {
  isSpeaking?: boolean;
  screenShareStream?: VideoGalleryStream;
}
