// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export * from './index-public';

export { createStatefulCallClientInner } from './StatefulCallClient';

export { _isACSCall, _isACSCallAgent, _isTeamsCall, _isTeamsCallAgent } from './TypeGuards';

/* @conditional-compile-remove(close-captions) */
export { _isTeamsMeetingCall } from './TypeGuards';

export type { CallAgentCommon, CallCommon, TeamsCall, TeamsCallAgent, IncomingCallCommon } from './BetaToStableTypes';
