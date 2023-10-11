// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(capabilities) */
import * as reselect from 'reselect';
/* @conditional-compile-remove(capabilities) */
import { getLatestCapabilitiesChangedInfo, getRole } from './baseSelectors';

/* @conditional-compile-remove(capabilities) */
/**
 * @private
 */
export const capabilitiesChangedInfoAndRoleSelector = reselect.createSelector(
  [getLatestCapabilitiesChangedInfo, getRole],
  (capabilitiesChangeInfo, participantRole) => {
    return { capabilitiesChangeInfo, participantRole };
  }
);
