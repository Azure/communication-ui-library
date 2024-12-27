// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Locator } from 'playwright-core';

/**
 * @private
 */
export const formatButtonId = 'rich-text-input-box-format-button';

/**
 * @private
 */
export const formatButtonClick = async (component: Locator): Promise<void> => {
  await component.getByTestId(formatButtonId).waitFor({ state: 'visible' });
  await component.getByTestId(formatButtonId).click();
  await component.getByTestId('rich-text-editor-toolbar').waitFor({ state: 'visible' });
};
