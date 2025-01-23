// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { expect } from '@playwright/experimental-ct-react';
import { test as betaTest } from './FlavoredBaseTest';
import { COMPONENT_LOCALE_EN_US } from '../../src';
import {
  FluentChatMessageComponentWrapperProps,
  FluentChatMessageComponent
} from '../../src/components/ChatMessage/MessageComponents/FluentChatMessageComponent';

betaTest.describe('FluentChatMessageComponent keyboard navigation tests', () => {
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
      mine: false
    },
    userId: '1'
  };

  betaTest('User can navigate to message using keyboard', async ({ mount, page }) => {
    const component = await mount(<FluentChatMessageComponent {...props} />);

    await page.keyboard.press('Tab');
    const messageBody = component.getByTestId('chat-composite-message');
    await expect(messageBody).toBeVisible();
    await expect(messageBody).toBeFocused();

    // check that focus stays on the message and not moved anywhere after additional Enter key press
    await page.keyboard.press('Enter');
    await expect(messageBody).toBeFocused();
  });
});
