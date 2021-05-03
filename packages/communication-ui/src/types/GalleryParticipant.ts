// © Microsoft Corporation. All rights reserved.
import { LocalVideoStream, RemoteVideoStream } from '@azure/communication-calling';

export type GalleryParticipant = {
  displayName: string;
  userId: string;
  videoStream?: RemoteVideoStream;
};

export type LocalGalleryParticipant = {
  displayName: string;
  userId: string;
  videoStream?: LocalVideoStream;
};

export type MediaStreamType = 'Video' | 'ScreenSharing';

export type ScalingMode = 'Stretch' | 'Crop' | 'Fit';

export type VideoGalleryVideoStream = {
  id: string;
  mediaStreamType: MediaStreamType;
  isAvailable: boolean;
  scalingMode?: ScalingMode;
  isMirrored?: boolean;
  target?: HTMLElement;
};

export type VideoGalleryRemoteVideoStream = VideoGalleryVideoStream;

export type VideoGalleryLocalVideoStream = VideoGalleryVideoStream;

export type VideoGalleryParticipant = {
  userId: string;
  displayName?: string;
  isMuted: boolean;
};

export type VideoGalleryRemoteParticipant = VideoGalleryParticipant & {
  isSpeaking: boolean;
  videoStream?: VideoGalleryRemoteVideoStream;
  screenShareStream?: VideoGalleryRemoteVideoStream;
};

export type VideoGalleryLocalParticipant = VideoGalleryParticipant & {
  isScreenSharingOn: boolean;
  videoStream?: VideoGalleryLocalVideoStream;
};
