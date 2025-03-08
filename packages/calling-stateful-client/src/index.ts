// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export * from './index-public';

export { _SESSION_PLACEHOLDER_ID } from './MediaClient/DeclarativeSession';

export { _createStatefulCallClientInner } from './StatefulCallClient';

export { _isACSCall, _isACSCallAgent, _isTeamsCall, _isTeamsCallAgent } from './TypeGuards';

export type { CallAgentCommon, CallCommon, TeamsCall } from './BetaToStableTypes';
