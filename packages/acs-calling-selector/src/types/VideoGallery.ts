// © Microsoft Corporation. All rights reserved.

type VideoGalleryVideoStream = {
  id: string;
  mediaStreamType: 'Video' | 'ScreenSharing';
  isAvailable: boolean;
  scalingMode?: 'Stretch' | 'Crop' | 'Fit';
  isMirrored?: boolean;
  target?: HTMLElement;
};

export type VideoGalleryRemoteVideoStream = VideoGalleryVideoStream;

export type VideoGalleryLocalVideoStream = VideoGalleryVideoStream;

type VideoGalleryParticipant = {
  userId: string;
  displayName?: string;
  isMuted: boolean;
};

export type VideoGalleryRemoteParticipant = VideoGalleryParticipant & {
  isSpeaking: boolean;
  videoStreams: VideoGalleryRemoteVideoStream[];
};

export type VideoGalleryLocalParticipant = VideoGalleryParticipant & {
  isScreenSharingOn: boolean;
  videoStreams: VideoGalleryLocalVideoStream[];
};
