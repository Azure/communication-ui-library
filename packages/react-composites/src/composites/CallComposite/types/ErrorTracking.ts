// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(notifications) */
import { NotificationType } from '@internal/react-components';
import { ErrorType } from '@internal/react-components';

/** @private */
export interface NotificationTrackingInfo {
  mostRecentlyActive: Date;
  lastDismissedAt?: Date;
}

/** @private */
type NotificationTypes = ErrorType | /* @conditional-compile-remove(notifications) */ NotificationType;

/** @private */
export type TrackedNotifications = Partial<Record<NotificationTypes, NotificationTrackingInfo>>;
