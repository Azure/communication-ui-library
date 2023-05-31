// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
/* @conditional-compile-remove(mention) */
import { v1 as generateGUID } from 'uuid';
import { MessageThread } from './MessageThread';
import { ChatMessage } from '../types';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessage } from '../types';
/* @conditional-compile-remove(teams-inline-images) */
import { AttachmentDownloadResult, FileMetadata } from './FileDownloadCards';
import { createTestLocale, renderWithLocalization } from './utils/testUtils';
/* @conditional-compile-remove(date-time-customization) @conditional-compile-remove(data-loss-prevention) */
import { COMPONENT_LOCALE_EN_US } from '../localization/locales';
/* @conditional-compile-remove(date-time-customization) */
import { screen } from '@testing-library/react';
/* @conditional-compile-remove(teams-inline-images) */
import { render, waitFor } from '@testing-library/react';
/* @conditional-compile-remove(data-loss-prevention) */ /* @conditional-compile-remove(teams-inline-images) */
import { registerIcons } from '@fluentui/react';
/* @conditional-compile-remove(mention) */
import { MessageStatus } from '@internal/acs-ui-common';
/* @conditional-compile-remove(mention) */
import { fireEvent } from '@testing-library/react';
/* @conditional-compile-remove(mention) */
import userEvent from '@testing-library/user-event';
/* @conditional-compile-remove(mention) */
import { Mention } from './MentionPopover';

const twentyFourHoursAgo = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date;
};

/* @conditional-compile-remove(date-time-customization) */
const onDisplayDateTimeStringLocale = (messageDate: Date): string => {
  const todayDate = new Date();

  const yesterdayDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - 1);
  if (messageDate > yesterdayDate) {
    return '24 hours ago';
  } else {
    return ' ';
  }
};

/* @conditional-compile-remove(date-time-customization) */
const onDisplayDateTimeString = (messageDate: Date): string => {
  const todayDate = new Date();

  const yesterdayDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - 1);
  if (messageDate > yesterdayDate) {
    return 'Yesterday';
  } else {
    return ' ';
  }
};

describe('Message date should be formatted correctly', () => {
  test('Should locale string for "Yesterday"', async () => {
    const testLocale = createTestLocale({ messageThread: { yesterday: 'MOCK YESTERDAY' } });
    const sampleMessage: ChatMessage = {
      messageType: 'chat',

      senderId: 'user3',
      senderDisplayName: 'Sam Fisher',
      messageId: Math.random().toString(),
      content: 'Thanks for making my job easier.',
      createdOn: twentyFourHoursAgo(),
      mine: false,
      attached: false,
      contentType: 'text'
    };
    const { container } = renderWithLocalization(
      <MessageThread userId="user1" messages={[sampleMessage]} showMessageDate={true} />,
      testLocale
    );
    expect(container.textContent).toContain(testLocale.strings.messageThread.yesterday);
  });
});

/* @conditional-compile-remove(date-time-customization) */
describe('Message date should be customized by onDisplayDateTimeString passed through locale', () => {
  test('Message date should be localized to "24 hours ago"', async () => {
    const testLocale = {
      strings: COMPONENT_LOCALE_EN_US.strings,
      onDisplayDateTimeString: onDisplayDateTimeStringLocale
    };
    const sampleMessage: ChatMessage = {
      messageType: 'chat',

      senderId: 'user3',
      senderDisplayName: 'Sam Fisher',
      messageId: Math.random().toString(),
      content: 'Thanks for making my job easier.',
      createdOn: twentyFourHoursAgo(),
      mine: false,
      attached: false,
      contentType: 'text'
    };
    renderWithLocalization(
      <MessageThread userId="user1" messages={[sampleMessage]} showMessageDate={true} />,
      testLocale
    );
    expect(screen.getByText('24 hours ago')).toBeTruthy();
  });
});

/* @conditional-compile-remove(date-time-customization) */
describe('onDisplayDateTimeString passed through messagethread should overwrite onDisplayDateTimeString from locale', () => {
  test('Message date should be localized to "yesterday"', async () => {
    const testLocale = {
      strings: COMPONENT_LOCALE_EN_US.strings,
      onDisplayDateTimeString: onDisplayDateTimeStringLocale
    };
    const sampleMessage: ChatMessage = {
      messageType: 'chat',
      senderId: 'user3',
      senderDisplayName: 'Sam Fisher',
      messageId: Math.random().toString(),
      content: 'Thanks for making my job easier.',
      createdOn: twentyFourHoursAgo(),
      mine: false,
      attached: false,
      contentType: 'text'
    };
    renderWithLocalization(
      <MessageThread
        userId="user1"
        messages={[sampleMessage]}
        showMessageDate={true}
        onDisplayDateTimeString={onDisplayDateTimeString}
      />,
      testLocale
    );
    expect(screen.getByText('Yesterday')).toBeTruthy();
  });
});

/* @conditional-compile-remove(data-loss-prevention) */
describe('Message blocked should display default blocked text correctly', () => {
  beforeAll(() => {
    registerIcons({
      icons: {
        datalosspreventionprohibited: <></>
      }
    });
  });

  test('Should locale string for default message blocked by policy"', async () => {
    const testLocale = createTestLocale({ messageThread: { yesterday: Math.random().toString() } });
    const sampleMessage: BlockedMessage = {
      messageType: 'blocked',

      senderId: 'user3',
      senderDisplayName: 'Sam Fisher',
      messageId: Math.random().toString(),
      createdOn: twentyFourHoursAgo(),
      mine: false,
      attached: false
    };
    renderWithLocalization(
      <MessageThread userId="user1" messages={[sampleMessage]} showMessageDate={true} />,
      testLocale
    );
    expect(screen.getByText(testLocale.strings.messageThread.blockedWarningText)).toBeTruthy();
  });
});

/* @conditional-compile-remove(teams-inline-images) */
describe('Message should display inline image correctly', () => {
  test('Message richtext/html img src should be correct', async () => {
    const imgId1 = 'SomeImageId1';
    const imgId2 = 'SomeImageId2';
    const expectedImgSrc1 = 'http://localhost/someImgSrcUrl1';
    const expectedImgSrc2 = 'http://localhost/someImgSrcUrl2';
    const expectedOnFetchAttachmentCount = 2;
    let onFetchAttachmentCount = 0;
    const sampleMessage: ChatMessage = {
      messageType: 'chat',
      senderId: 'user3',
      content: `<p>Test</p><p><img alt="image" src="" itemscope="png" width="166.5625" height="250" id="${imgId1}" style="vertical-align:bottom"></p><p><img alt="image" src="" itemscope="png" width="166.5625" height="250" id="${imgId2}" style="vertical-align:bottom"></p><p>&nbsp;</p>`,
      senderDisplayName: 'Miguel Garcia',
      messageId: Math.random().toString(),
      createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false,
      contentType: 'html',
      attachedFilesMetadata: [
        {
          id: imgId1,
          name: imgId1,
          attachmentType: 'teamsInlineImage',
          extension: 'png',
          url: expectedImgSrc1,
          previewUrl: expectedImgSrc1
        },
        {
          id: imgId2,
          name: imgId2,
          attachmentType: 'teamsInlineImage',
          extension: 'png',
          url: expectedImgSrc2,
          previewUrl: expectedImgSrc2
        }
      ]
    };
    const onFetchAttachment = async (attachment: FileMetadata): Promise<AttachmentDownloadResult[]> => {
      onFetchAttachmentCount++;
      return [
        {
          blobUrl: attachment.previewUrl ?? ''
        }
      ];
    };

    const { container } = render(
      <MessageThread userId="user1" messages={[sampleMessage]} onFetchAttachments={onFetchAttachment} />
    );

    await waitFor(async () => {
      expect(container.querySelector(`#${imgId1}`)?.getAttribute('src')).toEqual(expectedImgSrc1);
      expect(container.querySelector(`#${imgId2}`)?.getAttribute('src')).toEqual(expectedImgSrc2);
      expect(onFetchAttachmentCount).toEqual(expectedOnFetchAttachmentCount);
    });
  });
});

/* @conditional-compile-remove(mention) */
describe('Message should display Mention correctly', () => {
  const MSFT_MENTION = 'msft-mention';

  beforeAll(() => {
    registerIcons({
      icons: {
        chatmessageoptions: <></>,
        messageedit: <></>,
        messageremove: <></>,
        messageresend: <></>,
        editboxcancel: <></>,
        editboxsubmit: <></>
      }
    });
  });

  test('Message should include Mention', async () => {
    const user1Id = 'user1';
    const user2Id = 'user2';
    const user2Name = 'Robert Tolbert';

    const messages: ChatMessage[] = [
      {
        messageType: 'chat',
        senderId: user1Id,
        senderDisplayName: 'Kat Larsson',
        messageId: generateGUID(),
        content: `Hey <msft-mention id="${user2Id}" displayText="${user2Name}"></msft-mention>, can you help me with my internet connection?`,
        createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
        mine: false,
        attached: false,
        status: 'seen' as MessageStatus,
        contentType: 'html'
      },
      {
        messageType: 'chat',
        senderId: user2Id,
        senderDisplayName: 'Robert Tolbert',
        messageId: generateGUID(),
        content: 'Absolutely! What seems to be the problem?',
        createdOn: new Date('2019-04-13T00:00:00.000+08:11'),
        mine: true,
        attached: false,
        contentType: 'html'
      }
    ];

    const { container } = render(
      <MessageThread
        userId={user2Id}
        messages={messages}
        mentionOptions={{
          displayOptions: {
            onRenderMention: (mention, defaultOnMentionRender) => {
              return <span key={generateGUID()}>{defaultOnMentionRender(mention)}</span>;
            }
          }
        }}
      />
    );

    expect(container.querySelector(`#${user2Id}`)?.nodeName.toLowerCase()).toEqual(MSFT_MENTION);
    expect(container.querySelector(`#${user2Id}`)?.textContent).toEqual(user2Name);
  });

  test('Edited Message should include two Mentions', async () => {
    const user1Id = 'user1';
    const user2Id = 'user2';
    const user3Id = 'user3';

    const user2Name = 'Robert Tolbert';
    const user3Name = 'Sam Fisher';

    const messages: ChatMessage[] = [
      {
        messageType: 'chat',
        senderId: user1Id,
        senderDisplayName: 'Kat Larsson',
        messageId: generateGUID(),
        content: `Hey <msft-mention id="${user2Id}" displayText="${user2Name}"></msft-mention>, can you help me with my internet connection?`,
        createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
        mine: false,
        attached: false,
        status: 'seen' as MessageStatus,
        contentType: 'html'
      },
      {
        messageType: 'chat',
        senderId: user2Id,
        senderDisplayName: 'Robert Tolbert',
        messageId: generateGUID(),
        content: 'Absolutely! What seems to be the problem?',
        createdOn: new Date('2019-04-13T00:00:00.000+08:11'),
        mine: true,
        attached: false,
        contentType: 'html'
      }
    ];

    const { container, rerender } = render(
      <MessageThread
        userId={user2Id}
        messages={messages}
        mentionOptions={{
          displayOptions: {
            onRenderMention: (mention, defaultOnMentionRender) => {
              return <span key={generateGUID()}>{defaultOnMentionRender(mention)}</span>;
            }
          }
        }}
      />
    );

    expect(container.querySelector(`#${user2Id}`)?.nodeName.toLowerCase()).toEqual(MSFT_MENTION);
    expect(container.querySelector(`#${user2Id}`)?.textContent).toEqual(user2Name);

    // edit message
    const message1ContentAfterEdit = `Hey <msft-mention id="${user2Id}" displayText="${user2Name}"></msft-mention> and <msft-mention id="${user3Id}" displayText="${user3Name}"></msft-mention>, can you help me with my internet connection?`;
    messages[0].content = message1ContentAfterEdit;
    messages[0].editedOn = new Date('2019-04-13T00:01:00.000+08:10');
    const expectedOnRenderMentionCount = 2;
    let onRenderMentionCount = 0;

    rerender(
      <MessageThread
        userId={user2Id}
        messages={messages}
        mentionOptions={{
          displayOptions: {
            onRenderMention: (mention, defaultOnMentionRender) => {
              onRenderMentionCount++;
              return <span key={generateGUID()}>{defaultOnMentionRender(mention)}</span>;
            }
          }
        }}
      />
    );

    expect(onRenderMentionCount).toEqual(expectedOnRenderMentionCount);
    expect(container.querySelector(`#${user2Id}`)?.nodeName.toLowerCase()).toEqual(MSFT_MENTION);
    expect(container.querySelector(`#${user2Id}`)?.textContent).toEqual(user2Name);
    expect(container.querySelector(`#${user3Id}`)?.nodeName.toLowerCase()).toEqual(MSFT_MENTION);
    expect(container.querySelector(`#${user3Id}`)?.textContent).toEqual(user3Name);
  });

  test('Edit Message with @ will show MentionPopover and mentions in edited message', async () => {
    const user1Id = 'user1';
    const user2Id = 'user2';

    const user1Name = 'Kat Larsson';

    const messages: ChatMessage[] = [
      {
        messageType: 'chat',
        senderId: user2Id,
        senderDisplayName: 'Robert Tolbert',
        messageId: generateGUID(),
        content: 'Absolutely! What seems to be the problem?',
        createdOn: new Date('2019-04-13T00:00:00.000+08:11'),
        mine: true,
        attached: false,
        contentType: 'html'
      }
    ];

    const expectedOnUpdateMessageCount = 1;
    let onUpdateMessageCount = 0;
    const onUpdateMessageCallback = (messageId, content): Promise<void> => {
      const msgIdx = messages.findIndex((m) => m.messageId === messageId);
      const message = messages[msgIdx];
      message.content = content;
      message.editedOn = new Date(Date.now());
      messages[msgIdx] = message;
      onUpdateMessageCount++;
      return Promise.resolve();
    };

    const onQueryUpdated = async (query: string): Promise<Mention[]> => {
      return Promise.resolve(
        [
          {
            id: user1Id,
            displayText: user1Name
          },
          {
            id: 'everyone',
            displayText: 'Everyone'
          }
        ].filter((suggestion) => suggestion.displayText.toLocaleLowerCase().startsWith(query.toLocaleLowerCase()))
      );
    };

    const { container, rerender } = render(
      <MessageThread
        userId={user2Id}
        messages={messages}
        onUpdateMessage={onUpdateMessageCallback}
        mentionOptions={{
          displayOptions: {
            onRenderMention: (mention, defaultOnMentionRender) => {
              return <span key={generateGUID()}>{defaultOnMentionRender(mention)}</span>;
            }
          },
          lookupOptions: {
            onQueryUpdated: onQueryUpdated
          }
        }}
      />
    );

    // Find message bubble does not contain mention yet
    const messageBubble = container.querySelector('[data-ui-id="chat-composite-message"]');
    if (!messageBubble) {
      fail('it should not reach here');
    }
    expect(messageBubble.innerHTML).not.toContain(user1Name);
    expect(messageBubble.innerHTML).not.toContain(MSFT_MENTION);

    // Click on ... button to trigger context menu
    const menuButton = container.querySelector('[data-ui-id="chat-composite-message-action-icon"]');
    if (!menuButton) {
      fail('it should not reach here');
    }
    fireEvent.click(menuButton);

    // Click on Edit ContextMenuItem
    const editButton = await screen.findByText('Edit');
    fireEvent.click(editButton);

    // Type ' @' in edit box to show mentions popover menu
    const editBox = await screen.getByPlaceholderText('Edit your message');
    await waitFor(async () => {
      userEvent.keyboard(' @');
    });

    // Check that Everyone is an option
    const everyoneMentionContextMenuItem = await screen.findByText('Everyone');
    expect(everyoneMentionContextMenuItem.classList.contains('ms-Persona-primaryText')).toBe(true);

    // Check that user1Name is an option
    const user1MentionContextMenuItem = await screen.findByText(user1Name);
    expect(user1MentionContextMenuItem.classList.contains('ms-Persona-primaryText')).toBe(true);

    // Select mention from popover for user1Name, verify plain text not contain mention html tag
    fireEvent.click(user1MentionContextMenuItem);
    expect(editBox.innerHTML).toContain(user1Name);
    expect(editBox.innerHTML).not.toContain(MSFT_MENTION);

    // Submit edited message
    const submitButton = await screen.findByLabelText('Submit');
    fireEvent.click(submitButton);

    // Veerify message has new edited content includes mention html tag
    await waitFor(async () => {
      expect(onUpdateMessageCount).toEqual(expectedOnUpdateMessageCount);
      const editedMessageContentWithMention = messages[0].content;
      expect(editedMessageContentWithMention).toContain(user1Name);
      expect(editedMessageContentWithMention).toContain(MSFT_MENTION);
    });

    rerender(
      <MessageThread
        userId={user2Id}
        messages={messages}
        onUpdateMessage={onUpdateMessageCallback}
        mentionOptions={{
          displayOptions: {
            onRenderMention: (mention, defaultOnMentionRender) => {
              return <span key={generateGUID()}>{defaultOnMentionRender(mention)}</span>;
            }
          },
          lookupOptions: {
            onQueryUpdated: onQueryUpdated
          }
        }}
      />
    );

    // After re-render with edited message, verify content includes mentions html tag
    const messageBubbleAfterRerender = container.querySelector('[data-ui-id="chat-composite-message"]');
    if (!messageBubbleAfterRerender) {
      fail('it should not reach here');
    }
    expect(messageBubbleAfterRerender.innerHTML).toContain(user1Name);
    expect(messageBubbleAfterRerender.innerHTML).toContain(MSFT_MENTION);
  });
});
