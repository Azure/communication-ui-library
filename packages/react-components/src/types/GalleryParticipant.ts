// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// export declare type VideoDeviceType = 'Unknown' | 'UsbCamera' | 'CaptureAdapter' | 'Virtual';

// export declare interface VideoDeviceInfo {
//   /**
//    * Get the name of this video device.
//    */
//   readonly name: string;
//   /**
//    * Get Id of this video device.
//    */
//   readonly id: string;
//   /**
//    * Get this video device type
//    */
//   readonly deviceType: VideoDeviceType;
// }

// /**
//  * State only version of {@Link @azure/communication-calling#LocalVideoStream}.
//  */
// export interface LocalVideoStream {
//   /**
//    * Proxy of {@Link @azure/communication-calling#LocalVideoStream.source}.
//    */
//   source: VideoDeviceInfo;
//   /**
//    * Proxy of {@Link @azure/communication-calling#LocalVideoStream.mediaStreamType}.
//    */
//   mediaStreamType: MediaStreamType;
//   /**
//    * {@Link VideoStreamRendererView} is added/removed from state by startRenderVideo/stopRenderVideo in
//    * {@Link DeclarativeCallClient} API.
//    */
//   videoStreamRendererView?: VideoStreamRendererView | undefined;
// }

// /**
//  * State only version of {@Link @azure/communication-calling#RemoteVideoStream}.
//  */
// export interface RemoteVideoStream {
//   /**
//    * Proxy of {@Link @azure/communication-calling#RemoteVideoStream.id}.
//    */
//   id: number;
//   /**
//    * Proxy of {@Link @azure/communication-calling#RemoteVideoStream.mediaStreamType}.
//    */
//   mediaStreamType: MediaStreamType;
//   /**
//    * Proxy of {@Link @azure/communication-calling#RemoteVideoStream.isAvailable}.
//    */
//   isAvailable: boolean;
//   /**
//    * {@Link VideoStreamRendererView} is added/removed from state by startRenderVideo/stopRenderVideo in
//    * {@Link DeclarativeCallClient} API.
//    */
//   videoStreamRendererView: VideoStreamRendererView | undefined;
// }

// /**
//  * State only version of {@Link @azure/communication-calling#VideoStreamRendererView}. TODO: Do we want to provide an
//  * API for updateScalingMode? There is a way to change scaling mode which is to stop the video and start it again with
//  * the desired scaling mode option.
//  */
// export interface VideoStreamRendererView {
//   /**
//    * Proxy of {@Link @azure/communication-calling#VideoStreamRendererView.scalingMode}.
//    */
//   scalingMode: ScalingMode;
//   /**
//    * Proxy of {@Link @azure/communication-calling#VideoStreamRendererView.isMirrored}.
//    */
//   isMirrored: boolean;
//   /**
//    * Proxy of {@Link @azure/communication-calling#VideoStreamRendererView.target}.
//    */
//   target: HTMLElement;
// }

// export declare interface CreateViewOptions {
//   isMirrored?: boolean;
//   scalingMode?: ScalingMode;
// }

// export type MediaStreamType = 'Video' | 'ScreenSharing';

// export type ScalingMode = 'Stretch' | 'Crop' | 'Fit';

// export type VideoGalleryParticipant = {
//   userId: string;
//   displayName?: string;
//   isMuted: boolean;
// };

// export type VideoGalleryRemoteParticipant = VideoGalleryParticipant & {
//   isSpeaking: boolean;
//   videoStream?: RemoteVideoStream;
//   screenShareStream?: RemoteVideoStream;
// };

// export type VideoGalleryLocalParticipant = VideoGalleryParticipant & {
//   isScreenSharingOn: boolean;
//   videoStream?: LocalVideoStream;
// };

// //============================================================================

export type VideoGalleryParticipant = {
  userId: string;
  isMuted?: boolean;
  displayName?: string;
  videoStream?: VideoGalleryStream;
  isScreenSharingOn?: boolean;
};

export interface VideoGalleryStream {
  id?: number;
  isAvailable?: boolean;
  isMirrored?: boolean;
  videoProvider?: HTMLElement;
}

// set the required attribs in selector. (Further simplifying our component logic) For example
// isLocalVideoReady can be calculated inside selector.
export type VideoGalleryLocalParticipant = VideoGalleryParticipant;

export interface VideoGalleryRemoteParticipant extends VideoGalleryParticipant {
  isSpeaking?: boolean;
  screenShareStream?: VideoGalleryStream;
}
