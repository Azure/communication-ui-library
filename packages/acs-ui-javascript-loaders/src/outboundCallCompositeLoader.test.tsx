// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(composite-js-helpers) */
import { CallCompositeOptions } from '@internal/react-composites';
/* @conditional-compile-remove(composite-js-helpers) */
import { OutboundCallCompositeLoaderProps } from './outboundCallCompositeLoader';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

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
  test('test to fulfill no empty test runners', () => {
    expect(true).toBeTruthy();
  });
  /* @conditional-compile-remove(composite-js-helpers) */
  test('loadCallComposite should call createAzureCommunicationCallAdapter and createRoot', async () => {
    const mockCompositeOptions: CallCompositeOptions = {};
    const mockAdapterArgs: OutboundCallCompositeLoaderProps = {
      userId: { communicationUserId: 'userId' },
      credential: new AzureCommunicationTokenCredential('token'),
      displayName: 'displayName',
      targetCallees: [{ phoneNumber: '+14035556666' }],
      callAdapterOptions: { callingSounds: { callEnded: { url: 'test/url/ended' } } },
      callCompositeOptions: mockCompositeOptions
    };

    const mockHtmlElement = document.createElement('div');

    const { loadOutboundCallComposite } = await import('./outboundCallCompositeLoader');
    const { createAzureCommunicationCallAdapter } = await import('@internal/react-composites');
    await loadOutboundCallComposite(mockAdapterArgs, mockHtmlElement);

    expect(mockInitializeIcons).toHaveBeenCalled();
    expect(createAzureCommunicationCallAdapter).toHaveBeenCalled();
    expect(mockCreateRoot).toHaveBeenCalled();
  });
});
