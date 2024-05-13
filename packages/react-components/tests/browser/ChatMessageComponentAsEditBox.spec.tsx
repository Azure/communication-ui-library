// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { expect } from '@playwright/experimental-ct-react';
import { test as betaTest } from './FlavoredBaseTest';
import { COMPONENT_LOCALE_EN_US, ChatMessageComponentAsRichTextEditBox, Message } from '../../src';
import { MessageStatus } from '@internal/acs-ui-common';

const formatButtonId = 'rich-text-input-box-format-button';

betaTest.describe('ChatMessageComponentAsRichTextEditBox tests', () => {
  betaTest.skip(({ isBetaBuild }) => !isBetaBuild, 'The tests should be run for beta flavor only');
  const message: Message = {
    messageType: 'chat',
    senderId: 'user1',
    senderDisplayName: 'Kat Larsson',
    messageId: Math.random().toString(),
    content: 'Hi everyone, I created this awesome group chat for us!',
    createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
    mine: true,
    attached: false,
    status: 'seen' as MessageStatus,
    contentType: 'html'
  };

  betaTest('ChatMessageComponentAsRichTextEditBox should be shown correctly', async ({ mount }) => {
    const component = await mount(
      <ChatMessageComponentAsRichTextEditBox
        message={message}
        onSubmit={async () => {
          return;
        }}
        strings={COMPONENT_LOCALE_EN_US.strings.messageThread}
      />
    );
    await component.evaluate(() => document.fonts.ready);
    await expect(component).toHaveScreenshot('chat-message-component-as-rich-text-edit-box-without-format-toolbar.png');
    const formatButton = component.getByTestId(formatButtonId);
    await formatButton.hover();
    await expect(component).toHaveScreenshot('chat-message-component-as-rich-text-edit-box-hover.png');

    await formatButton.click();
    //move mouse to the format button so the screenshots are consistent
    await formatButton.hover();
    await expect(component).toHaveScreenshot('chat-message-component-as-rich-text-edit-box-with-format-toolbar.png');
  });

  betaTest('ChatMessageComponentAsRichTextEditBox should be shown correctly with system error', async ({ mount }) => {
    const component = await mount(
      <ChatMessageComponentAsRichTextEditBox
        message={{ ...message, failureReason: 'System Error' }}
        onSubmit={async () => {
          return;
        }}
        strings={COMPONENT_LOCALE_EN_US.strings.messageThread}
      />
    );
    await component.evaluate(() => document.fonts.ready);
    await expect(component).toHaveScreenshot(
      'chat-message-component-as-rich-text-edit-box-with-system-error-without-format-toolbar.png'
    );
    const formatButton = component.getByTestId(formatButtonId);
    await formatButton.click();
    //move mouse to the format button so the screenshots are consistent
    await formatButton.hover();
    await expect(component).toHaveScreenshot(
      'chat-message-component-as-rich-text-edit-box-with-system-error-and-format-toolbar.png'
    );
  });
});
