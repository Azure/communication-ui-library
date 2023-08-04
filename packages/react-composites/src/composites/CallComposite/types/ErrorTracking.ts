// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ErrorType } from '@internal/react-components';

/** @private */
export interface ErrorTrackingInfo {
  mostRecentlyActive: Date;
  lastDismissedAt?: Date;
}

/** @private */
export type TrackedErrors = Partial<Record<ErrorType, ErrorTrackingInfo>>;
