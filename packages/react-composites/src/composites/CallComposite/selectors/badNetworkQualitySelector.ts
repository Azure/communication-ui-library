// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(teams-meeting-conference) */
import * as reselect from 'reselect';
/* @conditional-compile-remove(teams-meeting-conference) */
import { getUserFacingDiagnostics } from './baseSelectors';
/* @conditional-compile-remove(teams-meeting-conference) */
import { DiagnosticQuality } from '@azure/communication-calling';

/* @conditional-compile-remove(teams-meeting-conference) */
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

/* @conditional-compile-remove(teams-meeting-conference) */
/**
 * @prative
 */
export const isNetworkQualityPoor = (diagnostics: DiagnosticQuality | boolean | undefined): boolean => {
  return diagnostics === DiagnosticQuality.Poor || diagnostics === DiagnosticQuality.Bad;
};
