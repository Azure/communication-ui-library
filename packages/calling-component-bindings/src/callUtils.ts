// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StatefulCallClient } from '@internal/calling-stateful-client';

/**
 * Dispose of all preview views
 * We assume all unparented views are local preview views.
 *
 * @private
 */
export const disposeAllLocalPreviewViews = async (callClient: StatefulCallClient): Promise<void> => {
  const unparentedViews = callClient.getState().deviceManager.unparentedViews;
  for (const view of unparentedViews) {
    await callClient.disposeView(undefined, undefined, view);
  }
};
