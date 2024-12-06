// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Call, CallAgent, TeamsCallAgent, IncomingCallCommon } from '@azure/communication-calling';
import { CallAgentCommon, CallCommon, TeamsCall } from './BetaToStableTypes';
import { CallState } from './CallClientState';

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

/**
 * Heuristic to detect if a call is a Teams meeting call.
 * `threadId` is only available when the call is connected.
 * `InLobby` state is only available for Teams calls currently.
 *
 * @remarks
 * This is a heuristic is not accurate when the call is in the connecting or earlymedia states.
 * If ACS group calls or rooms calls support threadId or InLobby state, this heuristic will need to be updated.
 *
 * @internal
 */
export const _isTeamsMeeting = (call: CallCommon | CallState): boolean => {
  return ('info' in call && !!call.info?.threadId) || call.state === 'InLobby';
};
