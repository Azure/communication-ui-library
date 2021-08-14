// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClientState, ChatErrorTargets } from '../ChatClientState';
import { ChatStateModifier } from '../StatefulChatClient';

export const newClearChatErrorsModifier = (targets: ChatErrorTargets[]): ChatStateModifier => {
  return (draft: ChatClientState): void => {
    for (const target of targets) {
      if (draft.latestErrors[target] !== undefined) {
        delete draft.latestErrors[target];
      }
    }
  };
};
