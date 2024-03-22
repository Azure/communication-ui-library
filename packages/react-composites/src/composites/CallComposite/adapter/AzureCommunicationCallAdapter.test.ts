// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  CommonCallAdapterOptions,
  createAzureCommunicationCallAdapterFromClient
} from './AzureCommunicationCallAdapter';
import { MockCallAgent, MockCallClient } from '../../CallWithChatComposite/adapter/TestUtils';
import { StatefulCallClient } from '@internal/calling-stateful-client';

describe('Adapter is created as expected', () => {
  test('test to fulfill no empty test runners', () => {
    expect(true).toBeTruthy();
  });
  test('when cerating an adapter without sounds provided we should not see it in state', async () => {
    const mockCallClient = new MockCallClient() as unknown as StatefulCallClient;

    const mockCallAgent = new MockCallAgent();
    const locator = { groupId: 'some group id' };

    const adapter = await createAzureCommunicationCallAdapterFromClient(mockCallClient, mockCallAgent, locator);
    expect(adapter).toBeDefined();
    expect(adapter.getState().sounds).toBeUndefined();
  });
  test('when creating an adapter with sounds provided we should see it in state', async () => {
    const mockCallClient = new MockCallClient() as unknown as StatefulCallClient;

    const mockCallAgent = new MockCallAgent();
    const locator = { groupId: 'some group id' };
    const options: CommonCallAdapterOptions = {
      callingSounds: {
        callEnded: { url: 'test/url/ended' },
        callRinging: { url: 'test/url/ringing' },
        callBusy: { url: 'test/url/busy' }
      }
    };

    const adapter = await createAzureCommunicationCallAdapterFromClient(
      mockCallClient,
      mockCallAgent,
      locator,
      options
    );
    expect(adapter).toBeDefined();
    expect(adapter.getState().sounds).toBeDefined();
    expect(adapter.getState().sounds?.callEnded).toBeDefined();
    expect(adapter.getState().sounds?.callEnded).toEqual({ url: 'test/url/ended' });
    expect(adapter.getState().sounds?.callRinging).toBeDefined();
    expect(adapter.getState().sounds?.callRinging).toEqual({ url: 'test/url/ringing' });
    expect(adapter.getState().sounds?.callBusy).toBeDefined();
    expect(adapter.getState().sounds?.callBusy).toEqual({ url: 'test/url/busy' });
  });
  test('when creating an adapter with one sound we should see it and not the other', async () => {
    const mockCallClient = new MockCallClient() as unknown as StatefulCallClient;

    const mockCallAgent = new MockCallAgent();
    const locator = { groupId: 'some group id' };
    const options: CommonCallAdapterOptions = {
      callingSounds: {
        callEnded: { url: 'test/url/ended' }
      }
    };

    const adapter = await createAzureCommunicationCallAdapterFromClient(
      mockCallClient,
      mockCallAgent,
      locator,
      options
    );
    expect(adapter).toBeDefined();
    expect(adapter.getState().sounds).toBeDefined();
    expect(adapter.getState().sounds?.callEnded).toBeDefined();
    expect(adapter.getState().sounds?.callEnded).toEqual({ url: 'test/url/ended' });
    expect(adapter.getState().sounds?.callRinging).toBeUndefined();
    expect(adapter.getState().sounds?.callBusy).toBeUndefined();
  });
});
