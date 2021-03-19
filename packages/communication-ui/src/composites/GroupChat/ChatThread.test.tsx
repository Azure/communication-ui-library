// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { CLICK_TO_LOAD_MORE_MESSAGES, NEW_MESSAGES, UNABLE_TO_LOAD_MORE_MESSAGES } from '../../constants';
import { MessageStatus, ChatMessage } from '../../types/ChatMessage';
import { ChatThreadComponent, ChatThreadComponentBase } from './ChatThread';

const originalClientHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight');
const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');
const originalDocumentHasFocus = document.hasFocus;
let container: HTMLDivElement;
beforeEach(() => {
  container = document.createElement('div');
  document.hasFocus = () => true;
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 500 });
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 500 });
  document.body.appendChild(container);
});

afterEach(() => {
  if (container !== null) {
    document.hasFocus = originalDocumentHasFocus;
    if (originalClientHeight !== undefined) {
      Object.defineProperty(HTMLElement.prototype, 'clientHeight', originalClientHeight);
    }
    if (originalClientWidth !== undefined) {
      Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth);
    }
    unmountComponentAtNode(container);
    container.remove();
  }
});

const mockSendReadReceipt = jest.fn((): Promise<void> => Promise.resolve());

const userId = '1';
const emptyChatMessages: ChatMessage[] = [];
const oneSameUserChatMessagesDelivered: ChatMessage[] = [
  {
    messageId: '1',
    content: '1',
    createdOn: new Date('2020-12-15T00:00:00Z'),
    senderId: '1',
    senderDisplayName: 'User1',
    statusToRender: MessageStatus.DELIVERED
  }
];
const oneDifferentUserChatMessagesUnseen: ChatMessage[] = [
  {
    messageId: '1',
    content: '1',
    createdOn: new Date('2020-12-15T00:00:00Z'),
    senderId: '2',
    senderDisplayName: 'User2',
    statusToRender: MessageStatus.DELIVERED
  }
];
const multipleChatMessages: ChatMessage[] = [
  {
    messageId: '1',
    content: '1',
    createdOn: new Date('2020-12-15T00:00:00Z'),
    senderId: '1',
    senderDisplayName: 'User1',
    statusToRender: MessageStatus.SEEN
  },
  {
    messageId: '2',
    content: '2',
    createdOn: new Date('2020-12-15T00:01:01Z'),
    senderId: '2',
    senderDisplayName: 'User2',
    statusToRender: MessageStatus.DELIVERED
  },
  {
    messageId: '3',
    content: '3',
    createdOn: new Date('2020-12-15T00:02:01Z'),
    senderId: '2',
    senderDisplayName: 'User2',
    statusToRender: MessageStatus.DELIVERED
  },
  {
    messageId: '4',
    content: '4',
    createdOn: new Date('2020-12-15T00:03:01Z'),
    senderId: '3',
    senderDisplayName: 'User3',
    statusToRender: MessageStatus.DELIVERED
  },
  {
    messageId: '5',
    content: '5',
    createdOn: new Date('2020-12-15T00:04:01Z'),
    senderId: '1',
    senderDisplayName: 'User1',
    statusToRender: MessageStatus.DELIVERED
  },
  {
    messageId: '6',
    content: '6',
    createdOn: new Date('2020-12-15T00:05:01Z'),
    senderId: '1',
    senderDisplayName: 'User1',
    statusToRender: MessageStatus.SEEN
  },
  {
    messageId: '7',
    content: '7',
    createdOn: new Date('2020-12-15T00:06:01Z'),
    senderId: '2',
    senderDisplayName: 'User2',
    statusToRender: MessageStatus.SEEN
  },
  {
    messageId: '8',
    content: '8',
    createdOn: new Date('2020-12-15T00:07:01Z'),
    senderId: '1',
    senderDisplayName: 'User1',
    statusToRender: MessageStatus.DELIVERED
  },
  {
    messageId: '9',
    content: '9',
    createdOn: undefined,
    senderId: '1',
    senderDisplayName: 'User1',
    statusToRender: MessageStatus.FAILED
  }
];

const generateMessages = (amount: number): ChatMessage[] => {
  const messages: ChatMessage[] = [];
  for (let i = 1; i <= amount; i++) {
    const date = new Date('2020-12-15T00:00:01Z');
    date.setSeconds(date.getSeconds() + i);
    messages.push({
      messageId: i.toString(),
      content: i.toString(),
      createdOn: date,
      senderId: i.toString(),
      senderDisplayName: 'User' + i.toString(),
      statusToRender: MessageStatus.DELIVERED
    });
  }
  return messages;
};

describe('ChatThread tests', () => {
  test('ChatThread should render no message when chatMessages passed in is empty', () => {
    act(() => {
      render(
        <ChatThreadComponent
          userId={userId}
          chatMessages={emptyChatMessages}
          disableReadReceipt={false}
          sendReadReceipt={mockSendReadReceipt}
        />,
        container
      );
    });

    const renderedChat = container.querySelector('ul');
    expect(renderedChat).toBeDefined();
    expect(renderedChat?.children.length).toBe(0);
    expect(mockSendReadReceipt).toHaveBeenCalledTimes(0);
  });

  test('ChatThread should render 1 message when chatMessages passed in as 1 message', () => {
    act(() => {
      render(
        <ChatThreadComponent
          userId={userId}
          chatMessages={oneSameUserChatMessagesDelivered}
          disableReadReceipt={false}
          sendReadReceipt={mockSendReadReceipt}
        />,
        container
      );
    });

    const renderedChat = container.querySelector('ul');
    expect(renderedChat).toBeDefined();
    expect(renderedChat?.children.length).toBe(1);
    expect(mockSendReadReceipt).toHaveBeenCalledTimes(0);
  });

  test('ChatThread should send read receipt when loaded and message is from another user is un seen', () => {
    act(() => {
      render(
        <ChatThreadComponent
          userId={userId}
          chatMessages={oneDifferentUserChatMessagesUnseen}
          disableReadReceipt={false}
          sendReadReceipt={mockSendReadReceipt}
        />,
        container
      );
    });

    const renderedChat = container.querySelector('ul');
    expect(renderedChat).toBeDefined();
    expect(renderedChat?.children.length).toBe(1);
    expect(mockSendReadReceipt).toHaveBeenCalled();
  });

  test('ChatThread should be able to render multiple messages from multiple users', () => {
    act(() => {
      render(
        <ChatThreadComponent
          userId={userId}
          chatMessages={multipleChatMessages}
          disableReadReceipt={false}
          sendReadReceipt={mockSendReadReceipt}
        />,
        container
      );
    });

    const renderedChat = container.querySelector('ul');
    expect(renderedChat).toBeDefined();
    expect(renderedChat?.children.length).toBe(9);
    expect(mockSendReadReceipt).toHaveBeenCalled();
  });

  test('ChatThread should be able to render multiple messages with variety of statusToRender from multiple users', () => {
    act(() => {
      render(
        <ChatThreadComponent
          userId={userId}
          chatMessages={multipleChatMessages}
          disableReadReceipt={false}
          sendReadReceipt={mockSendReadReceipt}
        />,
        container
      );
    });

    const renderedChat = container.querySelector('ul');
    expect(renderedChat).toBeDefined();
    expect(renderedChat?.children.length).toBe(9);
    expect(mockSendReadReceipt).toHaveBeenCalled();
  });

  test('ChatThread will only display a limited number of messages (for this test is default 100)', () => {
    const oneThousandMessages = generateMessages(1000);
    act(() => {
      render(
        <ChatThreadComponent
          userId={userId}
          chatMessages={oneThousandMessages}
          disableReadReceipt={false}
          sendReadReceipt={mockSendReadReceipt}
        />,
        container
      );
    });

    const renderedChat = container.querySelector('ul');
    expect(renderedChat).toBeDefined();
    expect(renderedChat?.children.length).toBe(100);
    expect(mockSendReadReceipt).toHaveBeenCalled();
  });

  test('ChatThread will show load more messages button when there are more messages and user scrolled way up', () => {
    const oneThousandMessages: ChatMessage[] = generateMessages(1000);
    act(() => {
      render(
        <ChatThreadComponent
          userId={userId}
          chatMessages={oneThousandMessages}
          disableReadReceipt={false}
          sendReadReceipt={mockSendReadReceipt}
        />,
        container
      );
    });

    act(() => {
      const renderedChat = container.querySelector('ul');
      if (renderedChat !== null) {
        renderedChat.scrollTop = 0;
        renderedChat.dispatchEvent(new Event('scroll'));
      }
    });

    const renderedChat = container.querySelector('ul');
    expect(renderedChat).toBeDefined();
    expect(renderedChat?.children.length).toBe(100);
    const loadMoreMessagesButton = container.querySelector('button');
    expect(loadMoreMessagesButton).toBeDefined();
    const loadMoreMessagesChildSpans = loadMoreMessagesButton?.getElementsByTagName('span');
    expect(loadMoreMessagesChildSpans).toBeDefined();
    const loadMoreMessagesSpan = loadMoreMessagesChildSpans?.[0];
    expect(loadMoreMessagesSpan).toBeDefined();
    expect(loadMoreMessagesSpan?.innerHTML).toEqual(CLICK_TO_LOAD_MORE_MESSAGES);
    expect(mockSendReadReceipt).toHaveBeenCalled();
  });

  test('ChatThread will load more messages when load more messages button clicked', () => {
    const oneThousandMessages = generateMessages(1000);
    act(() => {
      render(
        <ChatThreadComponent
          userId={userId}
          chatMessages={oneThousandMessages}
          disableReadReceipt={false}
          sendReadReceipt={mockSendReadReceipt}
        />,
        container
      );
    });

    act(() => {
      const renderedChat = container.querySelector('ul');
      if (renderedChat !== null) {
        renderedChat.scrollTop = 0;
        renderedChat.dispatchEvent(new Event('scroll'));
      }
    });

    act(() => {
      const loadMoreMessagesButton = container.querySelector('button');
      loadMoreMessagesButton?.click();
    });

    const renderedChat = container.querySelector('ul');
    expect(renderedChat).toBeDefined();
    expect(renderedChat?.children.length).toBe(200); // Should be 15 but is 25 after loading more messages
    expect(mockSendReadReceipt).toHaveBeenCalled();
  });

  test('ChatThread will say you have reached the beginning there are no more messages and user scrolled way up', () => {
    act(() => {
      render(
        <ChatThreadComponent
          userId={userId}
          chatMessages={multipleChatMessages}
          disableReadReceipt={false}
          sendReadReceipt={mockSendReadReceipt}
        />,
        container
      );
    });

    act(() => {
      const renderedChat = container.querySelector('ul');
      if (renderedChat !== null) {
        renderedChat.scrollTop = 0;
        renderedChat.dispatchEvent(new Event('scroll'));
      }
    });

    const renderedChat = container.querySelector('ul');
    expect(renderedChat).toBeDefined();
    expect(renderedChat?.children.length).toBe(9);
    const noMoreMessagesButton = container.querySelector('button');
    expect(noMoreMessagesButton).toBeDefined();
    const noMoreMessagesChildSpans = noMoreMessagesButton?.getElementsByTagName('span');
    expect(noMoreMessagesChildSpans).toBeDefined();
    const noMoreMessagesSpan = noMoreMessagesChildSpans?.[0];
    expect(noMoreMessagesSpan).toBeDefined();
    expect(noMoreMessagesSpan?.innerHTML).toEqual(UNABLE_TO_LOAD_MORE_MESSAGES);
    expect(mockSendReadReceipt).toHaveBeenCalled();
  });

  test('ChatThread show NewMessages button when user is scrolled up and got new message', () => {
    const twentyMessages = generateMessages(20);
    const twentyOneMessages = generateMessages(21);

    act(() => {
      render(
        <ChatThreadComponentBase
          userId={userId}
          chatMessages={twentyMessages}
          disableReadReceipt={false}
          sendReadReceipt={mockSendReadReceipt}
        />,
        container
      );
    });

    act(() => {
      const renderedChat = container.querySelector('ul');

      if (renderedChat !== null) {
        renderedChat.scrollTop = -1000;
        renderedChat.dispatchEvent(new Event('scroll'));
      }
    });

    act(() => {
      render(
        <ChatThreadComponentBase
          userId={userId}
          chatMessages={twentyOneMessages}
          disableReadReceipt={false}
          sendReadReceipt={mockSendReadReceipt}
        />,
        container
      );
    });

    const renderedChat = container.querySelector('ul');
    expect(renderedChat).toBeDefined();
    expect(renderedChat?.children.length).toBe(21);
    const newMessagesButton = container.querySelector('button');
    expect(newMessagesButton).toBeDefined();
    const newMessagesChildSpans = newMessagesButton?.getElementsByTagName('span');
    expect(newMessagesChildSpans).toBeDefined();
    const newMoreMessagesSpan = newMessagesChildSpans?.[0];
    expect(newMoreMessagesSpan).toBeDefined();
    expect(newMoreMessagesSpan?.innerHTML.includes(NEW_MESSAGES)).toBe(true);
    expect(mockSendReadReceipt).toHaveBeenCalled();
  });
});
