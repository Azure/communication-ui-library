// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(composite-js-helpers) */
import { CallWithChatCompositeOptions } from '@internal/react-composites';
/* @conditional-compile-remove(composite-js-helpers) */
import { CallWithChatCompositeLoaderProps } from './callWithChatCompositeLoader';

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
  test('test to fulfill no empty test runners', () => {
    expect(true).toBeTruthy();
  });
  /* @conditional-compile-remove(composite-js-helpers) */
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
    const { createAzureCommunicationCallWithChatAdapter } = await import('@internal/react-composites');
    await loadCallWithChatComposite(mockAdapterArgs, mockHtmlElement, mockCompositeOptions);

    expect(mockInitializeIcons).toHaveBeenCalled();
    expect(createAzureCommunicationCallWithChatAdapter).toHaveBeenCalled();
    expect(mockCreateRoot).toHaveBeenCalled();
  });
});
