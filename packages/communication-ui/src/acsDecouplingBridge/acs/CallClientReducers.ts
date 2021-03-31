// © Microsoft Corporation. All rights reserved.

import { CallAgent } from '@azure/communication-calling';
import { CallingStateUpdate } from './StateUpdates';

export const updateDisplayName = (callAgent: CallAgent, displayName: string): CallingStateUpdate => {
  callAgent.updateDisplayName(displayName);
  return (draft) => {
    draft.call.displayName = displayName;
  };
};
