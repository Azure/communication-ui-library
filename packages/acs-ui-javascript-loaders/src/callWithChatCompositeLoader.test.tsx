// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallWithChatCompositeOptions } from '@internal/react-composites';
import { CallWithChatCompositeLoaderProps } from './callWithChatCompositeLoader';

jest.mock('@Internal/react-composites', () => {
  return {
    createAzureCommunicationCallWithChatAdapter: jest.fn().mockResolvedValue('mockAdapter'),
    CallWithChatComposite: jest.fn().mockReturnValue('mockCallComposite')
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

describe('CallWithChatCompositeLoader tests', () => {
  test('loadCallWithChatComposite should call createAzureCommunicationCallWithChatAdapter and createRoot', async () => {
    const mockAdapterArgs: CallWithChatCompositeLoaderProps = {
      userId: 'userId',
      token: 'token',
      endpoint: 'endpoint',
      displayName: 'displayName',
      locator: { callLocator: { groupId: 'groupId' }, chatThreadId: 'threadId' }
    };

    const mockHtmlElement = document.createElement('div');
    const mockCompositeOptions: CallWithChatCompositeOptions = {
      galleryOptions: { layout: 'floatingLocalVideo' }
    };

    const { loadCallWithChatComposite } = await import('./callWithChatCompositeLoader');
    const { createAzureCommunicationCallWithChatAdapter } = await import('@Internal/react-composites');
    await loadCallWithChatComposite(mockAdapterArgs, mockHtmlElement, mockCompositeOptions);

    expect(mockInitializeIcons).toHaveBeenCalled();
    expect(createAzureCommunicationCallWithChatAdapter).toHaveBeenCalled();
    expect(mockCreateRoot).toHaveBeenCalled();
  });
});
