// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { ChatClient, ChatMessage } from '@azure/communication-chat';
import { CommunicationTokenCredential } from '@azure/communication-common';
import { createAzureCommunicationChatAdapter } from './AzureCommunicationChatAdapter';
import { ChatAdapter, ChatAdapterState } from './ChatAdapter';
import { StubChatClient, StubChatThreadClient, failingPagedAsyncIterator, pagedAsyncIterator } from './StubChatClient';
import { AdapterError } from '../../common/adapters';

jest.useFakeTimers();
jest.mock('@azure/communication-chat');

const ChatClientMock = ChatClient as jest.MockedClass<typeof ChatClient>;

describe('Error is reflected in state and events', () => {
  it('when sendMessage fails', async () => {
    const threadClient = new StubChatThreadClient();
    threadClient.sendMessage = (): Promise<ChatMessage> => {
      throw new Error('injected error');
    };
    const adapter = await createChatAdapterWithStubs(new StubChatClient(threadClient));
    const stateListener = new StateChangeListener(adapter);
    const errorListener = new ErrorListener(adapter);

    await expect(adapter.sendMessage('some message')).rejects.toThrow();

    // Multiple state change notifications because message is saved as "sending" before backend API calls.
    expect(stateListener.onChangeCalledCount).toBeGreaterThan(0);
    const latestError = stateListener.state.latestErrors['ChatThreadClient.sendMessage'];
    expect(latestError).toBeDefined();
    expect(errorListener.errors.length).toBe(1);
    expect(errorListener.errors[0].target).toBe('ChatThreadClient.sendMessage');
  });

  it('when removeParticipant fails', async () => {
    const threadClient = new StubChatThreadClient();
    threadClient.removeParticipant = (): Promise<void> => {
      throw new Error('injected error');
    };
    const adapter = await createChatAdapterWithStubs(new StubChatClient(threadClient));
    const stateListener = new StateChangeListener(adapter);
    const errorListener = new ErrorListener(adapter);

    await expect(adapter.removeParticipant('')).rejects.toThrow();

    expect(stateListener.onChangeCalledCount).toBe(1);
    const latestError = stateListener.state.latestErrors['ChatThreadClient.removeParticipant'];
    expect(latestError).toBeDefined();
    expect(errorListener.errors.length).toBe(1);
    expect(errorListener.errors[0].target).toBe('ChatThreadClient.removeParticipant');
  });

  it('when setTopic fails', async () => {
    const threadClient = new StubChatThreadClient();
    threadClient.updateTopic = (): Promise<void> => {
      throw new Error('injected error');
    };
    const adapter = await createChatAdapterWithStubs(new StubChatClient(threadClient));
    const stateListener = new StateChangeListener(adapter);
    const errorListener = new ErrorListener(adapter);

    await expect(adapter.setTopic('Some Topic')).rejects.toThrow();

    expect(stateListener.onChangeCalledCount).toBe(1);
    const latestError = stateListener.state.latestErrors['ChatThreadClient.updateTopic'];
    expect(latestError).toBeDefined();
    expect(errorListener.errors.length).toBe(1);
    expect(errorListener.errors[0].target).toBe('ChatThreadClient.updateTopic');
  });

  it('when listMessages fails on iteration', async () => {
    const threadClient = new StubChatThreadClient();
    threadClient.listMessages = (): PagedAsyncIterableIterator<ChatMessage> => {
      return failingPagedAsyncIterator(new Error('injected error'));
    };
    const adapter = await createChatAdapterWithStubs(new StubChatClient(threadClient));
    const stateListener = new StateChangeListener(adapter);
    const errorListener = new ErrorListener(adapter);

    await expect(adapter.loadPreviousChatMessages(3)).rejects.toThrow();

    expect(stateListener.onChangeCalledCount).toBe(1);
    const latestError = stateListener.state.latestErrors['ChatThreadClient.listMessages'];
    expect(latestError).toBeDefined();
    expect(errorListener.errors.length).toBe(1);
    expect(errorListener.errors[0].target).toBe('ChatThreadClient.listMessages');
  });

  it('when listMessages fails immediately', async () => {
    const threadClient = new StubChatThreadClient();
    threadClient.listMessages = (): PagedAsyncIterableIterator<ChatMessage> => {
      throw new Error('injected error');
    };
    const adapter = await createChatAdapterWithStubs(new StubChatClient(threadClient));
    const stateListener = new StateChangeListener(adapter);
    const errorListener = new ErrorListener(adapter);

    await expect(adapter.loadPreviousChatMessages(3)).rejects.toThrow();

    expect(stateListener.onChangeCalledCount).toBe(1);
    const latestError = stateListener.state.latestErrors['ChatThreadClient.listMessages'];
    expect(latestError).toBeDefined();
    expect(errorListener.errors.length).toBe(1);
    expect(errorListener.errors[0].target).toBe('ChatThreadClient.listMessages');

    threadClient.listMessages = (): PagedAsyncIterableIterator<ChatMessage> => {
      return pagedAsyncIterator([]);
    };
    const allLoaded = await adapter.loadPreviousChatMessages(1);
    expect(allLoaded).toBe(true);
  });
});

const createChatAdapterWithStubs = async (chatClient: StubChatClient): Promise<ChatAdapter> => {
  // ChatClient constructor must return a ChatClient. StubChatClient only implements the
  // public interface of ChatClient. So we are forced to lose some type information here.
  ChatClientMock.mockImplementation((): ChatClient => {
    return chatClient as unknown as ChatClient;
  });

  // This stub credential is ignored by the stub ChatClient.
  const stubCredential: CommunicationTokenCredential = {
    getToken: () => {
      throw new Error('Unimplemented in stub');
    },
    dispose: () => {
      // Nothing to dispose in the stub.
    }
  };
  return await createAzureCommunicationChatAdapter({
    endpointUrl: 'stubEndpointUrl',
    userId: { communicationUserId: 'stubUserId' },
    displayName: 'stubDisplayName',
    credential: stubCredential,
    threadId: 'stubThreadId'
  });
};

class StateChangeListener {
  state: ChatAdapterState;
  onChangeCalledCount = 0;

  constructor(client: ChatAdapter) {
    this.state = client.getState();
    client.onStateChange(this.onChange.bind(this));
  }

  private onChange(newState: ChatAdapterState): void {
    this.onChangeCalledCount++;
    this.state = newState;
  }
}

class ErrorListener {
  errors: AdapterError[] = [];

  constructor(client: ChatAdapter) {
    client.on('error', this.onError.bind(this));
  }

  private onError(e: AdapterError): void {
    this.errors.push(e);
  }
}
