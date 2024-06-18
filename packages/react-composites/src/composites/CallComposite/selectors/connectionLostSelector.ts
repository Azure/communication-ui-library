// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as reselect from 'reselect';
import { getUserFacingDiagnostics } from './baseSelectors';

/**
 * @private
 */
export const connectionLostBannerSelector = reselect.createSelector([getUserFacingDiagnostics], (diagnostics) => {
  return {
    connectionLost: !!diagnostics?.network.latest.networkReceiveQuality?.value
  };
});
