// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { expect } from '@playwright/experimental-ct-react';
import { test as betaTest } from './FlavoredBaseTest';
import { Locator, Page } from 'playwright-core';
import { TestChatMyMessageComponent } from './TestingComponents/TestChatMyMessageComponent';
import { isTestProfileMobile } from './utils/utils';

betaTest.describe('ChatMyMessageComponent rich text editor attachment tests', () => {
  betaTest.skip(({ isBetaBuild }) => !isBetaBuild, 'The tests should be run for beta flavor only');

  betaTest(
    'Edit box should not allow to save empty text when attachments are deleted',
    async ({ mount, page }, testInfo) => {
      const component = await mount(
        <TestChatMyMessageComponent content={''} contentType={'text'} isRichTextEditorEnabled={true} />
      );

      const testProfileName = testInfo.project.name;
      await startMessageEditing(component, page, testProfileName);
      await removeAttachmentAndSubmit(component, true);

      const editor = component.getByTestId('rooster-rich-text-editor');
      await expect(editor).toBeVisible();
      // make screenshot consistent
      await editor.click();

      await expect(component).toHaveScreenshot(
        'chat-my-message-component-rich-text-edit-box-empty-content-without-attachment.png'
      );
    }
  );

  betaTest(
    'Edit box should not allow to save empty html text when attachments are deleted',
    async ({ mount, page }, testInfo) => {
      const component = await mount(
        <TestChatMyMessageComponent content={'<div><br></div>'} contentType={'html'} isRichTextEditorEnabled={true} />
      );

      const testProfileName = testInfo.project.name;
      await startMessageEditing(component, page, testProfileName);
      await removeAttachmentAndSubmit(component, true);

      const editor = component.getByTestId('rooster-rich-text-editor');
      await expect(editor).toBeVisible();
      // make screenshot consistent
      await editor.click();

      await expect(component).toHaveScreenshot(
        'chat-my-message-component-rich-text-edit-box-empty-html-content-without-attachment.png'
      );
    }
  );

  betaTest(
    'Edit box should allow to save the message when content exists but attachments are deleted',
    async ({ mount, page }, testInfo) => {
      const component = await mount(
        <TestChatMyMessageComponent content={'test'} contentType={'text'} isRichTextEditorEnabled={true} />
      );

      const testProfileName = testInfo.project.name;
      await startMessageEditing(component, page, testProfileName);
      await removeAttachmentAndSubmit(component, true);

      await component.getByTestId('chat-composite-message').waitFor({ state: 'visible' });
      await expect(component.getByTestId('attachment-card')).toBeHidden();

      await expect(component).toHaveScreenshot(
        'chat-my-message-component-rich-text-edit-box-not-empty-message-content-without-attachment.png'
      );
    }
  );
});

betaTest.describe('ChatMyMessageComponent text editor attachment tests', () => {
  betaTest.skip(({ isBetaBuild }) => !isBetaBuild, 'The tests should be run for beta flavor only');

  betaTest(
    'Edit box should not allow to save empty text when attachments are deleted',
    async ({ mount, page }, testInfo) => {
      const component = await mount(
        <TestChatMyMessageComponent content={''} contentType={'text'} isRichTextEditorEnabled={false} />
      );

      const testProfileName = testInfo.project.name;
      await startMessageEditing(component, page, testProfileName);
      await removeAttachmentAndSubmit(component, false);

      const editor = component.getByRole('textbox');
      await expect(editor).toBeVisible();
      // make screenshot consistent
      await editor.click();

      await expect(component).toHaveScreenshot(
        'chat-my-message-component-edit-box-empty-content-without-attachment.png'
      );
    }
  );

  betaTest(
    'Edit box should allow to save empty html text when attachments are deleted',
    async ({ mount, page }, testInfo) => {
      await page.evaluate(() => document.fonts.ready);
      const component = await mount(
        <TestChatMyMessageComponent content={'<div><br></div>'} contentType={'html'} isRichTextEditorEnabled={false} />
      );

      const testProfileName = testInfo.project.name;
      await startMessageEditing(component, page, testProfileName);
      await removeAttachmentAndSubmit(component, false);

      // the plain edit box is not empty, so the message should be visible
      await component.getByTestId('chat-composite-message').waitFor({ state: 'visible' });

      await expect(component).toHaveScreenshot(
        'chat-my-message-component-edit-box-empty-html-content-without-attachment.png'
      );
    }
  );

  betaTest(
    'Edit box should allow to save the message when content exists but attachments are deleted',
    async ({ mount, page }, testInfo) => {
      const component = await await mount(
        <TestChatMyMessageComponent content={'test'} contentType={'text'} isRichTextEditorEnabled={false} />
      );
      const testProfileName = testInfo.project.name;
      await startMessageEditing(component, page, testProfileName);
      await removeAttachmentAndSubmit(component, false);

      await component.getByTestId('chat-composite-message').waitFor({ state: 'visible' });
      await expect(component.getByTestId('attachment-card')).toBeHidden();

      await expect(component).toHaveScreenshot(
        'chat-my-message-component-edit-box-not-empty-message-content-without-attachment.png'
      );
    }
  );
});

const startMessageEditing = async (component: Locator, page: Page, testProfileName: string): Promise<void> => {
  await component.evaluate(() => document.fonts.ready);
  const messageBody = component.getByTestId('chat-composite-message');
  await expect(messageBody).toBeVisible();
  await expect(component.getByTestId('message-timestamp')).toBeVisible();
  if (isTestProfileMobile(testProfileName)) {
    // Mobile scenario: click instead of hover
    await component.getByTestId('message-timestamp').click();
  } else {
    // Desktop scenario: hover
    await component.getByTestId('message-timestamp').hover();
  }

  await expect(component.getByTestId('chat-composite-message-action-icon')).toBeVisible();

  await component.getByTestId('chat-composite-message-action-icon').click();
  await page.getByTestId('chat-composite-message-contextual-menu-edit-action').click();
};

const removeAttachmentAndSubmit = async (component: Locator, isRichTexEditor: boolean): Promise<void> => {
  const editor = isRichTexEditor ? component.getByTestId('rooster-rich-text-editor') : component.getByRole('textbox');
  //check that the correct editor is shown (as tests can be faster than rich text editor initialization)
  await editor.waitFor({ state: 'visible' });
  const removeFileButton = component.getByRole('button', { name: 'Remove file' });
  // Check that the button is visible and enabled
  await removeFileButton.waitFor({ state: 'visible' });
  await expect(removeFileButton).toBeEnabled();
  await removeFileButton.click();

  const submitButtonTestId = isRichTexEditor
    ? 'chat-message-rich-text-edit-box-submit-button'
    : 'chat-message-edit-box-submit-button';

  await component.getByTestId('attachment-card').waitFor({ state: 'hidden' });

  await component.getByTestId(submitButtonTestId).click();
};
