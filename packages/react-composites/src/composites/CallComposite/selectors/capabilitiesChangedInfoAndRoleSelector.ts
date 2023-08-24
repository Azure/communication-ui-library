// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(capabilities) */
import * as reselect from 'reselect';
/* @conditional-compile-remove(capabilities) */
import { getCapabilitiesChangedInfo, getRole } from './baseSelectors';

/* @conditional-compile-remove(capabilities) */
/**
 * @private
 */
export const capabilitiesChangedInfoAndRoleSelector = reselect.createSelector(
  [getCapabilitiesChangedInfo, getRole],
  (capabilitiesChangeInfo, participantRole) => {
    return { capabilitiesChangeInfo, participantRole };
  }
);
