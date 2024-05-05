// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { expect } from '@playwright/experimental-ct-react';
import { test as betaTest } from './FlavoredBaseTest';
import { RichTextSendBox } from '../../src/components/RichTextEditor/RichTextSendBox';
import { MessageThread, SendBox, defaultAttachmentMenuAction } from '../../src';
import { Icon } from '@fluentui/react';

betaTest.describe('Attachment tests', () => {
  betaTest.skip(({ isBetaBuild }) => !isBetaBuild, 'The tests should be run for beta flavor only');

  betaTest('Regular SendBox should show attachment progress correctly in group layout', async ({ mount }) => {
    const component = await mount(
      <SendBox
        onSendMessage={async () => {
          return;
        }}
        attachmentsWithProgress={[
          { progress: 0.65, id: 'id1', name: 'test1.pdf' },
          { progress: 1, id: 'id2', name: 'test2.docx' },
          { progress: 0, id: 'id3', name: 'test3' }
        ]}
      />
    );
    await component.evaluate(() => document.fonts.ready);
    await expect(component).toHaveScreenshot('attachment-in-sendbox-with-progress-group-layout.png');
  });

  betaTest('Regular SendBox should show attachment progress correctly in singular layout', async ({ mount }) => {
    const component = await mount(
      <SendBox
        onSendMessage={async () => {
          return;
        }}
        attachmentsWithProgress={[{ progress: 0.65, id: 'id1', name: 'test1.pdf' }]}
      />
    );
    await component.evaluate(() => document.fonts.ready);
    await expect(component).toHaveScreenshot('attachment-in-sendbox-with-progress-singlular-layout.png');
  });

  betaTest('Regular SendBox should show failed attachment', async ({ mount }) => {
    const component = await mount(
      <SendBox
        onSendMessage={async () => {
          return;
        }}
        attachmentsWithProgress={[
          {
            id: 'id1',
            name: 'test1.pdf',
            error: { message: 'test1.pdf upload failed, please try again later' }
          }
        ]}
      />
    );
    await component.evaluate(() => document.fonts.ready);
    await expect(component).toHaveScreenshot('attachment-in-sendbox-with-error.png');
  });

  betaTest('RichText SendBox should show attachment progress correctly in singular layout', async ({ mount }) => {
    const component = await mount(
      <RichTextSendBox
        onSendMessage={async () => {
          return;
        }}
        attachmentsWithProgress={[{ progress: 0.65, id: 'id1', name: 'test1.pdf' }]}
      />
    );
    await component.evaluate(() => document.fonts.ready);
    await expect(component).toHaveScreenshot('attachments-in-richtext-sendbox-with-progress-singular-layout.png');
  });

  betaTest('RichText SendBox should show attachment progress correctly in group layout', async ({ mount }) => {
    const component = await mount(
      <RichTextSendBox
        onSendMessage={async () => {
          return;
        }}
        attachmentsWithProgress={[
          { progress: 0.65, id: 'id1', name: 'test1.pdf' },
          { progress: 1, id: 'id2', name: 'test2.docx' },
          { progress: 0, id: 'id3', name: 'test3' }
        ]}
      />
    );
    await component.evaluate(() => document.fonts.ready);
    await expect(component).toHaveScreenshot('attachments-in-rich text-sendbox-with-progress-group-layout.png');
  });

  betaTest('RichText SendBox should show failed attachment', async ({ mount }) => {
    const component = await mount(
      <RichTextSendBox
        onSendMessage={async () => {
          return;
        }}
        attachmentsWithProgress={[
          {
            id: 'id1',
            name: 'test1.pdf',
            error: { message: 'test1.pdf upload failed, please try again later' }
          }
        ]}
      />
    );
    await component.evaluate(() => document.fonts.ready);
    await expect(component).toHaveScreenshot('attachment-in-richtext-sendbox-with-error.png');
  });

  betaTest('MessageThread should show single attachments that has sent out', async ({ mount }) => {
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
            content: 'Hello!',
            mine: true,
            attachments: [{ name: 'test1.pdf', id: 'id1', url: 'https://www.contoso.com/test1.pdf' }]
          }
        ]}
      />
    );
    await component.evaluate(() => document.fonts.ready);
    await expect(component).toHaveScreenshot('attachment-in-messagethread-mymessage-single.png');
  });

  betaTest('MessageThread should show multiple attachments that has sent out', async ({ mount }) => {
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
    await component.evaluate(() => document.fonts.ready);
    await expect(component).toHaveScreenshot('attachment-in-messagethread-mymessage-multiple.png');
  });

  betaTest('MessageThread should show single attachments that has sent out with custom action', async ({ mount }) => {
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
            content: 'Custom Action Test',
            mine: true,
            attachments: [{ name: 'test1.docx', id: 'id1', url: 'https://www.contoso.com/test1.docx' }]
          }
        ]}
        attachmentOptions={{
          downloadOptions: {
            actionsForAttachment: () => {
              return [
                defaultAttachmentMenuAction,
                {
                  icon: <Icon iconName="OpenAttachment" />,
                  name: 'open',
                  onClick: async () => {
                    return Promise.resolve();
                  }
                }
              ];
            }
          }
        }}
      />
    );
    await component.evaluate(() => document.fonts.ready);
    await expect(component).toHaveScreenshot('attachment-in-messagethread-mymessage-actions.png');
  });

  betaTest('MessageThread should show multiple attachments that has received', async ({ mount }) => {
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
    await component.evaluate(() => document.fonts.ready);
    await expect(component).toHaveScreenshot('attachment-in-messagethread-acs-message-multiple.png');
  });

  betaTest('MessageThread should show single attachment that has received', async ({ mount }) => {
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
            content: 'Hello!',
            mine: false,
            attachments: [{ name: 'test1.pdf', id: 'id1', url: 'https://www.contoso.com/test1.pdf' }]
          }
        ]}
      />
    );
    await component.evaluate(() => document.fonts.ready);
    await expect(component).toHaveScreenshot('attachment-in-messagethreadt-acs-message-single.png');
  });

  betaTest('MessageThread should show multiple attachments from Teams user that has received', async ({ mount }) => {
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
    await component.evaluate(() => document.fonts.ready);
    await expect(component).toHaveScreenshot('attachment-in-messagethread-teams-message-multiple.png');
  });

  betaTest('MessageThread should show single attachment from Teams user that has received', async ({ mount }) => {
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
            content: 'Hello!',
            mine: false,
            attachments: [{ name: 'test1.pdf', id: 'id1', url: 'https://www.contoso.com/test1.pdf' }]
          }
        ]}
      />
    );
    await component.evaluate(() => document.fonts.ready);
    await expect(component).toHaveScreenshot('attachment-in-messagethread-teams-message-single.png');
  });
});
