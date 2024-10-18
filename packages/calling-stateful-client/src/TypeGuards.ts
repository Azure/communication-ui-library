// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Call, CallAgent, TeamsCallAgent, IncomingCallCommon } from '@azure/communication-calling';
import { CallAgentCommon, CallCommon, TeamsCall } from './BetaToStableTypes';

/**
 * @internal
 */
export const _isACSCall = (call: CallCommon): call is Call => {
  return !call.kind || call.kind === 'Call';
};

/**
 * @internal
 */
export const _isACSCallAgent = (callAgent: CallAgentCommon): callAgent is CallAgent => {
  return !callAgent.kind || callAgent.kind === 'CallAgent';
};

/**
 * @internal
 */
export const _isTeamsCall = (call: CallCommon): call is TeamsCall => {
  return call.kind === 'TeamsCall';
};

/**
 * @internal
 */
export const _isTeamsCallAgent = (callAgent: CallAgentCommon): callAgent is TeamsCallAgent => {
  return callAgent.kind === 'TeamsCallAgent';
};

/**
 * @internal
 */
export const _isTeamsIncomingCall = (call: IncomingCallCommon): boolean => {
  return call.kind === 'TeamsIncomingCall';
};

/**
 * @internal
 */
export const _isACSIncomingCall = (call: IncomingCallCommon): boolean => {
  return call.kind === 'IncomingCall';
};
