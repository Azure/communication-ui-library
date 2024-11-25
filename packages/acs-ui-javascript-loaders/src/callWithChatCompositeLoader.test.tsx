// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallWithChatCompositeOptions } from '@internal/react-composites';
import { CallWithChatCompositeLoaderProps } from './callWithChatCompositeLoader';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

jest.mock('@internal/react-composites', () => {
  return {
    createAzureCommunicationCallWithChatAdapter: jest.fn().mockResolvedValue('mockAdapter'),
    CallWithChatComposite: jest.fn().mockReturnValue('mockCallWithChatComposite')
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
    const mockCompositeOptions: CallWithChatCompositeOptions = {
      galleryOptions: { layout: 'floatingLocalVideo' }
    };
    const mockAdapterArgs: CallWithChatCompositeLoaderProps = {
      userId: { communicationUserId: 'userId' },
      credential: new AzureCommunicationTokenCredential('token'),
      endpoint: 'endpoint',
      displayName: 'displayName',
      locator: { callLocator: { groupId: 'groupId' }, chatThreadId: 'threadId' },
      callWithChatCompositeOptions: mockCompositeOptions
    };

    const mockHtmlElement = document.createElement('div');

    const { loadCallWithChatComposite } = await import('./callWithChatCompositeLoader');
    const { createAzureCommunicationCallWithChatAdapter } = await import('@internal/react-composites');
    await loadCallWithChatComposite(mockAdapterArgs, mockHtmlElement);

    expect(mockInitializeIcons).toHaveBeenCalled();
    expect(createAzureCommunicationCallWithChatAdapter).toHaveBeenCalled();
    expect(mockCreateRoot).toHaveBeenCalled();
  });
});
