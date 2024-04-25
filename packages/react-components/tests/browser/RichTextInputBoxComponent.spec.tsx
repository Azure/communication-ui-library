// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { expect } from '@playwright/experimental-ct-react';
import { TestRichTextInputBoxComponent } from './TestingComponents/TestRichTextInputBoxComponent';
import { Locator, Page } from 'playwright-core';
import { test as betaTest } from './FlavoredBaseTest';

const formatButtonId = 'rich-text-input-box-format-button';
const editorId = 'rooster-rich-text-editor';

betaTest.describe.only('RichTextInputBoxComponent tests', () => {
  betaTest.skip(({ isBetaBuild }) => !isBetaBuild, 'The tests should be run for beta flavor only');
  betaTest('RichTextInputBoxComponent should be shown correctly', async ({ mount }) => {
    const component = await mount(<TestRichTextInputBoxComponent disabled={false} minHeight="1rem" maxHeight="2rem" />);
    await component.evaluate(() => document.fonts.ready);
    await expect(component).toHaveScreenshot('richtextinputboxcomponent-without-format-toolbar.png');
    const formatButton = component.getByTestId(formatButtonId);

    await formatButton.hover();
    await expect(component).toHaveScreenshot('richtextinputboxcomponent-hover.png');

    await formatButton.click();
    //move mouse to the format button so the screenshots are consistent
    await formatButton.hover();
    await expect(component).toHaveScreenshot('richtextinputboxcomponent-with-format-toolbar.png');
  });

  betaTest('Text should be formatted correctly when only 1 text style selected', async ({ mount }) => {
    const component = await mount(<TestRichTextInputBoxComponent disabled={false} minHeight="1rem" maxHeight="2rem" />);
    await component.evaluate(() => document.fonts.ready);
    await component.getByTestId(formatButtonId).click();
    const editor = component.getByTestId(editorId);
    const boldButton = component.getByLabel('Bold');
    const italicButton = component.getByLabel('Italic');
    const underlineButton = component.getByLabel('Underline');

    // fill can't be used here as it doesn't trigger needed events
    await boldButton.click();
    await editor.pressSequentially('Bold ');
    await boldButton.click();

    await italicButton.click();
    await editor.pressSequentially('Italic ');
    await italicButton.click();

    await underlineButton.click();
    await editor.pressSequentially('Underline ');

    await expect(component).toHaveScreenshot('richtextinputboxcomponent-text-formatted-1-text-format-at-a-time.png');
  });

  betaTest('Text should be formatted correctly when only all text styles selected', async ({ mount }) => {
    const component = await mount(<TestRichTextInputBoxComponent disabled={false} minHeight="1rem" maxHeight="2rem" />);
    await component.evaluate(() => document.fonts.ready);
    await component.getByTestId(formatButtonId).click();
    const editor = component.getByTestId(editorId);

    await component.getByLabel('Bold').click();
    await component.getByLabel('Italic').click();
    await component.getByLabel('Underline').click();

    // fill can't be used here as it doesn't trigger needed events
    await editor.pressSequentially('Hello World!');

    await expect(component).toHaveScreenshot('richtextinputboxcomponent-text-formatted-all-text-formats.png');
  });

  betaTest('Text should be formatted for bulleted list', async ({ mount }) => {
    const component = await mount(
      <TestRichTextInputBoxComponent disabled={false} minHeight="1rem" maxHeight="10rem" />
    );
    await component.evaluate(() => document.fonts.ready);
    addList('Bulleted list', component);

    await expect(component).toHaveScreenshot('richtextinputboxcomponent-text-formatted-bulleted-list.png');
  });

  betaTest('Text should be formatted for numbered list', async ({ mount }) => {
    const component = await mount(
      <TestRichTextInputBoxComponent disabled={false} minHeight="1rem" maxHeight="10rem" />
    );
    await component.evaluate(() => document.fonts.ready);

    addList('Numbered list', component);

    await expect(component).toHaveScreenshot('richtextinputboxcomponent-text-formatted-numbered-list.png');
  });

  betaTest.only('Tables can be added and modified', async ({ mount, page }) => {
    const component = await mount(
      <TestRichTextInputBoxComponent disabled={false} minHeight="10rem" maxHeight="10rem" />
    );
    await component.evaluate(() => document.fonts.ready);

    await component.getByTestId(formatButtonId).click();

    await component.getByLabel('Insert table').click();
    await expect(component).toHaveScreenshot('richtextinputboxcomponent-insert-table-panel.png');
    const insertTableOfSelectedSizeButton = page.getByTestId('cell_0_0');
    await insertTableOfSelectedSizeButton.hover();
    await expect(component).toHaveScreenshot('richtextinputboxcomponent-insert-table-panel-selected-size.png');

    // add table 1*1 to have only one sell for the next step
    await insertTableOfSelectedSizeButton.click();

    await component.pressSequentially('Test 1');

    await selectTableContextMenu({
      component,
      page,
      menuTitle: 'Insert',
      subMenuTitle: 'Insert above',
      text: 'Test 2',
      cellName: 'Test 1'
    });
    await expect(component).toHaveScreenshot('richtextinputboxcomponent-table-insert-additional-row-above.png');

    await selectTableContextMenu({
      component,
      page,
      menuTitle: 'Insert',
      subMenuTitle: 'Insert below',
      text: 'Test 3',
      cellName: 'Test 1'
    });
    await expect(component).toHaveScreenshot('richtextinputboxcomponent-table-insert-additional-row-below.png');

    await selectTableContextMenu({
      component,
      page,
      menuTitle: 'Insert',
      subMenuTitle: 'Insert right',
      text: 'Test 4',
      cellName: 'Test 1'
    });
    await expect(component).toHaveScreenshot('richtextinputboxcomponent-table-insert-additional-column-right.png');

    await selectTableContextMenu({
      component,
      page,
      menuTitle: 'Insert',
      subMenuTitle: 'Insert left',
      text: 'Test 5',
      cellName: 'Test 1'
    });
    await expect(component).toHaveScreenshot('richtextinputboxcomponent-table-insert-additional-column-left.png');

    await selectTableContextMenu({
      component,
      page,
      menuTitle: 'Delete',
      subMenuTitle: 'Delete row',
      cellName: 'Test 1'
    });
    await expect(component).toHaveScreenshot('richtextinputboxcomponent-table-delete-row.png');

    await selectTableContextMenu({
      component,
      page,
      menuTitle: 'Delete',
      subMenuTitle: 'Delete column',
      cellName: 'Test 2'
    });
    await expect(component).toHaveScreenshot('richtextinputboxcomponent-table-delete-column.png');

    await selectTableContextMenu({
      component,
      page,
      menuTitle: 'Delete',
      subMenuTitle: 'Delete table',
      cellName: 'Test 4'
    });
    await expect(component).toHaveScreenshot('richtextinputboxcomponent-table-delete-table.png');
  });
});

const addList = async (listButtonLabel: string, component: Locator): Promise<void> => {
  await component.getByTestId(formatButtonId).click();
  const editor = component.getByTestId(editorId);

  await component.getByLabel(listButtonLabel).click();
  // fill can't be used here as it doesn't trigger needed events
  await editor.pressSequentially('Hello World!');
  await editor.press('Enter');
  await editor.pressSequentially('Second line');
  await editor.press('Enter');
  await component.getByLabel('Increase indent').click();
  await editor.pressSequentially('First submenu');
  await editor.press('Enter');
  await component.getByLabel('Decrease indent').click();
  await editor.pressSequentially('Third line');
};

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
  await cell.click({ button: 'right' });
  await page.getByText(menuTitle, { exact: true }).hover();
  await page.getByText(subMenuTitle).click();
  if (text) {
    await component.pressSequentially(text);
  }
};
