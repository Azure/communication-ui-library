// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { expect } from '@playwright/experimental-ct-react';
import { test as betaTest } from './FlavoredBaseTest';
import {
  ChatMyMessageComponent,
  ChatMyMessageComponentProps
} from '../../src/components/ChatMessage/MyMessageComponents/ChatMyMessageComponent';
import { COMPONENT_LOCALE_EN_US, MessageContentType } from '../../src';
import { Locator, Page } from 'playwright-core';

betaTest.describe('ChatMyMessageComponent rich text editor attachment tests', () => {
  betaTest.skip(({ isBetaBuild }) => !isBetaBuild, 'The tests should be run for beta flavor only');
  const localeStrings = COMPONENT_LOCALE_EN_US.strings;

  const props = (content: string, contentType: MessageContentType): ChatMyMessageComponentProps => {
    return {
      shouldOverlapAvatarAndMessage: false,
      onActionButtonClick: () => {},
      strings: localeStrings.messageThread,
      message: {
        messageType: 'chat',
        senderId: 'user2',
        senderDisplayName: 'Test user 2',
        messageId: Math.random().toString(),
        content: content,
        createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
        mine: true,
        attached: false,
        contentType: contentType,
        attachments: [
          {
            url: '',
            name: 'image.png',
            id: '1'
          }
        ]
      },
      userId: '1'
    };
  };

  betaTest('Edit box should not allow to save empty text when attachments are deleted', async ({ mount, page }) => {
    const component = await mount(<ChatMyMessageComponent {...props('', 'text')} isRichTextEditorEnabled={true} />);

    await startMessageEditing(component, page);
    await removeAttachmentAndSubmit(component, true);

    const editor = component.getByTestId('rooster-rich-text-editor');
    await expect(editor).toBeVisible();
    // make screenshot consistent
    await editor.click();

    await expect(component).toHaveScreenshot(
      'chat-my-message-component-rich-text-edit-box-empty-content-without-attachment.png'
    );
  });

  betaTest(
    'Edit box should not allow to save empty html text when attachments are deleted',
    async ({ mount, page }) => {
      const component = await mount(
        <ChatMyMessageComponent {...props('<div><br></div>', 'html')} isRichTextEditorEnabled={true} />
      );

      await startMessageEditing(component, page);
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
    async ({ mount, page }) => {
      const component = await mount(
        <ChatMyMessageComponent {...props('test', 'text')} isRichTextEditorEnabled={true} />
      );

      await startMessageEditing(component, page);
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

  const localeStrings = COMPONENT_LOCALE_EN_US.strings;

  const props = (content: string, contentType: MessageContentType): ChatMyMessageComponentProps => {
    return {
      shouldOverlapAvatarAndMessage: false,
      onActionButtonClick: () => {},
      strings: localeStrings.messageThread,
      message: {
        messageType: 'chat',
        senderId: 'user2',
        senderDisplayName: 'Test user 2',
        messageId: Math.random().toString(),
        content: content,
        createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
        mine: true,
        attached: false,
        contentType: contentType,
        attachments: [
          {
            url: '',
            name: 'image.png',
            id: '1'
          }
        ]
      },
      userId: '1'
    };
  };

  betaTest('Edit box should not allow to save empty text when attachments are deleted', async ({ mount, page }) => {
    const component = await mount(<ChatMyMessageComponent {...props('', 'text')} isRichTextEditorEnabled={false} />);

    await startMessageEditing(component, page);
    await removeAttachmentAndSubmit(component, false);

    const editor = component.getByRole('textbox');
    await expect(editor).toBeVisible();
    // make screenshot consistent
    await editor.click();

    await expect(component).toHaveScreenshot('chat-my-message-component-edit-box-empty-content-without-attachment.png');
  });

  betaTest('Edit box should allow to save empty html text when attachments are deleted', async ({ mount, page }) => {
    const component = await mount(
      <ChatMyMessageComponent {...props('<div><br></div>', 'html')} isRichTextEditorEnabled={false} />
    );

    await startMessageEditing(component, page);
    await removeAttachmentAndSubmit(component, false);

    // the plain edit box is not empty, so the message should be visible
    await component.getByTestId('chat-composite-message').waitFor({ state: 'visible' });

    await expect(component).toHaveScreenshot(
      'chat-my-message-component-edit-box-empty-html-content-without-attachment.png'
    );
  });

  betaTest(
    'Edit box should allow to save the message when content exists but attachments are deleted',
    async ({ mount, page }) => {
      const component = await await mount(
        <ChatMyMessageComponent {...props('test', 'text')} isRichTextEditorEnabled={false} />
      );
      await startMessageEditing(component, page);
      await removeAttachmentAndSubmit(component, false);

      await component.getByTestId('chat-composite-message').waitFor({ state: 'visible' });
      await expect(component.getByTestId('attachment-card')).toBeHidden();

      await expect(component).toHaveScreenshot(
        'chat-my-message-component-edit-box-not-empty-message-content-without-attachment.png'
      );
    }
  );
});

const startMessageEditing = async (component: Locator, page: Page): Promise<void> => {
  await component.evaluate(() => document.fonts.ready);
  const messageBody = component.getByTestId('chat-composite-message');
  await expect(messageBody).toBeVisible();
  await expect(component.getByTestId('message-timestamp')).toBeVisible();
  await component.getByTestId('message-timestamp').hover();

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
