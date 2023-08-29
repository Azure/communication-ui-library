// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(capabilities) */
import { ParticipantCapabilityName } from '@azure/communication-calling';

/* @conditional-compile-remove(capabilities) */
/** @private */
export interface CapabilityChangedNotificationTrackingInfo {
  mostRecentlyActive: Date;
  lastDismissedAt?: Date;
}

/* @conditional-compile-remove(capabilities) */
/** @private */
export type TrackedCapabilityChangedNotifications = Partial<
  Record<ParticipantCapabilityName, CapabilityChangedNotificationTrackingInfo>
>;
