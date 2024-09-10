// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallCompositeOptions } from '@internal/react-composites';
import { CallCompositeLoaderProps } from './callCompositeLoader';

jest.mock('@Internal/react-composites', () => {
  return {
    createAzureCommunicationCallAdapter: jest.fn().mockResolvedValue('mockAdapter'),
    CallComposite: jest.fn().mockReturnValue('mockCallComposite')
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

describe('CallCompositeLoader tests', () => {
  test('loadCallComposite should call createAzureCommunicationCallAdapter and createRoot', async () => {
    const mockAdapterArgs: CallCompositeLoaderProps = {
      userId: 'userId',
      token: 'token',
      displayName: 'displayName',
      locator: { groupId: 'groupId' },
      options: { callingSounds: { callEnded: { url: 'test/url/ended' } } }
    };

    const mockHtmlElement = document.createElement('div');
    const mockCompositeOptions: CallCompositeOptions = {};

    const { loadCallComposite } = await import('./callCompositeLoader');
    const { createAzureCommunicationCallAdapter } = await import('@Internal/react-composites');
    await loadCallComposite(mockAdapterArgs, mockHtmlElement, mockCompositeOptions);

    expect(mockInitializeIcons).toHaveBeenCalled();
    expect(createAzureCommunicationCallAdapter).toHaveBeenCalled();
    expect(mockCreateRoot).toHaveBeenCalled();
  });
});
