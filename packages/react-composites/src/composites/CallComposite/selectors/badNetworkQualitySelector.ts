// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as reselect from 'reselect';
import { getUserFacingDiagnostics } from './baseSelectors';
import { DiagnosticQuality } from '@azure/communication-calling';

/**
 * @private
 */
export const badNetworkQualityBannerSelector = reselect.createSelector([getUserFacingDiagnostics], (diagnostics) => {
  return {
    isPoorNetworkQuality:
      isNetworkQualityPoor(diagnostics?.network.latest.networkReceiveQuality?.value) ||
      isNetworkQualityPoor(diagnostics?.network.latest.networkSendQuality?.value)
  };
});

/**
 * @prative
 */
export const isNetworkQualityPoor = (diagnostics: DiagnosticQuality | boolean | undefined): boolean => {
  return diagnostics === DiagnosticQuality.Poor || diagnostics === DiagnosticQuality.Bad;
};
