// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { expect } from '@playwright/experimental-ct-react';
import { test as betaTest } from './FlavoredBaseTest';
import { Message, MessageThread } from '../../src';

betaTest.describe('MessageThread inline image tests', () => {
  betaTest.skip(({ isBetaBuild }) => !isBetaBuild, 'The tests should be run for beta flavor only');

  betaTest('MessageThread inline image should show grey box when loading', async ({ mount }) => {
    const component = await mount(<MessageThread userId={'1'} messages={getMessages('')} />);
    await component.evaluate(() => document.fonts.ready);
    await component.getByRole('img', { name: 'image' }).waitFor({ state: 'visible' });
    await expect(component).toHaveScreenshot('message-thread-inline-image-loading-stage.png');
  });

  betaTest('MessageThread inline image should show broken image icon with invalid src', async ({ mount }) => {
    const component = await mount(<MessageThread userId={'1'} messages={getMessages('http://')} />);
    await component.evaluate(() => document.fonts.ready);
    await component.getByRole('img', { name: 'image' }).waitFor({ state: 'visible' });
    await expect(component).toHaveScreenshot('message-thread-inline-image-broken-image.png');
  });

  const getMessages = (imgSrc: string): Message[] => {
    const messages: Message[] = [
      {
        messageType: 'chat',
        senderId: 'user3',
        content: `<p>How should I design my new house?</p><p><img alt="image" src="${imgSrc}" itemscope="png" width="374" height="250" id="SomeImageId2" style="vertical-align:bottom; aspect-ratio: 374 / 250"></p><p>&nbsp;</p>`,
        senderDisplayName: 'Miguel Garcia',
        messageId: Math.random().toString(),
        createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
        mine: false,
        attached: false,
        contentType: 'html'
      },
      {
        messageType: 'chat',
        senderId: 'user2',
        senderDisplayName: 'Robert Tolbert',
        messageId: Math.random().toString(),
        content: 'Cool, I love the second one!',
        createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
        mine: true,
        attached: false,
        contentType: 'text'
      }
    ];
    return messages;
  };
});
