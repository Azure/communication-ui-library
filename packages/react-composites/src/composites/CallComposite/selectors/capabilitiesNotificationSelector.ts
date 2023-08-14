// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
/* @conditional-compile-remove(capabilities) */
import { getCapabilitiesChangedInfo } from './baseSelectors';
/* @conditional-compile-remove(capabilities) */

/**
 * Selector for {@link CapabilitiesNotification} component.
 *
 * @public
 */
export const capabilitiesNotificationSelector = reselect.createSelector(
  [getCapabilitiesChangedInfo],
  (capabilitiesChangeInfo) => {
    return { capabilitiesChangeInfo };
  }
);
