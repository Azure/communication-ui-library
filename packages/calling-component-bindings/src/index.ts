// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export type { CallingBaseSelectorProps } from './baseSelectors';
export * from './callControlSelectors';
export { createDefaultCallingHandlers } from './handlers/createHandlers';
/* @conditional-compile-remove(teams-call) */
export { createDefaultTeamsCallingHandlers } from './handlers/createTeamsCallHandlers';
export type { ParticipantListSelector } from './participantListSelector';
export type { ParticipantsButtonSelector } from './participantsButtonSelector';
export type { VideoGallerySelector } from './videoGallerySelector';
export type { ErrorBarSelector } from './errorBarSelector';
/* @conditional-compile-remove(PSTN-calls) */
export type { HoldButtonSelector } from './callControlSelectors';

export type { CallHandlersOf, CallTypeOf } from './handlers/createHandlers';
export type { CallingHandlers } from './handlers/createACSCallHandlers';
/* @conditional-compile-remove(teams-call) */
export type { TeamsCallingHandlers } from './handlers/createTeamsCallHandlers';
export type { CallingHandlersCommon } from './handlers/createHandlersCommon';

export {
  CallAgentProvider,
  CallClientProvider,
  CallProvider,
  useCall,
  useCallAgent,
  useCallClient,
  useDeviceManager,
  /* @conditional-compile-remove(teams-call) */
  useTeamsCall,
  /* @conditional-compile-remove(teams-call) */
  useTeamsCallAgent
} from './providers';
export type { CallAgentProviderProps, CallClientProviderProps, CallProviderProps } from './providers';

export { usePropsFor as useCallingPropsFor, getSelector as getCallingSelector } from './hooks/usePropsFor';
export type { GetSelector as GetCallingSelector, EmptySelector } from './hooks/usePropsFor';

export { useSelector as useCallingSelector } from './hooks/useSelector';
export { useHandlers as useCallingHandlers } from './hooks/useHandlers';

export { _isInCall, _isPreviewOn, _isInLobbyOrConnecting } from './utils/callUtils';
/* @conditional-compile-remove(PSTN-calls) */
export { _updateUserDisplayNames } from './utils/callUtils';
export { _videoGalleryRemoteParticipantsMemo, _dominantSpeakersWithFlatId } from './utils/videoGalleryUtils';
