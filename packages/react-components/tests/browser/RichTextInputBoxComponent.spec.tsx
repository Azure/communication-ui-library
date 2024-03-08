// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { expect } from '@playwright/experimental-ct-react';
import { test as betaTest } from './FlavoredBaseTest';
import { TestRichTextInputBoxComponent } from './TestingComponents/TestRichTextInputBoxComponent';

betaTest.describe.only('RichTextInputBoxComponent tests', () => {
  betaTest.skip(({ isBetaBuild }) => !isBetaBuild, 'The tests should be run for beta flavor only');

  betaTest('RichTextInputBoxComponent should be shown correctly', async ({ mount }) => {
    const component = await mount(<TestRichTextInputBoxComponent disabled={false} minHeight="1rem" maxHeight="2rem" />);
    await component.evaluate(() => document.fonts.ready);
    await expect(component).toHaveScreenshot('richtextinputboxcomponent-without-format-toolbar.png');
    const formatButton = component.getByTestId('rich-text-input-box-format-button');

    await formatButton.hover();
    await expect(component).toHaveScreenshot('richtextinputboxcomponent-hover.png');

    await formatButton.click();
    await expect(component).toHaveScreenshot('richtextinputboxcomponent-with-format-toolbar.png');
  });

  betaTest('Text should be formatted correctly when only 1 text style selected', async ({ mount }) => {
    const component = await mount(<TestRichTextInputBoxComponent disabled={false} minHeight="1rem" maxHeight="2rem" />);
    await component.evaluate(() => document.fonts.ready);
    await component.getByTestId('rich-text-input-box-format-button').click();
    const editor = component.getByTestId('rooster-rich-text-editor');
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
    await underlineButton.click();

    await expect(component).toHaveScreenshot('richtextinputboxcomponent-text-formatted-1-text-format-at-a-time.png');
  });

  betaTest('Text should be formatted correctly when only all text styles selected', async ({ mount }) => {
    const component = await mount(<TestRichTextInputBoxComponent disabled={false} minHeight="1rem" maxHeight="2rem" />);
    await component.evaluate(() => document.fonts.ready);
    await component.getByTestId('rich-text-input-box-format-button').click();
    const editor = component.getByTestId('rooster-rich-text-editor');

    await component.getByLabel('Bold').click();
    await component.getByLabel('Italic').click();
    await component.getByLabel('Underline').click();

    // fill can't be used here as it doesn't trigger needed events
    await editor.pressSequentially('Hello World!');

    await expect(component).toHaveScreenshot('richtextinputboxcomponent-text-formatted-all-text-formats.png');
  });

  betaTest('Text should be formatted for bulleted list', async ({ mount }) => {
    const component = await mount(<TestRichTextInputBoxComponent disabled={false} minHeight="1rem" maxHeight="2rem" />);
    await component.evaluate(() => document.fonts.ready);
    await component.getByTestId('rich-text-input-box-format-button').click();
    const editor = component.getByTestId('rooster-rich-text-editor');

    await component.getByLabel('Bulleted list').click();
    // fill can't be used here as it doesn't trigger needed events
    await editor.pressSequentially('Hello World!');
    await editor.press('Enter');
    await editor.pressSequentially('Second line');

    await expect(component).toHaveScreenshot('richtextinputboxcomponent-text-formatted-bulleted-list.png');
  });
});
