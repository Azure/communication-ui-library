// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ParticipantCapabilityName } from '@azure/communication-calling';

/** @private */
export interface CapabilityChangedNotificationTrackingInfo {
  mostRecentlyActive: Date;
  lastDismissedAt?: Date;
}

/** @private */
export type TrackedCapabilityChangedNotifications = Partial<
  Record<ParticipantCapabilityName, CapabilityChangedNotificationTrackingInfo>
>;
