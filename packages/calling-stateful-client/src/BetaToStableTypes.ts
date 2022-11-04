// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// This is for mapping new types from beta, which does not exist in stable sdk.
// These mappings are necessary to bypass type check of conditional compilation
// Remove these types when the feature get stabilized in stable sdk

// For example, CallCommon doesn't exist in stable call sdk, so it will be still Call type
// So we remove CallCommonBeta type in stable
// In beta, Call | CallCommon = CallCommon because Call is just a super set of CallCommon

import { Call, CallAgent, IncomingCall } from '@azure/communication-calling';
/* @conditional-compile-remove(teams-identity-support) */
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
export type CallCommon = Call | /* @conditional-compile-remove(teams-identity-support) */ CallCommonBeta;

/**
 * @private
 */
export type CallAgentCommon = CallAgent | /* @conditional-compile-remove(teams-identity-support) */ CallAgentCommonBeta;

/**
 * @private
 */
export type TeamsCall = never | /* @conditional-compile-remove(teams-identity-support) */ TeamsCallBeta;

/**
 * @private
 */
export type TeamsCallAgent = never | /* @conditional-compile-remove(teams-identity-support) */ TeamsCallAgentBeta;

/**
 * @private
 */
export type IncomingCallCommon =
  | IncomingCall
  | /* @conditional-compile-remove(teams-identity-support) */ IncomingCallCommonBeta;
