// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { NotificationType } from '@internal/react-components';
import { ErrorType } from '@internal/react-components';

/** @private */
export interface NotificationTrackingInfo {
  mostRecentlyActive: Date;
  lastDismissedAt?: Date;
}

/** @private */
type NotificationTypes = ErrorType | NotificationType;

/** @private */
export type TrackedNotifications = Partial<Record<NotificationTypes, NotificationTrackingInfo>>;
