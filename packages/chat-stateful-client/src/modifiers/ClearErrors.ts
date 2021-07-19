// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClientState, ChatErrorTargets } from '../ChatClientState';
import { ChatStateModifier } from '../StatefulChatClient';

export const newClearErrorsModifier = (targets: ChatErrorTargets[]): ChatStateModifier => {
  return (draft: ChatClientState): boolean => {
    let changed = false;
    for (const target of targets) {
      if (draft.latestErrors[target] !== undefined) {
        delete draft.latestErrors[target];
        changed = true;
      }
    }
    return changed;
  };
};
