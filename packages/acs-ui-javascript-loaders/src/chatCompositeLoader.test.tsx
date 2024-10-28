// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatCompositeOptions } from '@internal/react-composites';
import { ChatCompositeLoaderProps } from './chatCompositeLoader';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

jest.mock('@internal/react-composites', () => {
  return {
    createAzureCommunicationChatAdapter: jest.fn().mockResolvedValue('mockAdapter'),
    ChatComposite: jest.fn().mockReturnValue('mockChatComposite')
  };
});
const mockCreateRoot = jest.fn();
jest.mock('react-dom/client', () => {
  return {
    createRoot: jest.fn().mockReturnValue({ render: mockCreateRoot })
  };
});

jest.mock('@azure/communication-common', () => {
  return {
    AzureCommunicationTokenCredential: jest.fn(),
    CommunicationUserIdentifier: jest.fn(),
    createIdentifierFromRawId: jest.fn().mockReturnValue('mockIdentifier')
  };
});

const mockInitializeIcons = jest.fn();
jest.mock('@fluentui/react', () => {
  return {
    initializeIcons: mockInitializeIcons
  };
});

describe('ChatCompositeLoader tests', () => {
  test('loadChatComposite should call createAzureCommunicationChatAdapter and createRoot', async () => {
    const mockCompositeOptions: ChatCompositeOptions = {
      errorBar: true
    };
    const mockAdapterArgs: ChatCompositeLoaderProps = {
      endpoint: 'endpoint',
      credential: new AzureCommunicationTokenCredential('token'),
      userId: { communicationUserId: 'userId' },
      displayName: 'displayName',
      threadId: 'threadId',
      chatCompositeOptions: mockCompositeOptions
    };

    const mockHtmlElement = document.createElement('div');

    const { loadChatComposite } = await import('./chatCompositeLoader');
    const { createAzureCommunicationChatAdapter } = await import('@internal/react-composites');
    await loadChatComposite(mockAdapterArgs, mockHtmlElement);

    expect(mockInitializeIcons).toHaveBeenCalled();
    expect(createAzureCommunicationChatAdapter).toHaveBeenCalled();
    expect(mockCreateRoot).toHaveBeenCalled();
  });
});
