// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallClientState, CallErrorTarget } from '../CallClientState';
import { CallStateModifier } from '../StatefulCallClient';

/**
 * Creates a new {@link CallStateModifier} that clears the latest error for specific targets.
 *
 * Intended to be used with {@link StatefulCallClient.modifyState}.
 *
 * @param targets CallErrorTarget[] to clear the errors for.
 */
export const newClearCallErrorsModifier = (targets: CallErrorTarget[]): CallStateModifier => {
  return (draft: CallClientState): void => {
    for (const target of targets) {
      if (draft.latestErrors[target] !== undefined) {
        delete draft.latestErrors[target];
      }
    }
  };
};
