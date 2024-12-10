// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChatClientProvider, useChatClient } from './ChatClientProvider';
import { createStatefulChatClient } from '@internal/chat-stateful-client';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
jest.mock('@azure/communication-common', () => {
  return {
    AzureCommunicationTokenCredential: jest.fn()
  };
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
jest.mock('@internal/chat-stateful-client', () => {
  return {
    createStatefulChatClient: jest.fn().mockResolvedValue('mockStatefulChatClient')
  };
});

describe('ChatClientProvider', () => {
  test('should provide the chat client to its children', () => {
    const statefulChatClient = createStatefulChatClient({
      userId: { communicationUserId: '1' },
      displayName: 'displayName',
      endpoint: 'endpointUrl',
      credential: new AzureCommunicationTokenCredential('token')
    });
    const ChildComponent = (): JSX.Element => {
      const chatClient = useChatClient();
      expect(chatClient).toBe(statefulChatClient);
      return <div>Child Component</div>;
    };

    render(
      <ChatClientProvider chatClient={statefulChatClient}>
        <ChildComponent />
      </ChatClientProvider>
    );
    expect(screen.getByText('Child Component')).toBeDefined();
  });

  test('should throw an error if useChatClient is called outside of ChatClientProvider', () => {
    const ChildComponent = (): JSX.Element | null => {
      expect(() => useChatClient()).toThrow(
        'Please wrap components with ChatClientProvider and initialize a chat client before calling the hook!'
      );
      return null;
    };

    render(<ChildComponent />);
  });
});
