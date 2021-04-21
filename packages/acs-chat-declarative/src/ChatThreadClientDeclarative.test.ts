// © Microsoft Corporation. All rights reserved.

import { ChatMessage, ChatMessageReadReceipt, ChatParticipant, ChatThreadClient } from '@azure/communication-chat';
import { ChatContext } from './ChatContext';
import { chatThreadClientDeclaratify } from './ChatThreadClientDeclarative';
import {
  createMockChatThreadClient,
  messageTemplate,
  mockMessages,
  mockParticipants,
  mockReadReceipts
} from './mocks/createMockChatThreadClient';

const threadId = '1';

const createMockChatClientAndDeclaratify = (context: ChatContext): ChatThreadClient => {
  const declarativeChatThreadClient = chatThreadClientDeclaratify(createMockChatThreadClient(threadId), context);
  return declarativeChatThreadClient;
};

describe('declarative chatThreadClient list iterators', () => {
  test('declarative listMessage should proxy listMessages iterator and store it in internal state', async () => {
    const context = new ChatContext();
    const messages = createMockChatClientAndDeclaratify(context).listMessages();
    const proxiedMessages: ChatMessage[] = [];
    for await (const message of messages) {
      proxiedMessages.push(message);
    }
    expect(proxiedMessages.length).toBe(mockMessages.length);
    expect(context.getState().threads.get(threadId)?.chatMessages.size).toBe(mockMessages.length);
  });

  test('declarative listMessage should proxy listMessages paged iterator and store it in internal state', async () => {
    const context = new ChatContext();
    const pages = createMockChatClientAndDeclaratify(context).listMessages().byPage();
    const proxiedMessages: ChatMessage[] = [];
    for await (const page of pages) {
      for (const message of page) {
        proxiedMessages.push(message);
      }
    }
    expect(proxiedMessages.length).toBe(mockMessages.length);
    expect(context.getState().threads.get(threadId)?.chatMessages.size).toBe(mockMessages.length);
  });

  test('declarative listParticipants should proxy listParticipants iterator and store it in internal state', async () => {
    const context = new ChatContext();
    const participants = createMockChatClientAndDeclaratify(context).listParticipants();
    const proxiedParticipants: ChatParticipant[] = [];
    for await (const participant of participants) {
      proxiedParticipants.push(participant);
    }
    expect(proxiedParticipants.length).toBe(mockParticipants.length);
    expect(context.getState().threads.get(threadId)?.participants.size).toBe(mockParticipants.length);
  });

  test('declarative listParticipants should proxy listParticipants paged iterator and store it in internal state', async () => {
    const context = new ChatContext();
    const pages = createMockChatClientAndDeclaratify(context).listParticipants().byPage();
    const proxiedParticipants: ChatParticipant[] = [];
    for await (const page of pages) {
      for (const participant of page) {
        proxiedParticipants.push(participant);
      }
    }
    expect(proxiedParticipants.length).toBe(mockParticipants.length);
    expect(context.getState().threads.get(threadId)?.participants.size).toBe(mockParticipants.length);
  });

  test('declarative listReadReceipts should proxy listReadReceipts iterator and store it in internal state', async () => {
    const context = new ChatContext();
    const readReceipts = createMockChatClientAndDeclaratify(context).listReadReceipts();
    const proxiedReadReceipt: ChatMessageReadReceipt[] = [];
    for await (const readReceipt of readReceipts) {
      proxiedReadReceipt.push(readReceipt);
    }
    expect(proxiedReadReceipt.length).toBe(mockReadReceipts.length);
    expect(context.getState().threads.get(threadId)?.readReceipts.length).toBe(mockReadReceipts.length);
  });

  test('declarative listReadReceipts should proxy listReadReceipts paged iterator and store it in internal state', async () => {
    const context = new ChatContext();
    const pages = createMockChatClientAndDeclaratify(context).listReadReceipts().byPage();
    const proxiedReadReceipt: ChatMessageReadReceipt[] = [];
    for await (const page of pages) {
      for (const readReceipt of page) {
        proxiedReadReceipt.push(readReceipt);
      }
    }
    expect(proxiedReadReceipt.length).toBe(mockReadReceipts.length);
    expect(context.getState().threads.get(threadId)?.readReceipts.length).toBe(mockReadReceipts.length);
  });

  test('declarative listReadReceipts should generate latestReadTime properly', async () => {
    const context = new ChatContext();
    const pages = createMockChatClientAndDeclaratify(context).listReadReceipts().byPage();
    for await (const _page of pages);
    const latestReadTime = context.getState().threads.get(threadId)?.latestReadTime;

    const maxReadTime = mockReadReceipts[mockReadReceipts.length - 1].readOn;
    expect(latestReadTime && latestReadTime).toBe(maxReadTime);
  });
});

describe('declarative chatThreadClient basic api functions', () => {
  test('set internal store correctly when proxy getMessage', async () => {
    const context = new ChatContext();
    const message = await createMockChatClientAndDeclaratify(context).getMessage('MessageId1');

    const messageInContext = context.getState().threads.get(threadId)?.chatMessages.get('MessageId1');
    expect(messageInContext).toBeDefined();
    expect(message).toMatchObject(messageInContext ?? {});
  });

  test('set internal store correctly when proxy sendMessage', async () => {
    const context = new ChatContext();
    const content = 'test';
    const sendMessagePromise = createMockChatClientAndDeclaratify(context).sendMessage({ content });

    const chatMessages = Array.from(context.getState().threads.get(threadId)?.chatMessages.values() ?? []);

    expect(chatMessages.length).toBe(1);
    expect(chatMessages[0].clientMessageId).toBeDefined();
    expect(chatMessages[0].status).toBe('sending');

    // await sending message result
    const result = await sendMessagePromise;
    const chatMessagesAfterSending = Array.from(context.getState().threads.get(threadId)?.chatMessages.values() ?? []);

    expect(chatMessagesAfterSending[0].id).toBe(result.id);
    expect(chatMessagesAfterSending[0].content?.message).toBe(content);
    expect(chatMessagesAfterSending[0].status).toBe('delivered');
  });

  test('set internal store correctly when proxy sendMessage', async () => {
    const context = new ChatContext();
    const content = 'fail';

    const sendMessagePromise = createMockChatClientAndDeclaratify(context).sendMessage({ content });

    // await sending message result
    let failResult = false;
    try {
      await sendMessagePromise;
    } catch {
      failResult = true;
    }

    const chatMessagesAfterSending = Array.from(context.getState().threads.get(threadId)?.chatMessages.values() ?? []);

    expect(failResult).toBeTruthy();
    expect(chatMessagesAfterSending[0].content?.message).toBe(content);
    expect(chatMessagesAfterSending[0].status).toBe('failed');
  });

  test('should be able to proxy add participants and remove participants', async () => {
    const context = new ChatContext();
    const mockClient = createMockChatClientAndDeclaratify(context);
    const participants = [{ user: { communicationUserId: 'User1' } }, { user: { communicationUserId: 'User2' } }];

    await mockClient.addParticipants({
      participants
    });

    const participantsInContext = context.getState().threads.get(threadId)?.participants;
    expect(participantsInContext?.size).toBe(2);

    // Test removal function
    await mockClient.removeParticipant(participants[0].user);

    const participantsAfterRemoval = Array.from(context.getState().threads.get(threadId)?.participants.values() ?? []);
    expect(participantsAfterRemoval.length).toBe(1);
    expect(participantsAfterRemoval[0]).toEqual(participants[1]);
  });

  test('should be able to proxy updateMessage', async () => {
    const context = new ChatContext();
    const mockClient = createMockChatClientAndDeclaratify(context);
    context.setChatMessage(threadId, messageTemplate);
    const content = 'updatedContent';

    await mockClient.updateMessage(messageTemplate.id, { content });

    const chatMessage = context.getState().threads.get(threadId)?.chatMessages.get(messageTemplate.id);

    expect(chatMessage).toBeDefined();
    chatMessage && expect(chatMessage.content?.message).toBe(content);
  });

  test('should be able to proxy updateThread', async () => {
    const context = new ChatContext();
    const mockClient = createMockChatClientAndDeclaratify(context);
    const topic = 'updatedTopic';

    await mockClient.updateThread({ topic });

    const threadInfo = context.getState().threads.get(threadId)?.threadInfo;

    expect(threadInfo).toBeDefined();
    threadInfo && expect(threadInfo.topic).toBe(topic);
  });

  test('should be able to delete message with local messageId', async () => {
    const context = new ChatContext();
    const clientMessageId = 'clientId1';
    context.setChatMessage(threadId, { ...messageTemplate, clientMessageId, id: '' });
    const mockClient = createMockChatClientAndDeclaratify(context);

    mockClient.deleteMessage(clientMessageId);

    const chatMessages = context.getState().threads.get(threadId)?.chatMessages;

    expect(chatMessages?.size).toBe(0);
  });

  test('should be able to delete message with messageId', async () => {
    const context = new ChatContext();
    context.setChatMessage(threadId, messageTemplate);
    const mockClient = createMockChatClientAndDeclaratify(context);

    mockClient.deleteMessage(messageTemplate.id);

    const chatMessages = context.getState().threads.get(threadId)?.chatMessages;

    expect(chatMessages?.size).toBe(0);
  });
});
