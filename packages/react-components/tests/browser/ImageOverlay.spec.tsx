// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { expect } from '@playwright/experimental-ct-react';
import { test as betaTest } from './FlavoredBaseTest';
import { ImageOverlay, Message, MessageThread } from '../../src';

betaTest.describe('ImageOverlay tests', () => {
  betaTest.skip(({ isBetaBuild }) => !isBetaBuild, 'The tests should be run for beta flavor only');
  const messages: Message[] = [
    {
      messageType: 'chat',
      senderId: 'user3',
      content:
        '<p>How should I design my new house?</p><p><img alt="image" src="images/inlineImageExample1.png" itemscope="png" width="166.5625" height="250" id="SomeImageId1" style="vertical-align:bottom"></p><p><img alt="image" src="images/inlineImageExample2.png" itemscope="png" width="374.53183520599254" height="250" id="SomeImageId2" style="vertical-align:bottom"></p><p>&nbsp;</p>',
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

  betaTest('ImageOverlay should be shown correctly when loading', async ({ mount }) => {
    const component = await mount(
      <div>
        <MessageThread userId={'1'} messages={messages} />
        {
          <ImageOverlay
            isOpen={true}
            imageSrc={''}
            title="Image"
            onDismiss={() => {}}
            onDownloadButtonClicked={() => {}}
          />
        }
      </div>
    );
    await component.evaluate(() => document.fonts.ready);
    await expect(component).toHaveScreenshot('image-overlay-loading-stage.png');
  });
});
