// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatThreadItem } from '@azure/communication-chat';
import { PagedAsyncIterableIterator } from '@azure/core-paging';
import {
  ChatMessageDeletedEvent,
  ChatMessageEditedEvent,
  ChatMessageReceivedEvent,
  ChatParticipant,
  ChatThreadCreatedEvent,
  ChatThreadDeletedEvent,
  ChatThreadPropertiesUpdatedEvent,
  ParticipantsAddedEvent,
  ParticipantsRemovedEvent,
  ReadReceiptReceivedEvent,
  TypingIndicatorReceivedEvent
} from '@azure/communication-signaling';
import { createStatefulChatClientWithDeps } from './StatefulChatClient';
import { ChatClientState, ChatError } from './ChatClientState';
import { Constants } from './Constants';
import {
  StateChangeListener,
  StatefulChatClientWithEventTrigger,
  createMockChatClient,
  createStatefulChatClientMock,
  defaultClientArgs,
  failingPagedAsyncIterator,
  mockChatThreads
} from './TestHelpers';

jest.useFakeTimers();

const mockParticipants: ChatParticipant[] = [
  { id: { kind: 'communicationUser', communicationUserId: 'user1' }, displayName: 'user1' },
  { id: { kind: 'communicationUser', communicationUserId: 'user2' }, displayName: 'user1' }
];

describe('declarative chatThread list iterators', () => {
  test('declarative listChatThreads should proxy listChatThreads iterator and store it in internal state', async () => {
    const client = createStatefulChatClientMock();
    const chatThreads = client.listChatThreads();
    const proxiedThreads: ChatThreadItem[] = [];
    for await (const thread of chatThreads) {
      proxiedThreads.push(thread);
    }
    expect(proxiedThreads.length).toBe(mockChatThreads.length);
    expect(Object.keys(client.getState().threads).length).toBe(mockChatThreads.length);
  });

  test('declarative listChatThreads should proxy listChatThreads paged iterator and store it in internal state', async () => {
    const client = createStatefulChatClientMock();
    const pages = client.listChatThreads().byPage();
    const proxiedThreads: ChatThreadItem[] = [];
    for await (const page of pages) {
      for (const thread of page) {
        proxiedThreads.push(thread);
      }
    }

    expect(proxiedThreads.length).toBe(mockChatThreads.length);
    expect(Object.keys(client.getState().threads).length).toBe(mockChatThreads.length);
  });
});

describe('declarative chatClient basic api functions', () => {
  test('set internal store correctly when proxy getChatThreadClient and deleteThread', async () => {
    const client = createStatefulChatClientMock();
    await client.getChatThreadClient(mockChatThreads[0].id);

    expect(Object.keys(client.getState().threads).length).toBe(1);
    expect(client.getState().threads[mockChatThreads[0].id]).toBeDefined();

    await client.deleteChatThread(mockChatThreads[0].id);

    expect(Object.keys(client.getState().threads).length).toBe(0);
  });

  test('set internal store correctly when proxy createChatThread', async () => {
    const client = createStatefulChatClientMock();
    const topic = 'topic';

    const response = await client.createChatThread({ topic });
    const threadId = response.chatThread?.id ?? '';

    expect(Object.keys(client.getState().threads).length).toBe(1);

    const thread = client.getState().threads[threadId];
    expect(thread).toBeDefined();
    expect(thread?.properties?.topic).toBe(topic);
  });

  test('declaratify chatThreadClient when return getChatThreadClient', async () => {
    const client = createStatefulChatClientMock();
    const threadId = 'threadId';
    const chatThreadClient = client.getChatThreadClient(threadId);

    expect(client.getState().threads[threadId]).toBeDefined();

    await chatThreadClient.sendMessage({ content: 'test' });

    expect(Object.values(client.getState().threads[threadId]?.chatMessages ?? {}).length).toBe(1);
  });
});

describe('declarative chatClient subscribe to event properly after startRealtimeNotification', () => {
  let client: StatefulChatClientWithEventTrigger;
  beforeEach(() => {
    client = createStatefulChatClientMock();
    client.startRealtimeNotifications();
  });

  afterEach(() => {
    client.stopRealtimeNotifications();
  });

  test('set internal store correctly when receive thread related event', async () => {
    const threadId = 'threadId1';
    const topic = 'topic';
    const event: ChatThreadCreatedEvent = {
      threadId,
      version: '',
      properties: { topic },
      createdOn: new Date('01-01-2020'),
      createdBy: { id: { kind: 'communicationUser', communicationUserId: 'user1' }, displayName: '' },
      participants: mockParticipants
    };

    await client.triggerEvent('chatThreadCreated', event);

    expect(client.getState().threads[threadId]).toBeDefined();
    expect(client.getState().threads[threadId]?.properties?.topic).toBe(topic);

    // edit event

    const editedTopic = 'new topic';
    const editEvent: ChatThreadPropertiesUpdatedEvent = {
      ...event,
      properties: { topic: editedTopic },
      updatedBy: { displayName: '', id: { kind: 'communicationUser', communicationUserId: 'user1' } },
      updatedOn: new Date('01-01-2020')
    };
    await client.triggerEvent('chatThreadPropertiesUpdated', editEvent);

    expect(client.getState().threads[threadId]?.properties?.topic).toBe(editedTopic);

    // delete event
    const deletedEvent: ChatThreadDeletedEvent = {
      ...event,
      deletedBy: { displayName: '', id: { kind: 'communicationUser', communicationUserId: 'user1' } },
      deletedOn: new Date('01-01-2020')
    };
    await client.triggerEvent('chatThreadDeleted', deletedEvent);
    expect(Object.keys(client.getState().threads).length).toBe(0);
  });

  test('set internal store correctly when receive chatMessage related events', async () => {
    const threadId = 'threadId1';
    const messageId = 'messageId1';
    const event: ChatMessageReceivedEvent = {
      threadId,
      id: messageId,
      type: 'text',
      version: '',
      createdOn: new Date('01-01-2020'),
      sender: { kind: 'communicationUser', communicationUserId: 'sender1' },
      senderDisplayName: '',
      message: 'message',
      recipient: { kind: 'communicationUser', communicationUserId: 'userId1' }
    };

    await client.triggerEvent('chatMessageReceived', event);

    expect(client.getState().threads[threadId]?.chatMessages[messageId]).toBeDefined();

    // edit event
    const message = 'editedContent';
    const editedEvent: ChatMessageEditedEvent = {
      ...event,
      message: message,
      editedOn: new Date('01-01-2020')
    };
    await client.triggerEvent('chatMessageEdited', editedEvent);

    expect(client.getState().threads[threadId]?.chatMessages[messageId]?.content?.message).toBe(message);

    // delete event
    const deleteEvent: ChatMessageDeletedEvent = {
      ...event,
      deletedOn: new Date('01-01-2020')
    };

    await client.triggerEvent('chatMessageDeleted', deleteEvent);

    expect(Object.values(client.getState().threads[threadId]?.chatMessages ?? {}).length).toBe(0);
  });

  test('set internal store correctly when receive participant related events', async () => {
    const threadId = 'threadId1';

    const addedEvent: ParticipantsAddedEvent = {
      threadId,
      addedBy: { id: { kind: 'communicationUser', communicationUserId: 'user1' }, displayName: '' },
      addedOn: new Date('01-01-2020'),
      participantsAdded: mockParticipants,
      version: ''
    };
    await client.triggerEvent('participantsAdded', addedEvent);

    expect(Object.keys(client.getState().threads[threadId]?.participants ?? {}).length).toBe(2);

    // remove event
    const removedEvent: ParticipantsRemovedEvent = {
      threadId,
      participantsRemoved: [mockParticipants[0]],
      version: '',
      removedBy: { id: { kind: 'communicationUser', communicationUserId: 'user1' }, displayName: '' },
      removedOn: new Date('01-01-2020')
    };
    await client.triggerEvent('participantsRemoved', removedEvent);

    expect(Object.keys(client.getState().threads[threadId]?.participants ?? {}).length).toBe(1);
  });

  test('set internal store correctly when receive typingIndicator events', async () => {
    const threadId = 'threadId1';

    const addedEvent: TypingIndicatorReceivedEvent = {
      threadId,
      receivedOn: new Date(),
      recipient: { kind: 'communicationUser', communicationUserId: 'user2' },
      sender: { kind: 'communicationUser', communicationUserId: 'user3' },
      senderDisplayName: '',
      version: ''
    };

    await client.triggerEvent('typingIndicatorReceived', addedEvent);
    await client.triggerEvent('typingIndicatorReceived', addedEvent);

    expect(client.getState().threads[threadId]?.typingIndicators.length).toBe(2);
  });

  test('only maintain recent 30s typingIndicator', async () => {
    const threadId = 'threadId1';

    const addedEvent: TypingIndicatorReceivedEvent = {
      threadId,
      receivedOn: new Date(Date.now() - (Constants.TYPING_INDICATOR_MAINTAIN_TIME + 1 * 1000)),
      recipient: { kind: 'communicationUser', communicationUserId: 'user2' },
      sender: { kind: 'communicationUser', communicationUserId: 'user3' },
      senderDisplayName: '',
      version: ''
    };

    await client.triggerEvent('typingIndicatorReceived', addedEvent);

    jest.advanceTimersByTime(1500);

    expect(client.getState().threads[threadId]?.typingIndicators.length).toBe(0);
  });

  test('set internal store correctly when receive readReceiptReceived events', async () => {
    const threadId = 'threadId1';
    const messageId = 'messageId1';
    const readOn = new Date();

    const addedEvent: ReadReceiptReceivedEvent = {
      threadId,
      readOn,
      recipient: { kind: 'communicationUser', communicationUserId: 'user1' },
      sender: { kind: 'communicationUser', communicationUserId: 'user1' },
      senderDisplayName: '',
      chatMessageId: 'messageId1'
    };

    client.triggerEvent('readReceiptReceived', addedEvent);

    expect(client.getState().threads[threadId]?.readReceipts.length).toBe(1);
    expect(client.getState().threads[threadId]?.readReceipts[0].chatMessageId).toBe(messageId);

    expect(client.getState().threads[threadId]?.latestReadTime).toEqual(readOn);
  });
});

describe('declarative chatClient unsubscribe', () => {
  test('unsubscribe events correctly ', async () => {
    const threadId = 'threadId1';
    const client = createStatefulChatClientMock();
    await client.startRealtimeNotifications();

    await client.stopRealtimeNotifications();

    const addedEvent: ReadReceiptReceivedEvent = {
      threadId,
      readOn: new Date('01-01-2020'),
      recipient: { kind: 'communicationUser', communicationUserId: 'user1' },
      sender: { kind: 'communicationUser', communicationUserId: 'user1' },
      senderDisplayName: '',
      chatMessageId: 'messageId1'
    };

    client.triggerEvent('readReceiptReceived', addedEvent);

    expect(client.getState().threads[threadId]?.readReceipts).toBe(undefined);
  });
});

describe('declarative chatClient onStateChange', () => {
  test('will be triggered when state gets updated', async () => {
    const client = createStatefulChatClientMock();

    let state: ChatClientState = client.getState();
    let onChangeCalled = false;

    client.onStateChange((_state) => {
      state = _state;
      onChangeCalled = true;
    });

    await client.createChatThread({ topic: 'topic' });

    expect(onChangeCalled).toBeTruthy();
    expect(Object.keys(state.threads).length).toBe(1);
  });

  test('offStateChange will unsubscribe correctly', async () => {
    const client = createStatefulChatClientMock();

    let onChangeCalledTimes = 0;

    const callback = (): void => {
      onChangeCalledTimes++;
    };

    client.onStateChange(callback);
    await client.createChatThread({ topic: 'topic' });
    expect(onChangeCalledTimes).toBe(1);

    client.offStateChange(callback);
    await client.createChatThread({ topic: 'topic' });
    expect(onChangeCalledTimes).toBe(1);
  });
});

describe('stateful wraps thrown error', () => {
  test('when listChatThreads fails immedately', async () => {
    const baseClient = createMockChatClient();
    baseClient.listChatThreads = (): PagedAsyncIterableIterator<ChatThreadItem> => {
      throw Error('injected error');
    };
    const client = createStatefulChatClientWithDeps(baseClient, defaultClientArgs);
    expect(client.listChatThreads).toThrow(new ChatError('ChatClient.listChatThreads', new Error('injected error')));
  });

  test('when listChatThreads fails while iterating items', async () => {
    const baseClient = createMockChatClient();
    baseClient.listChatThreads = (): PagedAsyncIterableIterator<ChatThreadItem> => {
      return failingPagedAsyncIterator(new Error('injected error'));
    };
    const client = createStatefulChatClientWithDeps(baseClient, defaultClientArgs);
    const iter = client.listChatThreads();
    await expect(iter.next()).rejects.toThrow(new ChatError('ChatClient.listChatThreads', new Error('injected error')));
    await expect(iter.byPage().next()).rejects.toThrow(
      new ChatError('ChatClient.listChatThreads', new Error('injected error'))
    );
  });

  test('when createChatThread fails', async () => {
    const baseClient = createMockChatClient();
    baseClient.createChatThread = async () => {
      throw Error('injected error');
    };
    const client = createStatefulChatClientWithDeps(baseClient, defaultClientArgs);
    await expect(client.createChatThread({ topic: '' })).rejects.toThrow(
      new ChatError('ChatClient.createChatThread', new Error('injected error'))
    );
  });

  test('when deleteChatThread fails', async () => {
    const baseClient = createMockChatClient();
    baseClient.deleteChatThread = async () => {
      throw Error('injected error');
    };
    const client = createStatefulChatClientWithDeps(baseClient, defaultClientArgs);
    await expect(client.deleteChatThread('')).rejects.toThrow(
      new ChatError('ChatClient.deleteChatThread', new Error('injected error'))
    );
  });

  test('when startRealtimeNotifications fails', async () => {
    const baseClient = createMockChatClient();
    baseClient.startRealtimeNotifications = async () => {
      throw Error('injected error');
    };
    const client = createStatefulChatClientWithDeps(baseClient, defaultClientArgs);
    await expect(client.startRealtimeNotifications()).rejects.toThrow(
      new ChatError('ChatClient.startRealtimeNotifications', new Error('injected error'))
    );
  });

  test('when stopRealtimeNotifications fails', async () => {
    const baseClient = createMockChatClient();
    baseClient.stopRealtimeNotifications = async () => {
      throw Error('injected error');
    };
    const client = createStatefulChatClientWithDeps(baseClient, defaultClientArgs);
    await expect(client.stopRealtimeNotifications()).rejects.toThrow(
      new ChatError('ChatClient.stopRealtimeNotifications', new Error('injected error'))
    );
  });
});

describe('stateful chatClient tees errors to state', () => {
  test('when startRealtimeNotifications fails', async () => {
    const baseClient = createMockChatClient();
    baseClient.startRealtimeNotifications = async () => {
      throw Error('injected error');
    };
    const client = createStatefulChatClientWithDeps(baseClient, defaultClientArgs);
    const listener = new StateChangeListener(client);
    await expect(client.startRealtimeNotifications()).rejects.toThrow();
    expect(listener.onChangeCalledCount).toBe(1);
    const latestError = listener.state.latestErrors['ChatClient.startRealtimeNotifications'];
    expect(latestError).toBeDefined();
  });
});

describe('complex error handling for startRealtimeNotifications', () => {
  test('latest error is stored in state', async () => {
    const baseClient = createMockChatClient();
    let errorCount = 0;
    baseClient.startRealtimeNotifications = async () => {
      errorCount++;
      throw Error(`injected error #${errorCount}`);
    };
    const client = createStatefulChatClientWithDeps(baseClient, defaultClientArgs);
    const listener = new StateChangeListener(client);

    // Generate two errors.
    await expect(client.startRealtimeNotifications()).rejects.toThrow();
    await expect(client.startRealtimeNotifications()).rejects.toThrow();

    expect(listener.onChangeCalledCount).toBe(2);
    const latestError = listener.state.latestErrors['ChatClient.startRealtimeNotifications'];
    expect(latestError).toBeDefined();
    expect(latestError).toEqual(new ChatError('ChatClient.startRealtimeNotifications', new Error('injected error #2')));
  });
});
