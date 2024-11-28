import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChatThreadClientProvider, useChatThreadClient } from './ChatThreadClientProvider';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { createStatefulChatClient } from '@internal/chat-stateful-client';

jest.mock('@azure/communication-common', () => {
  return {
    AzureCommunicationTokenCredential: jest.fn()
  };
});

jest.mock('@internal/chat-stateful-client', () => {
  return {
    createStatefulChatClient: jest.fn().mockReturnValue({
      getChatThreadClient: jest.fn().mockResolvedValue('mockChatThreadClient')
    })
  };
});

describe('ChatThreadClientProvider', () => {
  test('should provide the chatThreadClient to its children', () => {
    const statefulChatClient = createStatefulChatClient({
      userId: { communicationUserId: '1' },
      displayName: 'displayName',
      endpoint: 'endpointUrl',
      credential: new AzureCommunicationTokenCredential('token')
    });
    const mockChatThreadClient = statefulChatClient.getChatThreadClient('threadId');
    const ChildComponent = () => {
      const chatThreadClient = useChatThreadClient();
      expect(chatThreadClient).toBe(mockChatThreadClient);
      return <div>Child Component</div>;
    };

    render(
      <ChatThreadClientProvider chatThreadClient={mockChatThreadClient}>
        <ChildComponent />
      </ChatThreadClientProvider>
    );

    expect(screen.getByText('Child Component')).toBeDefined();
  });

  test('should throw an error if useChatThreadClient is called outside of ChatThreadClientProvider', () => {
    const ChildComponent = () => {
      expect(() => useChatThreadClient()).toThrow(
        'Please wrap components with ChatThreadClientProvider and initialize a chat thread client before calling the hook.'
      );
      return null;
    };

    render(<ChildComponent />);
  });
});
