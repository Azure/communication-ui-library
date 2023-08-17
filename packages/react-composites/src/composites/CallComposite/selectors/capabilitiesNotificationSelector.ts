// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(capabilities) */
import * as reselect from 'reselect';
/* @conditional-compile-remove(capabilities) */
import { getCapabilitiesChangedInfo, getRole } from './baseSelectors';

/* @conditional-compile-remove(capabilities) */
/**
 * Selector for {@link CapabilitiesNotification} component.
 *
 * @public
 */
export const capabilitiesNotificationSelector = reselect.createSelector(
  [getCapabilitiesChangedInfo, getRole],
  (capabilitiesChangeInfo, participantRole) => {
    return { capabilitiesChangeInfo, participantRole };
  }
);
