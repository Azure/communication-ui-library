// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { expect } from '@playwright/experimental-ct-react';
import { TestRichTextInputBoxComponent } from './TestingComponents/TestRichTextInputBoxComponent';
import { Locator } from 'playwright-core';
import { test as betaTest } from './FlavoredBaseTest';
import { formatButtonClick, formatButtonId } from './utils/RichTextEditorUtils';

const editorId = 'rooster-rich-text-editor';

// created a separate file for table tests (`RichTextInputBoxComponentTablesTests.spec.tsx`) to speed up the test execution
betaTest.describe('RichTextInputBoxComponent tests', () => {
  betaTest.skip(({ isBetaBuild }) => !isBetaBuild, 'The tests should be run for beta flavor only');
  betaTest('RichTextInputBoxComponent should be shown correctly', async ({ mount }) => {
    const component = await mount(<TestRichTextInputBoxComponent disabled={false} minHeight="1rem" maxHeight="2rem" />);
    await component.evaluate(() => document.fonts.ready);
    await component.getByTestId(formatButtonId).waitFor({ state: 'visible' });
    await expect(component).toHaveScreenshot('rich-text-input-box-component-without-format-toolbar.png');

    await component.getByTestId('rooster-rich-text-editor').hover();
    await expect(component).toHaveScreenshot('rich-text-input-box-component-hover.png');

    await formatButtonClick(component);
    //move mouse to the editor so the screenshots are consistent
    await component.getByTestId('rooster-rich-text-editor').hover();
    await expect(component).toHaveScreenshot('rich-text-input-box-component-with-format-toolbar.png');
  });

  betaTest('Text should be formatted correctly when only 1 text style selected', async ({ mount }) => {
    const component = await mount(<TestRichTextInputBoxComponent disabled={false} minHeight="1rem" maxHeight="2rem" />);
    await component.evaluate(() => document.fonts.ready);
    await formatButtonClick(component);
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

    await expect(component).toHaveScreenshot(
      'rich-text-input-box-component-text-formatted-1-text-format-at-a-time.png'
    );
  });

  betaTest('Text should be formatted correctly when only all text styles selected', async ({ mount }) => {
    const component = await mount(<TestRichTextInputBoxComponent disabled={false} minHeight="1rem" maxHeight="2rem" />);
    await component.evaluate(() => document.fonts.ready);
    await formatButtonClick(component);
    const editor = component.getByTestId(editorId);

    await component.getByLabel('Bold').click();
    await component.getByLabel('Italic').click();
    await component.getByLabel('Underline').click();

    // fill can't be used here as it doesn't trigger needed events
    await editor.pressSequentially('Hello World!');

    await expect(component).toHaveScreenshot('rich-text-input-box-component-text-formatted-all-text-formats.png');
  });

  betaTest('Text should be formatted for bulleted list', async ({ mount }) => {
    const component = await mount(
      <TestRichTextInputBoxComponent disabled={false} minHeight="1rem" maxHeight="10rem" />
    );
    await component.evaluate(() => document.fonts.ready);
    addList('Bulleted list', component);

    await expect(component).toHaveScreenshot('rich-text-input-box-component-text-formatted-bulleted-list.png');
  });

  betaTest('Text should be formatted for numbered list', async ({ mount }) => {
    const component = await mount(
      <TestRichTextInputBoxComponent disabled={false} minHeight="1rem" maxHeight="10rem" />
    );
    await component.evaluate(() => document.fonts.ready);

    addList('Numbered list', component);

    await expect(component).toHaveScreenshot('rich-text-input-box-component-text-formatted-numbered-list.png');
  });
});

const addList = async (listButtonLabel: string, component: Locator): Promise<void> => {
  await formatButtonClick(component);
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
  // the tests are fast and sometimes UI state for "decrease indent" button doesn't have enough time to update
  // this call is to fix it
  // click is not used as it might set cursor to incorrect position
  editor.hover();
  await editor.pressSequentially('Third line');
};

const formatButtonClick = async (component: Locator): Promise<void> => {
  await component.getByTestId(formatButtonId).click();
  await component.getByTestId('rich-text-editor-toolbar').waitFor({ state: 'visible' });
};
