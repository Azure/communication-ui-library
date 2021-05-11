// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export { createDefaultHandlersForComponent } from './handlers/createHandlers';
export type { BaseSelectorProps } from './baseSelectors';
export * from './baseSelectors';
export type { CommonProperties } from './handlers/createHandlers';
export { videoGallerySelector } from './videoGallerySelector';

export type {
  VideoGalleryRemoteParticipant,
  VideoGalleryLocalParticipant,
  VideoGalleryParticipant,
  ScalingMode,
  MediaStreamType,
  CreateViewOptions
} from './types/VideoGallery';

export { memoizeFnAll } from './utils/memoizeFnAll';
export type { FunctionWithKey, CallbackType } from './utils/memoizeFnAll';
export * from './callControlSelectors';
export * from './participantListSelector';
export type { WebUIParticipant } from './types/WebUIParticipant';
