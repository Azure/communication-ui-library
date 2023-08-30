// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
import { getLatestCapabilitiesChangedInfo, getRole } from './baseSelectors';

/**
 * @private
 */
export const capabilitiesChangedInfoAndRoleSelector = reselect.createSelector(
  [getLatestCapabilitiesChangedInfo, getRole],
  (capabilitiesChangeInfo, participantRole) => {
    return { capabilitiesChangeInfo, participantRole };
  }
);
