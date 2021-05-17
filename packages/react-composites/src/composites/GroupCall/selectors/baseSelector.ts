// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState as CallStatus } from '@azure/communication-calling';
import { CallState } from '../adapter';

export const getCallStatus = (state: CallState): CallStatus => state.call?.state ?? 'None';

export const getIsScreenShareOn = (state: CallState): boolean => state.call?.isScreenSharingOn ?? false;
