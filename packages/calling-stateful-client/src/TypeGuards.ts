// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Call, CallAgent, TeamsCallAgent, IncomingCallCommon } from '@azure/communication-calling';
import { CallAgentCommon, CallCommon, TeamsCall } from './BetaToStableTypes';

/**
 * @internal
 */
export const _isACSCall = (call: CallCommon): call is Call => {
  /* @conditional-compile-remove(teams-identity-support) */
  return !call.kind || call.kind === 'Call';
  return true;
};

/**
 * @internal
 */
export const _isACSCallAgent = (callAgent: CallAgentCommon): callAgent is CallAgent => {
  /* @conditional-compile-remove(teams-identity-support) */
  return !callAgent.kind || callAgent.kind === 'CallAgent';
  return true;
};

/**
 * @internal
 */
export const _isTeamsCall = (call: CallCommon): call is TeamsCall => {
  /* @conditional-compile-remove(teams-identity-support) */
  return call.kind === 'TeamsCall';
  return false;
};

/**
 * @internal
 */
export const _isTeamsCallAgent = (callAgent: CallAgentCommon): callAgent is TeamsCallAgent => {
  /* @conditional-compile-remove(teams-identity-support) */
  return callAgent.kind === 'TeamsCallAgent';
  return false;
};

/**
 * @internal
 */
export const _isTeamsIncomingCall = (call: IncomingCallCommon): boolean => {
  return call.kind === 'TeamsIncomingCall';
  return false;
};

/**
 * @internal
 */
export const _isACSIncomingCall = (call: IncomingCallCommon): boolean => {
  return call.kind === 'IncomingCall';
  return false;
};
