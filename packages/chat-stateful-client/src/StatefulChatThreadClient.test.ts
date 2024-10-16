// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { ChatMessage, ChatMessageReadReceipt, ChatParticipant, ChatThreadClient } from '@azure/communication-chat';
import { ChatContext } from './ChatContext';
import { chatThreadClientDeclaratify } from './StatefulChatThreadClient';
import {
  createMockChatThreadClient,
  messageTemplate,
  mockMessages,
  mockParticipants,
  mockReadReceipts
} from './mocks/createMockChatThreadClient';
import { StateChangeListener, createMockChatClient, defaultClientArgs, failingPagedAsyncIterator } from './TestHelpers';
import { _createStatefulChatClientWithDeps, StatefulChatClient } from './StatefulChatClient';
import { ChatError } from './ChatClientState';

const threadId = '1';

jest.mock('@azure/communication-chat');

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
    expect(Object.values(context.getState().threads[threadId]?.chatMessages ?? {}).length).toBe(mockMessages.length);
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
    expect(Object.values(context.getState().threads[threadId]?.chatMessages ?? {}).length).toBe(mockMessages.length);
  });

  test('declarative listParticipants should proxy listParticipants iterator and store it in internal state', async () => {
    const context = new ChatContext();
    const participants = createMockChatClientAndDeclaratify(context).listParticipants();
    const proxiedParticipants: ChatParticipant[] = [];
    for await (const participant of participants) {
      proxiedParticipants.push(participant);
    }
    expect(proxiedParticipants.length).toBe(mockParticipants.length);
    expect(Object.keys(context.getState().threads[threadId]?.participants ?? {}).length).toBe(mockParticipants.length);
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
    expect(Object.keys(context.getState().threads[threadId]?.participants ?? {}).length).toBe(mockParticipants.length);
  });

  test('declarative listReadReceipts should proxy listReadReceipts iterator and store it in internal state', async () => {
    const context = new ChatContext();
    const readReceipts = createMockChatClientAndDeclaratify(context).listReadReceipts();
    const proxiedReadReceipt: ChatMessageReadReceipt[] = [];
    for await (const readReceipt of readReceipts) {
      proxiedReadReceipt.push(readReceipt);
    }
    expect(proxiedReadReceipt.length).toBe(mockReadReceipts.length);
    expect(context.getState().threads[threadId]?.readReceipts.length).toBe(mockReadReceipts.length);
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
    expect(context.getState().threads[threadId]?.readReceipts.length).toBe(mockReadReceipts.length);
  });

  test('declarative listReadReceipts should generate latestReadTime properly', async () => {
    const context = new ChatContext();
    const pages = createMockChatClientAndDeclaratify(context).listReadReceipts().byPage();
    // eslint-disable-next-line curly
    for await (const _page of pages);
    const latestReadTime = context.getState().threads[threadId]?.latestReadTime;

    const maxReadTime = mockReadReceipts[mockReadReceipts.length - 1]?.readOn;
    expect(latestReadTime && latestReadTime).toBe(maxReadTime);
  });
});

describe('declarative chatThreadClient basic api functions', () => {
  test('set internal store correctly when proxy getMessage', async () => {
    const context = new ChatContext();
    const message = await createMockChatClientAndDeclaratify(context).getMessage('MessageId1');

    const messageInContext = context.getState().threads[threadId]?.chatMessages['MessageId1'];
    expect(messageInContext).toBeDefined();
    expect(message).toMatchObject(messageInContext ?? {});
  });

  test('set internal store correctly when proxy sendMessage', async () => {
    const context = new ChatContext();
    const content = 'test';
    const sendMessagePromise = createMockChatClientAndDeclaratify(context).sendMessage({ content });

    const chatMessages = Object.values(context.getState().threads[threadId]?.chatMessages ?? {});

    expect(chatMessages.length).toBe(1);
    expect(chatMessages[0]?.clientMessageId).toBeDefined();
    expect(chatMessages[0]?.status).toBe('sending');

    // await sending message result
    const result = await sendMessagePromise;
    const chatMessagesAfterSending = Object.values(context.getState().threads[threadId]?.chatMessages ?? {});

    expect(chatMessagesAfterSending[0]?.id).toBe(result.id);
    expect(chatMessagesAfterSending[0]?.content?.message).toBe(content);
    expect(chatMessagesAfterSending[0]?.status).toBe('delivered');
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

    const chatMessagesAfterSending = Object.values(context.getState().threads[threadId]?.chatMessages ?? {});

    expect(failResult).toBeTruthy();
    expect(chatMessagesAfterSending[0]?.content?.message).toBe(content);
    expect(chatMessagesAfterSending[0]?.status).toBe('failed');
  });

  test('should be able to proxy add participants and remove participants', async () => {
    const context = new ChatContext();
    const mockClient = createMockChatClientAndDeclaratify(context);
    const participants = [{ id: { communicationUserId: 'User1' } }, { id: { communicationUserId: 'User2' } }];

    await mockClient.addParticipants({
      participants
    });

    const participantsInContext = context.getState().threads[threadId]?.participants ?? {};
    expect(Object.keys(participantsInContext).length).toBe(2);

    // Test removal function
    await mockClient.removeParticipant({ communicationUserId: 'User1' });

    const participantsAfterRemoval = Array.from(
      Object.values(context.getState().threads[threadId]?.participants ?? {}) ?? []
    );
    expect(participantsAfterRemoval.length).toBe(1);
    expect(participantsAfterRemoval[0]).toEqual(participants[1]);
  });

  test('should be able to proxy updateMessage', async () => {
    const context = new ChatContext();
    const mockClient = createMockChatClientAndDeclaratify(context);
    context.setChatMessage(threadId, messageTemplate);
    const content = 'updatedContent';

    await mockClient.updateMessage(messageTemplate.id, { content });

    const chatMessage = context.getState().threads[threadId]?.chatMessages[messageTemplate.id];

    expect(chatMessage).toBeDefined();
    chatMessage && expect(chatMessage.content?.message).toBe(content);
  });

  test('should be able to proxy updateThread', async () => {
    const context = new ChatContext();
    const mockClient = createMockChatClientAndDeclaratify(context);
    const topic = 'updatedTopic';

    await mockClient.updateTopic(topic);

    const properties = context.getState().threads[threadId]?.properties;

    expect(properties).toBeDefined();
    properties && expect(properties.topic).toBe(topic);
  });

  test('should be able to delete message with local messageId', async () => {
    const context = new ChatContext();
    const clientMessageId = 'clientId1';
    context.setChatMessage(threadId, { ...messageTemplate, clientMessageId, id: '' });
    const mockClient = createMockChatClientAndDeclaratify(context);

    mockClient.deleteMessage(clientMessageId);

    const chatMessages = context.getState().threads[threadId]?.chatMessages;

    expect(Object.values(chatMessages ?? {}).length).toBe(0);
  });

  test('should be able to delete message with messageId', async () => {
    const context = new ChatContext();
    context.setChatMessage(threadId, messageTemplate);
    const mockClient = createMockChatClientAndDeclaratify(context);

    mockClient.deleteMessage(messageTemplate.id);

    const chatMessages = context.getState().threads[threadId]?.chatMessages;

    expect(Object.values(chatMessages ?? {}).length).toBe(0);
  });
});

describe('stateful chatThreadClient tees errors to state', () => {
  test('when updateTopic fails', async () => {
    const chatThreadClient = createMockChatThreadClient('threadId');
    chatThreadClient.updateTopic = async (): Promise<void> => {
      throw Error('injected error');
    };
    const client = createMockChatClientWithChatThreadClient(chatThreadClient);

    // Ignore state changes as a side-effect of thread creation on first call to getChatThreadClient().
    client.getChatThreadClient('threadId');

    const listener = new StateChangeListener(client);

    await expect(client.getChatThreadClient('threadId').updateTopic('topic')).rejects.toThrow();

    expect(listener.onChangeCalledCount).toBe(1);
    const latestError = listener.state.latestErrors['ChatThreadClient.updateTopic'];
    expect(latestError).toBeDefined();
  });
});

describe('stateful chatThreadClient correctly wraps errors', () => {
  test('when getProperties fails', async () => {
    const chatThreadClient = createMockChatThreadClient('threadId');
    chatThreadClient.getProperties = async (): Promise<any> => {
      throw Error('injected error');
    };
    const client = createMockChatClientWithChatThreadClient(chatThreadClient);
    await expect(client.getChatThreadClient('threadId').getProperties()).rejects.toThrow(
      new ChatError('ChatThreadClient.getProperties', new Error('injected error'))
    );
  });

  test('when updateTopic fails', async () => {
    const chatThreadClient = createMockChatThreadClient('threadId');
    chatThreadClient.updateTopic = async (): Promise<any> => {
      throw Error('injected error');
    };
    const client = createMockChatClientWithChatThreadClient(chatThreadClient);
    await expect(client.getChatThreadClient('threadId').updateTopic('topic')).rejects.toThrow(
      new ChatError('ChatThreadClient.updateTopic', new Error('injected error'))
    );
  });

  test('when listMessages fails immediately', async () => {
    const chatThreadClient = createMockChatThreadClient('threadId');
    chatThreadClient.listMessages = (): any => {
      throw Error('injected error');
    };
    const client = createMockChatClientWithChatThreadClient(chatThreadClient);
    expect(() => {
      client.getChatThreadClient('threadId').listMessages();
    }).toThrow(new ChatError('ChatThreadClient.listMessages', new Error('injected error')));
  });

  test('when listMessages fails while iterating items', async () => {
    const chatThreadClient = createMockChatThreadClient('threadId');
    chatThreadClient.listMessages = (): PagedAsyncIterableIterator<any> => {
      return failingPagedAsyncIterator(new Error('injected error'));
    };
    const client = createMockChatClientWithChatThreadClient(chatThreadClient);
    const iter = client.getChatThreadClient('threadId').listMessages();
    await expect(iter.next()).rejects.toThrow(
      new ChatError('ChatThreadClient.listMessages', new Error('injected error'))
    );
    await expect(iter.byPage().next()).rejects.toThrow(
      new ChatError('ChatThreadClient.listMessages', new Error('injected error'))
    );
  });

  test('when getMessage fails', async () => {
    const chatThreadClient = createMockChatThreadClient('threadId');
    chatThreadClient.getMessage = async (): Promise<any> => {
      throw Error('injected error');
    };
    const client = createMockChatClientWithChatThreadClient(chatThreadClient);
    await expect(client.getChatThreadClient('threadId').getMessage('threadId')).rejects.toThrow(
      new ChatError('ChatThreadClient.getMessage', new Error('injected error'))
    );
  });

  test('when sendTypingNotification fails', async () => {
    const chatThreadClient = createMockChatThreadClient('threadId');
    chatThreadClient.sendTypingNotification = async (): Promise<boolean> => {
      throw new Error('injected error');
    };
    const client = createMockChatClientWithChatThreadClient(chatThreadClient);
    await expect(client.getChatThreadClient('threadId').sendTypingNotification()).rejects.toThrow(
      new ChatError('ChatThreadClient.sendTypingNotification', new Error('injected error'))
    );
  });

  test('when sendMessage fails', async () => {
    const chatThreadClient = createMockChatThreadClient('threadId');
    chatThreadClient.sendMessage = async (): Promise<any> => {
      throw Error('injected error');
    };
    const client = createMockChatClientWithChatThreadClient(chatThreadClient);
    await expect(client.getChatThreadClient('threadId').sendMessage({ content: '' })).rejects.toThrow(
      new ChatError('ChatThreadClient.sendMessage', new Error('injected error'))
    );
  });

  test('when updateMessage fails', async () => {
    const chatThreadClient = createMockChatThreadClient('threadId');
    chatThreadClient.updateMessage = async (): Promise<any> => {
      throw Error('injected error');
    };
    const client = createMockChatClientWithChatThreadClient(chatThreadClient);
    await expect(client.getChatThreadClient('threadId').updateMessage('')).rejects.toThrow(
      new ChatError('ChatThreadClient.updateMessage', new Error('injected error'))
    );
  });

  test('when deleteMessage fails', async () => {
    const chatThreadClient = createMockChatThreadClient('threadId');
    chatThreadClient.deleteMessage = async (): Promise<any> => {
      throw Error('injected error');
    };
    const client = createMockChatClientWithChatThreadClient(chatThreadClient);
    await expect(client.getChatThreadClient('threadId').deleteMessage('')).rejects.toThrow(
      new ChatError('ChatThreadClient.deleteMessage', new Error('injected error'))
    );
  });

  test('when addParticipants fails', async () => {
    const chatThreadClient = createMockChatThreadClient('threadId');
    chatThreadClient.addParticipants = async (): Promise<any> => {
      throw Error('injected error');
    };
    const client = createMockChatClientWithChatThreadClient(chatThreadClient);
    await expect(client.getChatThreadClient('threadId').addParticipants({ participants: [] })).rejects.toThrow(
      new ChatError('ChatThreadClient.addParticipants', new Error('injected error'))
    );
  });

  test('when removeParticipant fails', async () => {
    const chatThreadClient = createMockChatThreadClient('threadId');
    chatThreadClient.removeParticipant = async (): Promise<any> => {
      throw Error('injected error');
    };
    const client = createMockChatClientWithChatThreadClient(chatThreadClient);
    await expect(client.getChatThreadClient('threadId').removeParticipant({ communicationUserId: '' })).rejects.toThrow(
      new ChatError('ChatThreadClient.removeParticipant', new Error('injected error'))
    );
  });

  test('when listParticipants fails immediately', async () => {
    const chatThreadClient = createMockChatThreadClient('threadId');
    chatThreadClient.listParticipants = (): any => {
      throw Error('injected error');
    };
    const client = createMockChatClientWithChatThreadClient(chatThreadClient);
    expect(() => {
      client.getChatThreadClient('threadId').listParticipants();
    }).toThrow(new ChatError('ChatThreadClient.listParticipants', new Error('injected error')));
  });

  test('when listParticipants fails while iterating items', async () => {
    const chatThreadClient = createMockChatThreadClient('threadId');
    chatThreadClient.listParticipants = (): PagedAsyncIterableIterator<any> => {
      return failingPagedAsyncIterator(new Error('injected error'));
    };
    const client = createMockChatClientWithChatThreadClient(chatThreadClient);
    const iter = client.getChatThreadClient('threadId').listParticipants();
    await expect(iter.next()).rejects.toThrow(
      new ChatError('ChatThreadClient.listParticipants', new Error('injected error'))
    );
    await expect(iter.byPage().next()).rejects.toThrow(
      new ChatError('ChatThreadClient.listParticipants', new Error('injected error'))
    );
  });

  test('when listReadReceipts fails immediately', async () => {
    const chatThreadClient = createMockChatThreadClient('threadId');
    chatThreadClient.listReadReceipts = (): any => {
      throw Error('injected error');
    };
    const client = createMockChatClientWithChatThreadClient(chatThreadClient);
    expect(() => {
      client.getChatThreadClient('threadId').listReadReceipts();
    }).toThrow(new ChatError('ChatThreadClient.listReadReceipts', new Error('injected error')));
  });

  test('when listReadReceipts fails while iterating items', async () => {
    const chatThreadClient = createMockChatThreadClient('threadId');
    chatThreadClient.listReadReceipts = (): PagedAsyncIterableIterator<any> => {
      return failingPagedAsyncIterator(new Error('injected error'));
    };
    const client = createMockChatClientWithChatThreadClient(chatThreadClient);
    const iter = client.getChatThreadClient('threadId').listReadReceipts();
    await expect(iter.next()).rejects.toThrow(
      new ChatError('ChatThreadClient.listReadReceipts', new Error('injected error'))
    );
    await expect(iter.byPage().next()).rejects.toThrow(
      new ChatError('ChatThreadClient.listReadReceipts', new Error('injected error'))
    );
  });
});

// Creates a mock stateful chat client that returns the given thread client for all thread IDs.
const createMockChatClientWithChatThreadClient = (chatThreadClient: ChatThreadClient): StatefulChatClient => {
  const client = createMockChatClient();
  client.getChatThreadClient = () => {
    return chatThreadClient;
  };
  return _createStatefulChatClientWithDeps(client, defaultClientArgs);
};
