// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { expect } from '@playwright/experimental-ct-react';
import { TestRichTextInputBoxComponent } from './TestingComponents/TestRichTextInputBoxComponent';
import { Locator, Page } from 'playwright-core';
import { test as betaTest } from './FlavoredBaseTest';

const formatButtonId = 'rich-text-input-box-format-button';

// create a separate file for table tests to speed up the test execution
betaTest.describe('RichTextInputBoxComponent table tests', () => {
  betaTest.skip(({ isBetaBuild }) => !isBetaBuild, 'The tests should be run for beta flavor only');

  betaTest('Tables can be added and deleted', async ({ mount, page }) => {
    const component = await mount(
      <TestRichTextInputBoxComponent disabled={false} minHeight="10rem" maxHeight="10rem" />
    );
    await component.evaluate(() => document.fonts.ready);

    await formatButtonClick(component);

    await component.getByLabel('Insert table').click();
    await expect(component).toHaveScreenshot('rich-text-input-box-component-insert-table-panel.png');
    const insertTableOfSelectedSizeButton = page.getByTestId('cell_0_0');
    await insertTableOfSelectedSizeButton.hover();
    await expect(component).toHaveScreenshot('rich-text-input-box-component-insert-table-panel-selected-size.png');

    // add table 1*1 to have only one cell for the next step
    await insertTableOfSelectedSizeButton.click();

    // there is only 1 cell, so try to find the cell by role
    await component.getByRole('cell').click();
    await component.pressSequentially('Test 1');

    await selectTableContextMenu({
      component,
      page,
      menuTitle: 'Delete',
      subMenuTitle: 'Delete table',
      cellName: 'Test 1'
    });
    await expect(component).toHaveScreenshot('rich-text-input-box-component-table-delete-table.png');
  });

  betaTest('Rows added and deleted', async ({ mount, page }) => {
    const component = await mount(
      <TestRichTextInputBoxComponent disabled={false} minHeight="10rem" maxHeight="10rem" />
    );
    await component.evaluate(() => document.fonts.ready);

    await formatButtonClick(component);

    await component.getByLabel('Insert table').click();

    // add table 1*1 to have only one cell for the next step
    await page.getByTestId('cell_0_0').click();

    // there is only 1 cell, so try to find the cell by role
    await component.getByRole('cell').click();
    await component.pressSequentially('Test 1');

    await selectTableContextMenu({
      component,
      page,
      menuTitle: 'Insert',
      subMenuTitle: 'Insert above',
      text: 'Test 2',
      cellName: 'Test 1'
    });
    await expect(component).toHaveScreenshot('rich-text-input-box-component-table-insert-additional-row-above.png');

    await selectTableContextMenu({
      component,
      page,
      menuTitle: 'Insert',
      subMenuTitle: 'Insert below',
      cellName: 'Test 1'
    });
    await expect(component).toHaveScreenshot('rich-text-input-box-component-table-insert-additional-row-below.png');

    await selectTableContextMenu({
      component,
      page,
      menuTitle: 'Delete',
      subMenuTitle: 'Delete row',
      cellName: 'Test 1'
    });
    await expect(component).toHaveScreenshot('rich-text-input-box-component-table-delete-row.png');
  });

  betaTest('Columns added and deleted', async ({ mount, page }) => {
    const component = await mount(
      <TestRichTextInputBoxComponent disabled={false} minHeight="10rem" maxHeight="10rem" />
    );
    await component.evaluate(() => document.fonts.ready);

    await formatButtonClick(component);

    await component.getByLabel('Insert table').click();
    // add table 1*1 to have only one cell for the next step
    await page.getByTestId('cell_0_0').click();

    // there is only 1 cell, so try to find the cell by role
    await component.getByRole('cell').click();
    await component.pressSequentially('Test 1');

    await selectTableContextMenu({
      component,
      page,
      menuTitle: 'Insert',
      subMenuTitle: 'Insert right',
      text: 'Test 2',
      cellName: 'Test 1'
    });
    await expect(component).toHaveScreenshot('rich-text-input-box-component-table-insert-additional-column-right.png');

    await selectTableContextMenu({
      component,
      page,
      menuTitle: 'Insert',
      subMenuTitle: 'Insert left',
      cellName: 'Test 1'
    });
    await expect(component).toHaveScreenshot('rich-text-input-box-component-table-insert-additional-column-left.png');

    await selectTableContextMenu({
      component,
      page,
      menuTitle: 'Delete',
      subMenuTitle: 'Delete column',
      cellName: 'Test 1'
    });
    await expect(component).toHaveScreenshot('rich-text-input-box-component-table-delete-column.png');
  });
});

const selectTableContextMenu = async ({
  component,
  page,
  menuTitle,
  subMenuTitle,
  text,
  cellName
}: {
  menuTitle: string;
  subMenuTitle: string;
  text?: string;
  component: Locator;
  page: Page;
  cellName: string;
}): Promise<void> => {
  const cell = component.getByRole('cell', { name: cellName });
  await cell.click();
  await cell.click({ button: 'right' });
  await page.getByText(menuTitle, { exact: true }).hover();
  await page.getByText(subMenuTitle).click();
  if (text) {
    await component.pressSequentially(text);
  }
};

const formatButtonClick = async (component: Locator): Promise<void> => {
  await component.getByTestId(formatButtonId).click();
  await component.getByTestId('rich-text-editor-toolbar').waitFor({ state: 'visible' });
};
