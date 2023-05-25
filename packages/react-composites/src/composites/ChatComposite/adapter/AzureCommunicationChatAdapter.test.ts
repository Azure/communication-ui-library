// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { ChatClient, ChatMessage } from '@azure/communication-chat';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing)and-file-sharing)and-file-sharing) */
import { CommunicationGetTokenOptions } from '@azure/communication-common';
import { CommunicationTokenCredential } from '@azure/communication-common';
import {
  createAzureCommunicationChatAdapter,
  createAzureCommunicationChatAdapterFromClient
} from './AzureCommunicationChatAdapter';
/* @conditional-compile-remove(teams-inline-images) */
import { AzureCommunicationChatAdapterOptions } from './AzureCommunicationChatAdapter';
import { ChatAdapter, ChatAdapterState } from './ChatAdapter';
import { StubChatClient, StubChatThreadClient, failingPagedAsyncIterator, pagedAsyncIterator } from './StubChatClient';
import { createStatefulChatClientMock } from '../../../mocks';
import { AdapterError } from '../../common/adapters';

jest.useFakeTimers();
jest.mock('@azure/communication-chat');

const ChatClientMock = ChatClient as jest.MockedClass<typeof ChatClient>;

describe('Adapter is created as expected', () => {
  it('when creating a new adapter from stateful client', async () => {
    /* @conditional-compile-remove(teams-inline-images) */
    const fakeToken: CommunicationTokenCredential = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getToken: (options?: CommunicationGetTokenOptions): Promise<MockAccessToken> => {
        return new Promise<MockAccessToken>((resolve) => {
          resolve({ token: 'anyToken', expiresOnTimestamp: Date.now() });
        });
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function
      dispose(): any {}
    };

    const statefulChatClient = createStatefulChatClientMock(new StubChatThreadClient());
    const threadClient = statefulChatClient.getChatThreadClient('threadId');
    /* @conditional-compile-remove(teams-inline-images) */
    const options: AzureCommunicationChatAdapterOptions = { credential: fakeToken };

    const adapter = await createAzureCommunicationChatAdapterFromClient(
      statefulChatClient,
      threadClient,
      /* @conditional-compile-remove(teams-inline-images) */ options
    );
    expect(adapter).toBeDefined();
  });
});
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

  it('when sendTypingNotification fails', async () => {
    const threadClient = new StubChatThreadClient();
    threadClient.sendTypingNotification = (): Promise<boolean> => {
      throw new Error('injected error');
    };
    const adapter = await createChatAdapterWithStubs(new StubChatClient(threadClient));
    const stateListener = new StateChangeListener(adapter);
    const errorListener = new ErrorListener(adapter);

    await expect(adapter.sendTypingIndicator()).rejects.toThrow();

    expect(stateListener.onChangeCalledCount).toBe(1);
    const latestError = stateListener.state.latestErrors['ChatThreadClient.sendTypingNotification'];
    expect(latestError).toBeDefined();
    expect(errorListener.errors.length).toBe(1);
    expect(errorListener.errors[0].target).toBe('ChatThreadClient.sendTypingNotification');
  });

  /* @conditional-compile-remove(teams-inline-images-and-file-sharing)and-file-sharing) */
  it('when downloadAttachments with no access token fails', async () => {
    const threadClient = new StubChatThreadClient();
    const adapter = await createChatAdapterWithStubs(new StubChatClient(threadClient));
    const errorListener = new ErrorListener(adapter);

    await expect(adapter.downloadAttachments({ attachmentUrls: ['somefakeUrl'] })).rejects.toThrow();
    expect(errorListener.errors.length).toBe(1);
    expect(errorListener.errors[0].target).toBe('ChatThreadClient.getMessage');
    expect(errorListener.errors[0].innerError.message).toBe('AccessToken is null');
  });
  /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
  it('when downloadAttachments fails with bad respnse', async () => {
    const threadClient = new StubChatThreadClient();
    const fakeToken: CommunicationTokenCredential = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getToken: (options?: CommunicationGetTokenOptions): Promise<MockAccessToken> => {
        return new Promise<MockAccessToken>((resolve) => {
          resolve({ token: 'anyToken', expiresOnTimestamp: Date.now() });
        });
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function
      dispose(): any {}
    };
    const adapter = await createChatAdapterWithStubs(new StubChatClient(threadClient), fakeToken);
    const errorListener = new ErrorListener(adapter);
    {
      await expect(adapter.downloadAttachments({ attachmentUrls: ['somefakeUrl'] })).rejects.toThrow();
      expect(errorListener.errors.length).toBe(1);
      expect(errorListener.errors[0].target).toBe('ChatThreadClient.getMessage');
      expect(errorListener.errors[0].innerError.message).toBe('fetch is not defined');
    }
  });
});

/* @conditional-compile-remove(teams-inline-images-and-file-sharing)and-file-sharing)and-file-sharing)and-file-sharing) */
type MockAccessToken = {
  token: string;
  expiresOnTimestamp: number;
};

const createChatAdapterWithStubs = async (
  chatClient: StubChatClient,
  fakeToken?: CommunicationTokenCredential
): Promise<ChatAdapter> => {
  // ChatClient constructor must return a ChatClient. StubChatClient only implements the
  // public interface of ChatClient. So we are forced to lose some type information here.
  ChatClientMock.mockImplementation((): ChatClient => {
    return chatClient as unknown as ChatClient;
  });

  let token: CommunicationTokenCredential;
  if (fakeToken) {
    token = fakeToken;
  } else {
    // This stub credential is ignored by the stub ChatClient.
    token = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function
      getToken(): any {},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function
      dispose(): any {}
    };
  }
  return await createAzureCommunicationChatAdapter({
    endpoint: 'stubEndpointUrl',
    userId: { communicationUserId: 'stubUserId' },
    displayName: 'stubDisplayName',
    credential: token,
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
