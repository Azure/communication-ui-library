// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
import { getUserFacingDiagnostics } from './baseSelectors';

/**
 * @private
 */
export const networkReconnectOverlaySelector = reselect.createSelector([getUserFacingDiagnostics], (diagnostics) => {
  return {
    networkReconnectValue: diagnostics?.network.latest.networkReconnect?.value
  };
});
