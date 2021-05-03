// © Microsoft Corporation. All rights reserved.
export { createDefaultHandlersForComponent } from './handlers/createHandlers';
export type { BaseSelectorProps } from './baseSelectors';
export type {
  CallClientHandlers,
  CallAgentHandlers,
  DeviceManagerHandlers,
  CallHandlers,
  CommonProperties
} from './handlers/createHandlers';
export { videoGallerySelector } from './videoGallerySelector';

export type {
  VideoGalleryRemoteParticipant,
  VideoGalleryLocalParticipant,
  VideoGalleryLocalVideoStream,
  VideoGalleryRemoteVideoStream,
  VideoGalleryVideoStream,
  VideoGalleryParticipant
} from './types/VideoGallery';

export { memoizeFnAll } from './utils/memoizeFnAll';
export type { FunctionWithKey, CallbackType } from './utils/memoizeFnAll';
