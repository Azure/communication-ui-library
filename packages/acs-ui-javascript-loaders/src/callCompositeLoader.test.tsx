// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CallCompositeLoaderProps } from './callCompositeLoader';

jest.mock('@internal/react-composites', () => {
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
      userId: { communicationUserId: 'userId' },
      credential: new AzureCommunicationTokenCredential('token'),
      displayName: 'displayName',
      locator: { groupId: 'groupId' },
      callAdapterOptions: { callingSounds: { callEnded: { url: 'test/url/ended' } } },
      callCompositeOptions: { callControls: { microphoneButton: false } }
    };

    const mockHtmlElement = document.createElement('div');

    const { loadCallComposite } = await import('./callCompositeLoader');
    const { createAzureCommunicationCallAdapter } = await import('@internal/react-composites');
    await loadCallComposite(mockAdapterArgs, mockHtmlElement);

    expect(mockInitializeIcons).toHaveBeenCalled();
    expect(createAzureCommunicationCallAdapter).toHaveBeenCalled();
    expect(mockCreateRoot).toHaveBeenCalled();
  });
});
