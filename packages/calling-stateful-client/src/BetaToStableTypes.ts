// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// This is for mapping new types from beta, which does not exist in stable sdk.
// These mappings are necessary to bypass type check of conditional compilation
// Remove these types when the feature get stabilized in stable sdk

import { Call, CallAgent, IncomingCall } from '@azure/communication-calling';
/* @conditional-compile-remove(teams-call) */
import {
  TeamsCall as TeamsCallBeta,
  CallCommon as CallCommonBeta,
  CallAgentCommon as CallAgentCommonBeta,
  TeamsCallAgent as TeamsCallAgentBeta,
  IncomingCallCommon as IncomingCallCommonBeta
} from '@azure/communication-calling';

/**
 * @private
 */
export type CallCommon = Call | /* @conditional-compile-remove(teams-call) */ CallCommonBeta;

/**
 * @private
 */
export type CallAgentCommon = CallAgent | /* @conditional-compile-remove(teams-call) */ CallAgentCommonBeta;

/**
 * @private
 */
export type TeamsCall = never | /* @conditional-compile-remove(teams-call) */ TeamsCallBeta;

/**
 * @private
 */
export type TeamsCallAgent = never | /* @conditional-compile-remove(teams-call) */ TeamsCallAgentBeta;

/**
 * @private
 */
export type IncomingCallCommon = IncomingCall | /* @conditional-compile-remove(teams-call) */ IncomingCallCommonBeta;
