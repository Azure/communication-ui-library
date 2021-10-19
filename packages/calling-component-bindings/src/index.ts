// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export type { CallingBaseSelectorProps } from './baseSelectors';
export * from './callControlSelectors';
export { createDefaultCallingHandlers } from './handlers/createHandlers';
export { participantListSelector } from './participantListSelector';
export { participantsButtonSelector } from './participantsButtonSelector';
export { videoGallerySelector } from './videoGallerySelector';
export { errorBarSelector } from './errorBarSelector';

export type { CallingHandlers } from './handlers/createHandlers';

export {
  CallAgentProvider,
  CallClientProvider,
  CallProvider,
  useCall,
  useCallAgent,
  useCallClient,
  useDeviceManager
} from './providers';
export type { CallAgentProviderProps, CallClientProviderProps, CallProviderProps } from './providers';

export {
  usePropsFor as useCallingPropsFor,
  emptySelector,
  getSelector as getCallingSelector
} from './hooks/usePropsFor';
export type { GetSelector as GetCallingSelector } from './hooks/usePropsFor';

export { useSelector as useCallingSelector } from './hooks/useSelector';
export { useHandlers as useCallingHandlers } from './hooks/useHandlers';

export { _isInCall, _isPreviewOn } from './callUtils';
