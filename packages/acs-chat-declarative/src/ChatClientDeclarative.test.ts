// © Microsoft Corporation. All rights reserved.

import { ChatClient, ChatThreadItem } from '@azure/communication-chat';
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
import { chatClientDeclaratify, DeclarativeChatClient } from './ChatClientDeclarative';
import { ChatClientState } from './ChatClientState';
import { Constants } from './Constants';
import { createMockChatThreadClient } from './mocks/createMockChatThreadClient';
import { createMockIterator } from './mocks/createMockIterator';
import { MockCommunicationUserCredential } from './mocks/MockCommunicationUserCredential';

// [1, 2 ... 5] array
const seedArray = Array.from(Array(5).keys());

const mockChatThreads: ChatThreadItem[] = seedArray.map((seed) => ({
  id: 'chatThreadId' + seed,
  topic: 'topic' + seed,
  createdOn: new Date(seed * 10000),
  createdBy: { communicationUserId: 'user' + seed }
}));

const mockParticipants: ChatParticipant[] = [
  { id: { kind: 'communicationUser', communicationUserId: 'user1' }, displayName: 'user1' },
  { id: { kind: 'communicationUser', communicationUserId: 'user2' }, displayName: 'user1' }
];

const mockListChatThreads = (): any => {
  return createMockIterator(mockChatThreads);
};

jest.mock('@azure/communication-chat');

const emptyAsyncFunctionWithResponse = async (): Promise<any> => {
  return { _response: {} as any };
};

type DeclarativeChatClientWithEventTrigger = DeclarativeChatClient & {
  triggerEvent: (eventName: string, e: any) => Promise<void>;
};

function createMockChatClientAndDeclaratify(): DeclarativeChatClientWithEventTrigger {
  const mockClient = new ChatClient('', new MockCommunicationUserCredential());
  const eventHandlers = {};

  mockClient.createChatThread = async (request) => {
    return {
      chatThread: {
        id: 'chatThreadId',
        topic: request.topic,
        createdOn: new Date(0),
        createdBy: { kind: 'communicationUser', communicationUserId: 'user1' }
      }
    };
  };

  mockClient.listChatThreads = mockListChatThreads;

  mockClient.deleteChatThread = emptyAsyncFunctionWithResponse;

  mockClient.getChatThreadClient = (threadId) => {
    return createMockChatThreadClient(threadId);
  };

  mockClient.on = ((event: Parameters<ChatClient['on']>[0], listener: (e: Event) => void) => {
    eventHandlers[event] = listener;
  }) as any;

  mockClient.off = ((event: Parameters<ChatClient['on']>[0], listener: (e: Event) => void) => {
    if (eventHandlers[event] === listener) {
      eventHandlers[event] = undefined;
    }
  }) as any;

  const declarativeClient = chatClientDeclaratify(mockClient, {
    displayName: '',
    userId: { kind: 'communicationUser', communicationUserId: 'userId1' }
  });

  mockClient.startRealtimeNotifications = emptyAsyncFunctionWithResponse;
  mockClient.stopRealtimeNotifications = emptyAsyncFunctionWithResponse;

  Object.defineProperty(declarativeClient, 'triggerEvent', {
    value: async (eventName: string, e: any): Promise<void> => {
      const handler = eventHandlers[eventName];
      if (handler !== undefined) {
        await handler(e);
      }
    }
  });

  return declarativeClient as DeclarativeChatClientWithEventTrigger;
}

describe('declarative chatThread list iterators', () => {
  test('declarative listChatThreads should proxy listChatThreads iterator and store it in internal state', async () => {
    const client = createMockChatClientAndDeclaratify();
    const chatThreads = client.listChatThreads();
    const proxiedThreads: ChatThreadItem[] = [];
    for await (const thread of chatThreads) {
      proxiedThreads.push(thread);
    }
    expect(proxiedThreads.length).toBe(mockChatThreads.length);
    expect(client.state.threads.size).toBe(mockChatThreads.length);
  });

  test('declarative listChatThreads should proxy listChatThreads paged iterator and store it in internal state', async () => {
    const client = createMockChatClientAndDeclaratify();
    const pages = client.listChatThreads().byPage();
    const proxiedThreads: ChatThreadItem[] = [];
    for await (const page of pages) {
      for (const thread of page) {
        proxiedThreads.push(thread);
      }
    }

    expect(proxiedThreads.length).toBe(mockChatThreads.length);
    expect(client.state.threads.size).toBe(mockChatThreads.length);
  });
});

describe('declarative chatClient basic api functions', () => {
  test('set internal store correctly when proxy getChatThreadClient and deleteThread', async () => {
    const client = createMockChatClientAndDeclaratify();
    await client.getChatThreadClient(mockChatThreads[0].id);

    expect(client.state.threads.size).toBe(1);
    expect(client.state.threads.get(mockChatThreads[0].id)).toBeDefined();

    await client.deleteChatThread(mockChatThreads[0].id);

    expect(client.state.threads.size).toBe(0);
  });

  test('set internal store correctly when proxy createChatThread', async () => {
    const client = createMockChatClientAndDeclaratify();
    const topic = 'topic';

    const response = await client.createChatThread({ topic });
    const threadId = response.chatThread?.id ?? '';

    expect(client.state.threads.size).toBe(1);

    const thread = client.state.threads.get(threadId);
    expect(thread).toBeDefined();
    expect(thread?.properties?.topic).toBe(topic);
    thread && expect(Array.from(thread.participants.values()).sort()).toEqual(mockParticipants.sort());
  });

  test('declaratify chatThreadClient when return getChatThreadClient', async () => {
    const client = createMockChatClientAndDeclaratify();
    const threadId = 'threadId';
    const chatThreadClient = client.getChatThreadClient(threadId);

    expect(client.state.threads.get(threadId)).toBeDefined();

    await chatThreadClient.sendMessage({ content: 'test' });

    expect(client.state.threads.get(threadId)?.chatMessages.size).toBe(1);
  });
});

describe('declarative chatClient subscribe to event properly after startRealtimeNotification', () => {
  let client: DeclarativeChatClientWithEventTrigger;
  beforeEach(() => {
    client = createMockChatClientAndDeclaratify();
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

    expect(client.state.threads.get(threadId)).toBeDefined();
    expect(client.state.threads.get(threadId)?.properties?.topic).toBe(topic);

    // edit event

    const editedTopic = 'new topic';
    const editEvent: ChatThreadPropertiesUpdatedEvent = {
      ...event,
      properties: { topic: editedTopic },
      updatedBy: { displayName: '', id: { kind: 'communicationUser', communicationUserId: 'user1' } },
      updatedOn: new Date('01-01-2020')
    };
    await client.triggerEvent('chatThreadPropertiesUpdated', editEvent);

    expect(client.state.threads.get(threadId)?.properties?.topic).toBe(editedTopic);

    // delete event
    const deletedEvent: ChatThreadDeletedEvent = {
      ...event,
      deletedBy: { displayName: '', id: { kind: 'communicationUser', communicationUserId: 'user1' } },
      deletedOn: new Date('01-01-2020')
    };
    await client.triggerEvent('chatThreadDeleted', deletedEvent);
    expect(client.state.threads.size).toBe(0);
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

    expect(client.state.threads.get(threadId)?.chatMessages.get(messageId)).toBeDefined();

    // edit event
    const message = 'editedContent';
    const editedEvent: ChatMessageEditedEvent = {
      ...event,
      message: message,
      editedOn: new Date('01-01-2020')
    };
    await client.triggerEvent('chatMessageEdited', editedEvent);

    expect(client.state.threads.get(threadId)?.chatMessages.get(messageId)?.content?.message).toBe(message);

    // delete event
    const deleteEvent: ChatMessageDeletedEvent = {
      ...event,
      deletedOn: new Date('01-01-2020')
    };

    await client.triggerEvent('chatMessageDeleted', deleteEvent);

    expect(client.state.threads.get(threadId)?.chatMessages.size).toBe(0);
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

    client.triggerEvent('participantsAdded', addedEvent);

    expect(client.state.threads.get(threadId)?.participants.size).toBe(2);

    // remove event
    const removedEvent: ParticipantsRemovedEvent = {
      threadId,
      participantsRemoved: [mockParticipants[0]],
      version: '',
      removedBy: { id: { kind: 'communicationUser', communicationUserId: 'user1' }, displayName: '' },
      removedOn: new Date('01-01-2020')
    };
    await client.triggerEvent('participantsRemoved', removedEvent);

    expect(client.state.threads.get(threadId)?.participants.size).toBe(1);
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

    expect(client.state.threads.get(threadId)?.typingIndicators.length).toBe(2);
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

    expect(client.state.threads.get(threadId)?.typingIndicators.length).toBe(0);
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

    expect(client.state.threads.get(threadId)?.readReceipts.length).toBe(1);
    expect(client.state.threads.get(threadId)?.readReceipts[0].chatMessageId).toBe(messageId);

    expect(client.state.threads.get(threadId)?.latestReadTime).toEqual(readOn);
  });
});

describe('declarative chatClient unsubscribe', () => {
  test('unsubscribe events correctly ', async () => {
    const threadId = 'threadId1';
    const client = createMockChatClientAndDeclaratify();
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

    expect(client.state.threads.get(threadId)?.readReceipts).toBe(undefined);
  });
});

describe('declarative chatClient onStateChange', () => {
  test('will be triggered when state gets updated', async () => {
    const client = createMockChatClientAndDeclaratify();

    let state: ChatClientState = client.state;
    let onChangeCalled = false;

    client.onStateChange((_state) => {
      state = _state;
      onChangeCalled = true;
    });

    await client.createChatThread({ topic: 'topic' });

    expect(onChangeCalled).toBeTruthy();
    expect(state.threads.size).toBe(1);
  });

  test('offStateChange will unsubscribe correctly', async () => {
    const client = createMockChatClientAndDeclaratify();

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
