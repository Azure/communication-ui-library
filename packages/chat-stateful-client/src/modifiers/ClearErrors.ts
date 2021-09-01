// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClientState, ChatErrorTarget } from '../ChatClientState';
import { ChatStateModifier } from '../StatefulChatClient';

export const newClearChatErrorsModifier = (targets: ChatErrorTarget[]): ChatStateModifier => {
  return (draft: ChatClientState): void => {
    for (const target of targets) {
      if (draft.latestErrors[target] !== undefined) {
        delete draft.latestErrors[target];
      }
    }
  };
};
