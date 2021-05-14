// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export declare type VideoDeviceType = 'Unknown' | 'UsbCamera' | 'CaptureAdapter' | 'Virtual';

export declare interface VideoDeviceInfo {
  /**
   * Get the name of this video device.
   */
  readonly name: string;
  /**
   * Get Id of this video device.
   */
  readonly id: string;
  /**
   * Get this video device type
   */
  readonly deviceType: VideoDeviceType;
}

/**
 * Stores the status of a video render as rendering could take a long time.
 */
export type VideoStreamRendererViewStatus = 'NotRendered' | 'InProgress' | 'Completed' | 'Stopping';

/**
 * Contains the status {@Link VideoStreamRendererViewStatus} of a render and the view
 * {@Link VideoStreamRendererView} of that render. The {@Link VideoStreamRendererView} will be undefined if the
 * {@Link VideoStreamRendererViewStatus} is 'NotRendered' or 'InProgress'.
 */
export interface VideoStreamRendererViewAndStatus {
  status: VideoStreamRendererViewStatus;
  view: VideoStreamRendererView | undefined;
}

/**
 * State only version of {@Link @azure/communication-calling#LocalVideoStream}.
 */
export interface LocalVideoStream {
  /**
   * Proxy of {@Link @azure/communication-calling#LocalVideoStream.source}.
   */
  source: VideoDeviceInfo;
  /**
   * Proxy of {@Link @azure/communication-calling#LocalVideoStream.mediaStreamType}.
   */
  mediaStreamType: MediaStreamType;
  /**
   * {@Link VideoStreamRendererViewAndStatus} that is managed by startRenderVideo/stopRenderVideo in
   * {@Link DeclarativeCallClient} API.
   */
  viewAndStatus: VideoStreamRendererViewAndStatus;
}

/**
 * State only version of {@Link @azure/communication-calling#RemoteVideoStream}.
 */
export interface RemoteVideoStream {
  /**
   * Proxy of {@Link @azure/communication-calling#RemoteVideoStream.id}.
   */
  id: number;
  /**
   * Proxy of {@Link @azure/communication-calling#RemoteVideoStream.mediaStreamType}.
   */
  mediaStreamType: MediaStreamType;
  /**
   * Proxy of {@Link @azure/communication-calling#RemoteVideoStream.isAvailable}.
   */
  isAvailable: boolean;
  /**
   * {@Link VideoStreamRendererViewAndStatus} that is managed by startRenderVideo/stopRenderVideo in
   * {@Link DeclarativeCallClient} API.
   */
  viewAndStatus: VideoStreamRendererViewAndStatus;
}

/**
 * State only version of {@Link @azure/communication-calling#VideoStreamRendererView}. TODO: Do we want to provide an
 * API for updateScalingMode? There is a way to change scaling mode which is to stop the video and start it again with
 * the desired scaling mode option.
 */
export interface VideoStreamRendererView {
  /**
   * Proxy of {@Link @azure/communication-calling#VideoStreamRendererView.scalingMode}.
   */
  scalingMode: ScalingMode;
  /**
   * Proxy of {@Link @azure/communication-calling#VideoStreamRendererView.isMirrored}.
   */
  isMirrored: boolean;
  /**
   * Proxy of {@Link @azure/communication-calling#VideoStreamRendererView.target}.
   */
  target: HTMLElement;
}

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
  videoStream?: RemoteVideoStream;
  screenShareStream?: RemoteVideoStream;
};

export type VideoGalleryLocalParticipant = VideoGalleryParticipant & {
  isScreenSharingOn: boolean;
  videoStream?: LocalVideoStream;
};
