// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export type { CallingBaseSelectorProps } from './baseSelectors';
export * from './callControlSelectors';
export { createDefaultCallingHandlers } from './handlers/createHandlers';

export { createDefaultTeamsCallingHandlers } from './handlers/createTeamsCallHandlers';
export type { ParticipantListSelector } from './participantListSelector';
export type { ParticipantsButtonSelector } from './participantsButtonSelector';
export type { VideoGallerySelector } from './videoGallerySelector';
export type { ErrorBarSelector } from './errorBarSelector';

export type { NotificationStackSelector } from './notificationStackSelector';

export { notificationStackSelector } from './notificationStackSelector';
export type { HoldButtonSelector } from './callControlSelectors';
export type { IncomingCallStackSelector } from './incomingCallStackSelector';
export { incomingCallStackSelector } from './incomingCallStackSelector';

export type { StartCaptionsButtonSelector, CaptionSettingsSelector, CaptionsBannerSelector } from './captionsSelector';

export { captionsBannerSelector, startCaptionsButtonSelector, captionSettingsSelector } from './captionsSelector';

export type { CallingHandlers, CreateDefaultCallingHandlers } from './handlers/createHandlers';

export type { TeamsCallingHandlers } from './handlers/createTeamsCallHandlers';
export type { CommonCallingHandlers } from './handlers/createCommonHandlers';

export type {
  DeepNoiseSuppressionEffectDependency,
  VideoBackgroundEffectsDependency
} from './handlers/createCommonHandlers';

export type { _ComponentCallingHandlers, CallingHandlersOptions } from './handlers/createHandlers';

export { useTeamsCall, useTeamsCallAgent } from './providers';

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

export { usePropsFor as useCallingPropsFor, getSelector as getCallingSelector } from './hooks/usePropsFor';
export type { GetSelector as GetCallingSelector, EmptySelector } from './hooks/usePropsFor';

export { useSelector as useCallingSelector } from './hooks/useSelector';
export { useHandlers as useCallingHandlers } from './hooks/useHandlers';

export {
  _isInCall,
  _isPreviewOn,
  _isInLobbyOrConnecting,
  _updateUserDisplayNames,
  _getEnvironmentInfo
} from './utils/callUtils';

export { _videoGalleryRemoteParticipantsMemo, _dominantSpeakersWithFlatId } from './utils/videoGalleryUtils';
export type { _VideoGalleryRemoteParticipantsMemoFn } from './utils/videoGalleryUtils';
/* @conditional-compile-remove(rtt) */
export type { StartRealTimeTextButtonSelector } from './realTimeTextSelector';
/* @conditional-compile-remove(rtt) */
export { startRealTimeTextButtonSelector } from './realTimeTextSelector';
