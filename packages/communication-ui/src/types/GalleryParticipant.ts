// © Microsoft Corporation. All rights reserved.
import { LocalVideoStream, RemoteVideoStream } from '@azure/communication-calling';

import {
  RemoteVideoStream as RemoteVideoStreamStateful,
  LocalVideoStream as LocalVideoStreamStateful
} from '@azure/acs-calling-declarative';

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

export declare interface CreateViewOptions {
  isMirrored?: boolean;
  scalingMode?: ScalingMode;
}

export type MediaStreamType = 'Video' | 'ScreenSharing';

export type ScalingMode = 'Stretch' | 'Crop' | 'Fit';

export type VideoGalleryParticipant = {
  userId: string;
  displayName?: string;
  isMuted: boolean;
};

export type VideoGalleryRemoteParticipant = VideoGalleryParticipant & {
  isSpeaking: boolean;
  videoStream?: RemoteVideoStreamStateful;
  screenShareStream?: RemoteVideoStreamStateful;
};

export type VideoGalleryLocalParticipant = VideoGalleryParticipant & {
  isScreenSharingOn: boolean;
  videoStream?: LocalVideoStreamStateful;
};
