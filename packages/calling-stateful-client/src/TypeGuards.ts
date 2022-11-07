// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Call, CallAgent } from '@azure/communication-calling';
import { CallAgentCommon, CallCommon, TeamsCall, TeamsCallAgent } from './BetaToStableTypes';

/**
 * @private
 */
export const isACSCall = (call: CallCommon): call is Call => {
  /* @conditional-compile-remove(teams-identity-support) */
  return call.kind === 'Call';
  return true;
};

/**
 * @private
 */
export const isACSCallAgent = (callAgent: CallAgentCommon): callAgent is CallAgent => {
  /* @conditional-compile-remove(teams-identity-support) */
  return callAgent.kind === 'CallAgent';
  return true;
};

/**
 * @private
 */
export const isTeamsCall = (call: CallCommon): call is TeamsCall => {
  /* @conditional-compile-remove(teams-identity-support) */
  return call.kind === 'TeamsCall';
  return false;
};

/**
 * @private
 */
export const isTeamsCallAgent = (callAgent: CallAgentCommon): callAgent is TeamsCallAgent => {
  /* @conditional-compile-remove(teams-identity-support) */
  return callAgent.kind === 'TeamsCallAgent';
  return false;
};
