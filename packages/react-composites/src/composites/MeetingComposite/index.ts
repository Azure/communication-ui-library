// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export * from './MeetingComposite';

export type {
  MeetingAdapter,
  MeetingEvent,
  MeetingAdapterHandlers,
  MeetingAdapterSubscriptions
} from './adapter/MeetingAdapter';

export type { AzureCommunicationMeetingAdapterArgs } from './adapter/AzureCommunicationMeetingAdapter';
export { createAzureCommunicationMeetingAdapter } from './adapter/AzureCommunicationMeetingAdapter';

export type {
  MeetingAdapterClientState,
  MeetingAdapterUiState,
  MeetingAdapterState
} from './state/MeetingAdapterState';

export type { MeetingState } from './state/MeetingState';

export type { MeetingCompositePage } from './state/MeetingCompositePage';
export type { MeetingParticipant } from './state/MeetingParticipants';
export type { MeetingEndReason } from './state/MeetingEndReason';
