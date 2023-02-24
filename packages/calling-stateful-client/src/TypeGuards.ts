// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Call, CallAgent } from '@azure/communication-calling';
import { CallAgentCommon, CallCommon, TeamsCall, TeamsCallAgent } from './BetaToStableTypes';

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
 * @private
 * Determine whether a call is:
 * A TeamsCall
 * or a ACS Call joining the teams meeting
 */
export const _isTeamsMeetingCall = (call: CallCommon): boolean => {
  return _isTeamsCall(call) || (_isACSCall(call) && !call.info.groupId && !call.info.roomId); // there should be a better way to determine if a call is joining a teams meeting ideally should be a meetingID in the info object
};
