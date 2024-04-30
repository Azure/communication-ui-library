// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { expect } from '@playwright/experimental-ct-react';
import { test as betaTest } from './FlavoredBaseTest';
import { TestRichTextInsertTablePane } from './TestingComponents/TestRichTextInsertTablePane';

betaTest.describe('RichTextInsertTablePane tests', () => {
  betaTest.skip(({ isBetaBuild }) => !isBetaBuild, 'The tests should be run for beta flavor only');

  betaTest('RichTextInsertTablePane should be shown correctly', async ({ mount, page }) => {
    const component = await mount(<TestRichTextInsertTablePane maxRowsNumber={5} maxColumnsNumber={5} />);
    await component.evaluate(() => document.fonts.ready);

    await expect(component).toHaveScreenshot('rich-text-insert-table-pane-1-1-selection.png');

    await page.getByTestId('cell_3_2').hover();
    await expect(component).toHaveScreenshot('rich-text-insert-table-pane-4-3-selection.png');

    await page.getByTestId('cell_4_4').hover();
    await expect(component).toHaveScreenshot('rich-text-insert-table-pane-full-selection.png');
  });
});
