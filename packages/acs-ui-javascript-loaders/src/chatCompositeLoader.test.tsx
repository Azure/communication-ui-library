// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(composite-js-helpers) */
import { ChatCompositeOptions } from '@internal/react-composites';
/* @conditional-compile-remove(composite-js-helpers) */
import { ChatCompositeLoaderProps } from './chatCompositeLoader';

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
  test('test to fulfill no empty test runners', () => {
    expect(true).toBeTruthy();
  });
  /* @conditional-compile-remove(composite-js-helpers) */
  test('loadChatComposite should call createAzureCommunicationChatAdapter and createRoot', async () => {
    const mockAdapterArgs: ChatCompositeLoaderProps = {
      endpoint: 'endpoint',
      token: 'token',
      userId: 'userId',
      displayName: 'displayName',
      threadId: 'threadId'
    };

    const mockHtmlElement = document.createElement('div');
    const mockCompositeOptions: ChatCompositeOptions = {
      errorBar: true
    };
    const { loadChatComposite } = await import('./chatCompositeLoader');
    const { createAzureCommunicationChatAdapter } = await import('@internal/react-composites');
    await loadChatComposite(mockAdapterArgs, mockHtmlElement, mockCompositeOptions);

    expect(mockInitializeIcons).toHaveBeenCalled();
    expect(createAzureCommunicationChatAdapter).toHaveBeenCalled();
    expect(mockCreateRoot).toHaveBeenCalled();
  });
});
