// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(composite-js-helpers) */
import { CallCompositeOptions } from '@internal/react-composites';
/* @conditional-compile-remove(composite-js-helpers) */
import { OutboundCallCompositeLoaderProps } from './outboundCallCompositeLoader';

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
  test('test to fulfill no empty test runners', () => {
    expect(true).toBeTruthy();
  });
  /* @conditional-compile-remove(composite-js-helpers) */
  test('loadCallComposite should call createAzureCommunicationCallAdapter and createRoot', async () => {
    const mockAdapterArgs: OutboundCallCompositeLoaderProps = {
      userId: 'userId',
      token: 'token',
      displayName: 'displayName',
      targetCallees: [{ phoneNumber: '+14035556666' }],
      options: { callingSounds: { callEnded: { url: 'test/url/ended' } } }
    };

    const mockHtmlElement = document.createElement('div');
    const mockCompositeOptions: CallCompositeOptions = {};

    const { loadOutboundCallComposite } = await import('./outboundCallCompositeLoader');
    const { createAzureCommunicationCallAdapter } = await import('@Internal/react-composites');
    await loadOutboundCallComposite(mockAdapterArgs, mockHtmlElement, mockCompositeOptions);

    expect(mockInitializeIcons).toHaveBeenCalled();
    expect(createAzureCommunicationCallAdapter).toHaveBeenCalled();
    expect(mockCreateRoot).toHaveBeenCalled();
  });
});
