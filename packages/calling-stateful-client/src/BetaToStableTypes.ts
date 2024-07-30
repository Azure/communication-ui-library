// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// This is for mapping new types from beta, which does not exist in stable sdk.
// These mappings are necessary to bypass type check of conditional compilation
// Remove these types when the feature get stabilized in stable sdk

// For example, CallCommon doesn't exist in stable call sdk, so it will be still Call type
// So we remove CallCommonBeta type in stable
// In beta, Call | CallCommon = CallCommon because Call is just a super set of CallCommon

import { Call, CallAgent } from '@azure/communication-calling';
/* @conditional-compile-remove(teams-identity-support) */
import {
  TeamsCall as TeamsCallBeta,
  CallCommon as CallCommonBeta,
  CallAgentCommon as CallAgentCommonBeta
} from '@azure/communication-calling';

/**
 * @public
 * The common interface for all types of Calls
 */
export type CallCommon = Call | /* @conditional-compile-remove(teams-identity-support) */ CallCommonBeta;

/**
 * @public
 * The common interface for all types of CallAgents
 */
export type CallAgentCommon = CallAgent | /* @conditional-compile-remove(teams-identity-support) */ CallAgentCommonBeta;

/**
 * @beta
 */
export type TeamsCall = never | /* @conditional-compile-remove(teams-identity-support) */ TeamsCallBeta;
