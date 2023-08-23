// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ParticipantCapabilityName } from '@azure/communication-calling';

/** @private */
export interface NotificationTrackingInfo {
  mostRecentlyActive: Date;
  lastDismissedAt?: Date;
}

/** @private */
export type TrackedNotifications = Partial<Record<ParticipantCapabilityName, NotificationTrackingInfo>>;
