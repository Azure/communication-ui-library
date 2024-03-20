// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as reselect from 'reselect';
import { getCapabilites } from './baseSelectors';

/**
 * @private
 */
export const capabilitySelector = reselect.createSelector([getCapabilites], (capabilities) => {
  return {
    capabilities
  };
});
