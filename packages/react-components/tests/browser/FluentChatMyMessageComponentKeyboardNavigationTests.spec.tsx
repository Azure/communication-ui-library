// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { expect } from '@playwright/experimental-ct-react';
import { test as betaTest } from './FlavoredBaseTest';
import { COMPONENT_LOCALE_EN_US } from '../../src';
import { Locator, Page } from 'playwright-core';
import { FluentChatMyMessageComponent } from '../../src/components/ChatMessage/MyMessageComponents/FluentChatMyMessageComponent';
import { FluentChatMessageComponentWrapperProps } from '../../src/components/ChatMessage/MessageComponents/FluentChatMessageComponent';

betaTest.describe('FluentChatMyMessageComponent keyboard navigation tests', () => {
  const localeStrings = COMPONENT_LOCALE_EN_US.strings;

  const props: FluentChatMessageComponentWrapperProps = {
    key: '1',
    statusToRender: undefined,
    shouldOverlapAvatarAndMessage: false,
    onActionButtonClick: () => {},
    strings: localeStrings.messageThread,
    onRenderMessageStatus: undefined,
    styles: undefined,
    defaultStatusRenderer: () => <></>,
    message: {
      content: 'Hello World!',
      messageId: '1',
      attached: true,
      messageType: 'chat',
      contentType: 'html',
      createdOn: new Date(),
      mine: true
    },
    userId: '1'
  };

  betaTest('User can navigate to message and edit message using keyboard', async ({ mount, page }) => {
    const component = await mount(<FluentChatMyMessageComponent {...props} />);

    await showMoreMenuButton(component, page);
    await openMoreMenu(component, page);

    // start editing
    await page.keyboard.press('Enter');
    await expect(component.getByTestId('chat-message-edit-box-cancel-button')).toBeVisible();
    await expect(component.getByTestId('chat-message-edit-box-submit-button')).toBeVisible();

    await page.keyboard.press('Tab');
    await expect(component.getByTestId('chat-message-edit-box-cancel-button')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(component.getByTestId('chat-message-edit-box-submit-button')).toBeFocused();
    await page.keyboard.press('Enter');

    const messageBody = component.getByTestId('chat-composite-message');
    await expect(messageBody).toBeVisible();
    await expect(messageBody).toBeFocused();

    await expect(component.getByTestId('chat-composite-message-action-icon')).toBeVisible();
  });

  betaTest('User can navigate to message and cancel message editing using keyboard', async ({ mount, page }) => {
    const component = await mount(<FluentChatMyMessageComponent {...props} />);

    await showMoreMenuButton(component, page);
    await openMoreMenu(component, page);

    // start editing
    await page.keyboard.press('Enter');
    await expect(component.getByTestId('chat-message-edit-box-cancel-button')).toBeVisible();
    await expect(component.getByTestId('chat-message-edit-box-submit-button')).toBeVisible();

    await page.keyboard.press('Tab');
    await expect(component.getByTestId('chat-message-edit-box-cancel-button')).toBeFocused();
    await page.keyboard.press('Enter');

    const messageBody = component.getByTestId('chat-composite-message');
    await expect(messageBody).toBeVisible();
    await expect(messageBody).toBeFocused();

    await expect(component.getByTestId('chat-composite-message-action-icon')).toBeVisible();
  });
});

const showMoreMenuButton = async (component: Locator, page: Page): Promise<void> => {
  await component.evaluate(() => document.fonts.ready);
  const messageBody = component.getByTestId('chat-composite-message');
  await expect(messageBody).toBeVisible();
  await page.keyboard.press('Tab');

  await expect(messageBody).toBeFocused();

  await expect(component.getByTestId('chat-composite-message-action-icon')).toBeVisible();
};

const openMoreMenu = async (component: Locator, page: Page): Promise<void> => {
  // navigate to message menu
  await page.keyboard.press('Enter');
  await expect(component.getByTestId('chat-composite-message-action-icon')).toBeFocused();

  // open message menu
  await page.keyboard.press('Enter');

  // page is used here as more menu is not part of the component
  const editButton = page.getByTestId('chat-composite-message-contextual-menu-edit-action');
  await expect(editButton).toBeVisible();
  await expect(page.getByTestId('chat-composite-message-contextual-menu-remove-action')).toBeVisible();
  await expect(editButton).toBeFocused();
};
