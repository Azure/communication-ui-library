// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { expect } from '@playwright/experimental-ct-react';
import { test as betaTest } from './FlavoredBaseTest';
import { TestChatMessageComponentAsRichTextEditBox } from './TestingComponents/TestChatMessageComponentAsRichTextEditBox';
import { formatButtonClick, formatButtonId } from './utils/RichTextEditorUtils';

betaTest.describe('ChatMessageComponentAsRichTextEditBox tests', () => {
  betaTest.skip(({ isBetaBuild }) => !isBetaBuild, 'The tests should be run for beta flavor only');

  betaTest('ChatMessageComponentAsRichTextEditBox should be shown correctly', async ({ mount }) => {
    const component = await mount(<TestChatMessageComponentAsRichTextEditBox />);
    await component.evaluate(() => document.fonts.ready);

    await component.getByTestId(formatButtonId).waitFor({ state: 'visible' });
    await expect(component).toHaveScreenshot('chat-message-component-as-rich-text-edit-box-without-format-toolbar.png');
    await component.getByTestId('rooster-rich-text-editor').hover();
    await expect(component).toHaveScreenshot('chat-message-component-as-rich-text-edit-box-hover.png');

    await formatButtonClick(component);
    //move mouse to the editor so the screenshots are consistent
    await component.getByTestId('rooster-rich-text-editor').hover();
    await expect(component).toHaveScreenshot('chat-message-component-as-rich-text-edit-box-with-format-toolbar.png');
  });

  betaTest('ChatMessageComponentAsRichTextEditBox should be shown correctly with system error', async ({ mount }) => {
    const component = await mount(<TestChatMessageComponentAsRichTextEditBox failureReason="System error" />);
    await component.evaluate(() => document.fonts.ready);
    await component.getByTestId(formatButtonId).waitFor({ state: 'visible' });
    await expect(component).toHaveScreenshot(
      'chat-message-component-as-rich-text-edit-box-with-system-error-without-format-toolbar.png'
    );
    await formatButtonClick(component);
    //move mouse to the editor so the screenshots are consistent
    await component.getByTestId('rooster-rich-text-editor').hover();
    await expect(component).toHaveScreenshot(
      'chat-message-component-as-rich-text-edit-box-with-system-error-and-format-toolbar.png'
    );
  });
});
