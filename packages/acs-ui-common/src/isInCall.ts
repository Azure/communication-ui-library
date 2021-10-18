// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState as CallStatus } from '@azure/communication-calling';

/**
 * Check if the call state represents being connected to a call
 *
 * @internal
 */
export const _isInCall = (callStatus?: CallStatus): boolean =>
  !!callStatus && !['None', 'Disconnected', 'Connecting'].includes(callStatus);
