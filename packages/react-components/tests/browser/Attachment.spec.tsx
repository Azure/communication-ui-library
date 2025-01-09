// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { expect } from '@playwright/experimental-ct-react';
import { test as betaTest } from './FlavoredBaseTest';
import { RichTextSendBox } from '../../src/components/RichTextEditor/RichTextSendBox';
import { MessageThread, SendBox } from '../../src';
import { TestMessageThreadWithCustomAttachmentActions } from './TestingComponents/TestMessageThreadWithCustomAttachmentActions';
import { Locator, Page } from 'playwright-core';

betaTest.describe('Attachment tests', () => {
  betaTest.skip(({ isBetaBuild }) => !isBetaBuild, 'The tests should be run for beta flavor only');

  betaTest('Regular SendBox should show attachment progress correctly in group layout', async ({ mount, page }) => {
    const component = await mount(
      <SendBox
        onSendMessage={async () => {
          return;
        }}
        attachments={[
          { progress: 0.65, id: 'id1', name: 'test1.pdf' },
          { progress: 1, id: 'id2', name: 'test2.docx' },
          { progress: 0, id: 'id3', name: 'test3' }
        ]}
      />
    );
    await checkAttachmentsLoaded(component, page);
    await expect(component).toHaveScreenshot('attachment-in-sendbox-with-progress-group-layout.png');
  });

  betaTest('Regular SendBox should show attachment progress correctly in singular layout', async ({ mount, page }) => {
    const component = await mount(
      <SendBox
        onSendMessage={async () => {
          return;
        }}
        attachments={[{ progress: 0.65, id: 'id1', name: 'test1.pdf' }]}
      />
    );
    await checkAttachmentsLoaded(component, page);
    await expect(component).toHaveScreenshot('attachment-in-sendbox-with-progress-singlular-layout.png');
  });

  betaTest('Regular SendBox should show failed attachment', async ({ mount, page }) => {
    const component = await mount(
      <SendBox
        onSendMessage={async () => {
          return;
        }}
        attachments={[
          {
            id: 'id1',
            name: 'test1.pdf',
            error: { message: 'test1.pdf upload failed, please try again later' }
          }
        ]}
      />
    );
    await checkFailedAttachmentsComponentsLoaded(component, page);
    await expect(component).toHaveScreenshot('attachment-in-sendbox-with-error.png');
  });

  betaTest('RichText SendBox should show attachment progress correctly in singular layout', async ({ mount, page }) => {
    const component = await mount(
      <RichTextSendBox
        onSendMessage={async () => {
          return;
        }}
        attachments={[{ progress: 0.65, id: 'id1', name: 'test1.pdf' }]}
      />
    );
    await checkAttachmentsLoaded(component, page);
    await expect(component).toHaveScreenshot('attachments-in-richtext-sendbox-with-progress-singular-layout.png');
  });

  betaTest('RichText SendBox should show attachment progress correctly in group layout', async ({ mount, page }) => {
    const component = await mount(
      <RichTextSendBox
        onSendMessage={async () => {
          return;
        }}
        attachments={[
          { progress: 0.65, id: 'id1', name: 'test1.pdf' },
          { progress: 1, id: 'id2', name: 'test2.docx' },
          { progress: 0, id: 'id3', name: 'test3' }
        ]}
      />
    );
    await checkAttachmentsLoaded(component, page);
    await expect(component).toHaveScreenshot('attachments-in-richtext-sendbox-with-progress-group-layout.png');
  });

  betaTest('RichText SendBox should show failed attachment', async ({ mount, page }) => {
    const component = await mount(
      <RichTextSendBox
        onSendMessage={async () => {
          return;
        }}
        attachments={[
          {
            id: 'id1',
            name: 'test1.pdf',
            error: { message: 'test1.pdf upload failed, please try again later' }
          }
        ]}
      />
    );
    await checkFailedAttachmentsComponentsLoaded(component, page);
    await expect(component).toHaveScreenshot('attachment-in-richtext-sendbox-with-error.png');
  });

  betaTest('MessageThread should show single attachments that has sent out', async ({ mount, page }) => {
    const component = await mount(
      <MessageThread
        userId={'8:acs:12345'}
        messages={[
          {
            contentType: 'text',
            messageType: 'chat',
            messageId: '1234567890',
            createdOn: new Date('01-01-2024'),
            senderId: '8:acs:12345',
            senderDisplayName: 'John Doe',
            content: 'Hello!',
            mine: true,
            attachments: [{ name: 'test1.pdf', id: 'id1', url: 'https://www.contoso.com/test1.pdf' }]
          }
        ]}
      />
    );
    await checkAttachmentsLoaded(component, page);
    await expect(component).toHaveScreenshot('attachment-in-messagethread-mymessage-single.png');
  });

  betaTest('MessageThread should show multiple attachments that has sent out', async ({ mount, page }) => {
    const component = await mount(
      <MessageThread
        userId={'8:acs:12345'}
        messages={[
          {
            contentType: 'text',
            messageType: 'chat',
            messageId: '1234567890',
            createdOn: new Date('01-01-2024'),
            senderId: '8:acs:12345',
            senderDisplayName: 'John Doe',
            content: 'Hello!',
            mine: true,
            attachments: [
              { name: 'test1.pdf', id: 'id1', url: 'https://www.contoso.com/test1.pdf' },
              { name: 'test2.docx', id: 'id2', url: 'https://www.contoso.com/test2.docx' },
              { name: 'test3.txt', id: 'id3', url: 'https://www.contoso.com/test3.txt' }
            ]
          }
        ]}
      />
    );
    await checkAttachmentsLoaded(component, page);
    await expect(component).toHaveScreenshot('attachment-in-messagethread-mymessage-multiple.png');
  });

  betaTest(
    'MessageThread should show single attachments that has sent out with custom action',
    async ({ mount, page }) => {
      // due to limitation of playwright, a mock component is required
      // we can't test directly on the MessageThread component
      const component = await mount(<TestMessageThreadWithCustomAttachmentActions />);
      await checkAttachmentsLoaded(component, page);
      await expect(component).toHaveScreenshot('attachment-in-messagethread-mymessage-custom-actions.png');
      await component.getByRole('button').click();
      await page.getByLabel('Download').waitFor({ state: 'visible' });
      await expect(component).toHaveScreenshot('attachment-in-messagethread-mymessage-custom-actions-clicked.png');
    }
  );

  betaTest('MessageThread should show multiple attachments that has received', async ({ mount, page }) => {
    const component = await mount(
      <MessageThread
        userId={'8:acs:12345'}
        messages={[
          {
            contentType: 'text',
            messageType: 'chat',
            messageId: '1234567890',
            createdOn: new Date('01-01-2024'),
            senderId: '8:acs:12345',
            senderDisplayName: 'John Doe',
            content: 'Hello!',
            mine: false,
            attachments: [
              { name: 'test1.pdf', id: 'id1', url: 'https://www.contoso.com/test1.pdf' },
              { name: 'test2.docx', id: 'id2', url: 'https://www.contoso.com/test2.docx' },
              { name: 'test3.txt', id: 'id3', url: 'https://www.contoso.com/test3.txt' }
            ]
          }
        ]}
      />
    );
    await checkAttachmentsLoaded(component, page);
    await expect(component).toHaveScreenshot('attachment-in-messagethread-acs-message-multiple.png');
  });

  betaTest('MessageThread should show single attachment that has received', async ({ mount, page }) => {
    const component = await mount(
      <MessageThread
        userId={'8:acs:12345'}
        messages={[
          {
            contentType: 'text',
            messageType: 'chat',
            messageId: '1234567890',
            createdOn: new Date('01-01-2024'),
            senderId: '8:acs:12345',
            senderDisplayName: 'John Doe',
            content: 'Hello!',
            mine: false,
            attachments: [{ name: 'test1.pdf', id: 'id1', url: 'https://www.contoso.com/test1.pdf' }]
          }
        ]}
      />
    );
    await checkAttachmentsLoaded(component, page);
    await expect(component).toHaveScreenshot('attachment-in-messagethread-acs-message-single.png');
  });

  betaTest(
    'MessageThread should show multiple attachments from Teams user that has received',
    async ({ mount, page }) => {
      const component = await mount(
        <MessageThread
          userId={'8:acs:12345'}
          messages={[
            {
              contentType: 'text',
              messageType: 'chat',
              messageId: '1234567890',
              createdOn: new Date('01-01-2024'),
              senderId: '8:orgid:1234',
              senderDisplayName: 'John Doe',
              content: 'Hello!',
              mine: false,
              attachments: [
                { name: 'test1.pdf', id: 'id1', url: 'https://www.contoso.com/test1.pdf' },
                { name: 'test2.docx', id: 'id2', url: 'https://www.contoso.com/test2.docx' },
                { name: 'test3.txt', id: 'id3', url: 'https://www.contoso.com/test3.txt' }
              ]
            }
          ]}
        />
      );
      await checkAttachmentsLoaded(component, page);
      await expect(component).toHaveScreenshot('attachment-in-messagethread-teams-message-multiple.png');
    }
  );

  betaTest('MessageThread should show single attachment from Teams user that has received', async ({ mount, page }) => {
    const component = await mount(
      <MessageThread
        userId={'8:acs:12345'}
        messages={[
          {
            contentType: 'text',
            messageType: 'chat',
            messageId: '1234567890',
            createdOn: new Date('01-01-2024'),
            senderId: '8:orgid:1234',
            senderDisplayName: 'John Doe',
            content: 'Hello!',
            mine: false,
            attachments: [{ name: 'test1.pdf', id: 'id1', url: 'https://www.contoso.com/test1.pdf' }]
          }
        ]}
      />
    );
    await checkAttachmentsLoaded(component, page);
    await expect(component).toHaveScreenshot('attachment-in-messagethread-teams-message-single.png');
  });
});

const checkAttachmentsLoaded = async (component: Locator, page: Page): Promise<void> => {
  await page.waitForLoadState();
  await component.evaluate(() => document.fonts.ready);
  await component.getByTestId('attachment-card').first().waitFor({ state: 'visible' });
};

const checkFailedAttachmentsComponentsLoaded = async (component: Locator, page: Page): Promise<void> => {
  await page.waitForLoadState();
  await component.evaluate(() => document.fonts.ready);
  await component.getByTestId('send-box-message-bar').waitFor({ state: 'visible' });
};
