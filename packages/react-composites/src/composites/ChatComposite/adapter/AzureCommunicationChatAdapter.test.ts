// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createAzureCommunicationChatAdapter } from './AzureCommunicationChatAdapter';
import { ChatAdapter } from './ChatAdapter';
import { StubChatClient } from './StubChatClient';
import { ChatClient } from '@azure/communication-chat';

jest.useFakeTimers();
jest.mock('@azure/communication-chat');

const ChatClientMock = ChatClient as jest.MockedClass<typeof ChatClient>;

describe('xkcd: Creation of a new AzureCommunicationChatAdapter with stub client', () => {
  it('does not throw', async () => {
    const adapter = await createChatAdaterWithStubs(new StubChatClient());
    adapter.setTopic('Some Topic');
  });
});

export const createChatAdaterWithStubs = async (chatClient: StubChatClient): Promise<ChatAdapter> => {
  // ChatClient constructor must return a ChatClient. StubChatClient only implements the
  // public interface of ChatClient. So we must lose typing here.
  ChatClientMock.mockImplementation((): ChatClient => {
    return chatClient as any;
  });
  return await createAzureCommunicationChatAdapter(
    { communicationUserId: 'stubUserId' },
    token,
    'stubEndointUrl',
    'stubThreadId',
    'stubDisplayName'
  );
};

// An actual (expired) token, to mollify token handlers before we hit the StubChatClient.
// TODO: Allow dependency injection in stateful client so that we can directly inject the StubChatClient, avoiding production glue code.
const token =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwMiIsIng1dCI6IjNNSnZRYzhrWVNLd1hqbEIySmx6NTRQVzNBYyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOjcxZWM1OTBiLWNiYWQtNDkwYy05OWM1LWI1NzhiZGFjZGU1NF8wMDAwMDAwYS1mYjg0LWFkOTgtNDdiNC1hNDNhMGQwMDI0YTkiLCJzY3AiOjE3OTIsImNzaSI6IjE2MjUwMzUwNDkiLCJpYXQiOjE2MjUwMzUwNDksImV4cCI6MTYyNTEyMTQ0OSwiYWNzU2NvcGUiOiJjaGF0IiwicmVzb3VyY2VJZCI6IjcxZWM1OTBiLWNiYWQtNDkwYy05OWM1LWI1NzhiZGFjZGU1NCJ9.ylByb-wR0G59zZldD4AxkHz-tkAUTGl3mvL0AHsR9FQix0w9ezgq-LDJfYvRyaAmH6IwKkPCD75Cod3PCYVAK5joGAr6QLGBOYtTpN3fr_NaB85MDzM3Sh0ftRQAMXocwk925hwGGcFg4mHEJKyuNcHsuWcrdt76s0U4Gyw5aFB9uOeXK9bpCBk5I5tNy1gT0rZWd23AQZP-agp3aPVnu-KNl1dmmSRQ6T4vAQXHi64Xc3dc2PJ86Txzeened6pT3Ww7jBVLVRLR-cDLqCPl0DdS4-3dxyns9IuuQ8ANILruYCB7jS6yXk77rUAeXKqgvWMLEYMJ6uOBslfd-gU1Aw';
