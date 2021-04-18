// © Microsoft Corporation. All rights reserved.

import { ChatClient, ChatThread, ChatThreadInfo } from '@azure/communication-chat';
import {
  ChatMessageDeletedEvent,
  ChatMessageEditedEvent,
  ChatMessageReceivedEvent,
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

const mockChatThread: ChatThread = {
  id: 'chatThreadId',
  topic: 'topic',
  createdOn: new Date(0),
  createdBy: { communicationUserId: 'user1' }
};

const mockChatThreads: ChatThread[] = seedArray.map((seed) => ({
  id: 'chatThreadId' + seed,
  topic: 'topic' + seed,
  createdOn: new Date(seed * 10000),
  createdBy: { communicationUserId: 'user' + seed }
}));

const mockParticipants = [
  { user: { communicationUserId: 'user1' }, displayName: 'user1' },
  { user: { communicationUserId: 'user2' }, displayName: 'user1' }
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
      _response: {} as any,
      chatThread: {
        ...mockChatThread,
        topic: request.topic,
        createdBy: mockChatThread.createdBy?.communicationUserId ?? ''
      }
    };
  };

  mockClient.listChatThreads = mockListChatThreads;

  mockClient.deleteChatThread = emptyAsyncFunctionWithResponse;

  mockClient.getChatThreadClient = async (threadId) => {
    return createMockChatThreadClient(threadId);
  };

  mockClient.getChatThread = async (threadId) => {
    const retThread = mockChatThreads.find((chatThread) => chatThread.id === threadId);
    if (!retThread) {
      throw 'cannot find thread from mock theards';
    }
    return { _response: {} as any, ...retThread };
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
    userId: 'userId1'
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
    const proxiedThreads: ChatThreadInfo[] = [];
    for await (const thread of chatThreads) {
      proxiedThreads.push(thread);
    }
    expect(proxiedThreads.length).toBe(mockChatThreads.length);
    expect(client.state.threads.size).toBe(mockChatThreads.length);
  });

  test('declarative listChatThreads should proxy listChatThreads paged iterator and store it in internal state', async () => {
    const client = createMockChatClientAndDeclaratify();
    const pages = client.listChatThreads().byPage();
    const proxiedThreads: ChatThreadInfo[] = [];
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
  test('set internal store correctly when proxy getThread and deleteThread', async () => {
    const client = createMockChatClientAndDeclaratify();
    await client.getChatThread(mockChatThreads[0].id);

    expect(client.state.threads.size).toBe(1);
    expect(client.state.threads.get(mockChatThreads[0].id)).toBeDefined();

    await client.deleteChatThread(mockChatThreads[0].id);

    expect(client.state.threads.size).toBe(0);
  });

  test('set internal store correctly when proxy createChatThread', async () => {
    const client = createMockChatClientAndDeclaratify();
    const topic = 'topic';

    const response = await client.createChatThread({ topic, participants: mockParticipants });
    const threadId = response.chatThread?.id ?? '';

    expect(client.state.threads.size).toBe(1);

    const thread = client.state.threads.get(threadId);
    expect(thread).toBeDefined();
    expect(thread?.threadInfo?.topic).toBe(topic);
    thread && expect(Array.from(thread.participants.values()).sort()).toEqual(mockParticipants.sort());
  });

  test('declarify chatThreadClient when return getChatThreadClient', async () => {
    const client = createMockChatClientAndDeclaratify();
    const threadId = 'threadId';
    const chatThreadClient = await client.getChatThreadClient(threadId);

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
      createdOn: '01-01-2020',
      createdBy: { displayName: '', user: { communicationUserId: 'user1' } },
      participants: mockParticipants
    };

    await client.triggerEvent('chatThreadCreated', event);

    expect(client.state.threads.get(threadId)).toBeDefined();
    expect(client.state.threads.get(threadId)?.threadInfo?.topic).toBe(topic);

    // edit event

    const editedTopic = 'new topic';
    const editEvent: ChatThreadPropertiesUpdatedEvent = {
      ...event,
      properties: { topic: editedTopic },
      updatedBy: { displayName: '', user: { communicationUserId: 'user1' } },
      updatedOn: '01-01-2020'
    };
    await client.triggerEvent('chatThreadPropertiesUpdated', editEvent);

    expect(client.state.threads.get(threadId)?.threadInfo?.topic).toBe(editedTopic);

    // delete event
    const deletedEvent: ChatThreadDeletedEvent = {
      ...event,
      deletedBy: { displayName: '', user: { communicationUserId: 'user1' } },
      deletedOn: '01-01-2020'
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
      createdOn: '01-01-2020',
      sender: { user: { communicationUserId: 'sender1' }, displayName: '' },
      content: 'message',
      recipient: { communicationUserId: 'userId1' }
    };

    await client.triggerEvent('chatMessageReceived', event);

    expect(client.state.threads.get(threadId)?.chatMessages.get(messageId)).toBeDefined();

    // edit event
    const content = 'editedContent';
    const editedEvent: ChatMessageEditedEvent = {
      ...event,
      content,
      editedOn: '01-01-2020'
    };
    await client.triggerEvent('chatMessageEdited', editedEvent);

    expect(client.state.threads.get(threadId)?.chatMessages.get(messageId)?.content?.message).toBe(content);

    // delete event
    const deleteEvent: ChatMessageDeletedEvent = {
      ...event,
      deletedOn: '01-01-2020'
    };

    await client.triggerEvent('chatMessageDeleted', deleteEvent);

    expect(client.state.threads.get(threadId)?.chatMessages.size).toBe(0);
  });

  test('set internal store correctly when receive participant related events', async () => {
    const threadId = 'threadId1';

    const addedEvent: ParticipantsAddedEvent = {
      threadId,
      addedBy: { user: { communicationUserId: 'user1' }, displayName: '' },
      addedOn: '01-01-2020',
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
      removedBy: { user: { communicationUserId: 'user1' }, displayName: '' },
      removedOn: '01-01-2020'
    };
    await client.triggerEvent('participantsRemoved', removedEvent);

    expect(client.state.threads.get(threadId)?.participants.size).toBe(1);
  });

  test('set internal store correctly when receive typingIndicator events', async () => {
    const threadId = 'threadId1';

    const addedEvent: TypingIndicatorReceivedEvent = {
      threadId,
      receivedOn: new Date().toUTCString(),
      recipient: { communicationUserId: 'user2' },
      sender: { user: { communicationUserId: 'user3' }, displayName: '' },
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
      receivedOn: new Date(Date.now() - (Constants.TYPING_INDICATOR_MAINTAIN_TIME + 1 * 1000)).toUTCString(),
      recipient: { communicationUserId: 'user2' },
      sender: { user: { communicationUserId: 'user3' }, displayName: '' },
      version: ''
    };

    await client.triggerEvent('typingIndicatorReceived', addedEvent);

    expect(client.state.threads.get(threadId)?.typingIndicators.length).toBe(0);
  });

  test('set internal store correctly when receive readReceiptReceived events', async () => {
    const threadId = 'threadId1';
    const messageId = 'messageId1';
    const readOn = new Date().toUTCString();

    const addedEvent: ReadReceiptReceivedEvent = {
      threadId,
      readOn,
      recipient: { communicationUserId: 'user1' },
      sender: { user: { communicationUserId: 'user1' }, displayName: '' },
      chatMessageId: 'messageId1'
    };

    client.triggerEvent('readReceiptReceived', addedEvent);

    expect(client.state.threads.get(threadId)?.readReceipts.length).toBe(1);
    expect(client.state.threads.get(threadId)?.readReceipts[0].chatMessageId).toBe(messageId);

    expect(client.state.threads.get(threadId)?.latestReadTime).toEqual(new Date(readOn));
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
      readOn: '01-01-2020',
      recipient: { communicationUserId: 'user1' },
      sender: { user: { communicationUserId: 'user1' }, displayName: '' },
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

    await client.createChatThread({ topic: 'topic', participants: mockParticipants });

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
    await client.createChatThread({ topic: 'topic', participants: mockParticipants });
    expect(onChangeCalledTimes).toBe(1);

    client.offStateChange(callback);
    await client.createChatThread({ topic: 'topic', participants: mockParticipants });
    expect(onChangeCalledTimes).toBe(1);
  });
});
