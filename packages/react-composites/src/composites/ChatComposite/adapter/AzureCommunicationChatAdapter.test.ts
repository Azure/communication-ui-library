// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { ChatClient, ChatMessage } from '@azure/communication-chat';
import { createAzureCommunicationChatAdapter } from './AzureCommunicationChatAdapter';
import { ChatAdapter, ChatState } from './ChatAdapter';
import { StubChatClient, StubChatThreadClient, failingPagedAsyncIterator } from './StubChatClient';

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
    expect(errorListener.errors[0].operation).toBe('ChatThreadClient.sendMessage');
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
    expect(errorListener.errors[0].operation).toBe('ChatThreadClient.removeParticipant');
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
    expect(errorListener.errors[0].operation).toBe('ChatThreadClient.updateTopic');
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
    expect(errorListener.errors[0].operation).toBe('ChatThreadClient.listMessages');
  });

  /*
  // This test current fails.
  // If `listMessages` fails immediately (network flake), the adaptor construction throws an exception,
  // and there is no way for the composite to recover.
  it('when listMessages fails immediately', async () => {
    const threadClient = new StubChatThreadClient();
    threadClient.listMessages = (): any => {
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
    expect(errorListener.errors[0].operation).toBe('ChatThreadClient.listMessages');
  });
  */
});

// TODO: Write a test for clearing errors.

export const createChatAdapterWithStubs = async (chatClient: StubChatClient): Promise<ChatAdapter> => {
  // ChatClient constructor must return a ChatClient. StubChatClient only implements the
  // public interface of ChatClient. So we are forced to lose some type information here.
  ChatClientMock.mockImplementation((): ChatClient => {
    return chatClient as unknown as ChatClient;
  });
  return await createAzureCommunicationChatAdapter(
    { communicationUserId: 'stubUserId' },
    token,
    'stubEndointUrl',
    'stubThreadId',
    'stubDisplayName'
  );
};

// An actual (expired) token to mollify token parsing logic before we hit the StubChatClient (which promptly ignores the token).
// TODO: Allow dependency injection in stateful client so that we can directly inject the StubChatClient, avoiding production glue code.
const token =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwMiIsIng1dCI6IjNNSnZRYzhrWVNLd1hqbEIySmx6NTRQVzNBYyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOjcxZWM1OTBiLWNiYWQtNDkwYy05OWM1LWI1NzhiZGFjZGU1NF8wMDAwMDAwYS1mYjg0LWFkOTgtNDdiNC1hNDNhMGQwMDI0YTkiLCJzY3AiOjE3OTIsImNzaSI6IjE2MjUwMzUwNDkiLCJpYXQiOjE2MjUwMzUwNDksImV4cCI6MTYyNTEyMTQ0OSwiYWNzU2NvcGUiOiJjaGF0IiwicmVzb3VyY2VJZCI6IjcxZWM1OTBiLWNiYWQtNDkwYy05OWM1LWI1NzhiZGFjZGU1NCJ9.ylByb-wR0G59zZldD4AxkHz-tkAUTGl3mvL0AHsR9FQix0w9ezgq-LDJfYvRyaAmH6IwKkPCD75Cod3PCYVAK5joGAr6QLGBOYtTpN3fr_NaB85MDzM3Sh0ftRQAMXocwk925hwGGcFg4mHEJKyuNcHsuWcrdt76s0U4Gyw5aFB9uOeXK9bpCBk5I5tNy1gT0rZWd23AQZP-agp3aPVnu-KNl1dmmSRQ6T4vAQXHi64Xc3dc2PJ86Txzeened6pT3Ww7jBVLVRLR-cDLqCPl0DdS4-3dxyns9IuuQ8ANILruYCB7jS6yXk77rUAeXKqgvWMLEYMJ6uOBslfd-gU1Aw';

class StateChangeListener {
  state: ChatState;
  onChangeCalledCount = 0;

  constructor(client: ChatAdapter) {
    this.state = client.getState();
    client.onStateChange(this.onChange.bind(this));
  }

  private onChange(newState: ChatState): void {
    this.onChangeCalledCount++;
    this.state = newState;
  }
}

class ErrorListener {
  errors: { operation: string; error: Error }[] = [];

  constructor(client: ChatAdapter) {
    client.on('error', this.onError.bind(this));
  }

  private onError(event: { operation: string; error: Error }): void {
    this.errors.push({ operation: event.operation, error: event.error });
  }
}
