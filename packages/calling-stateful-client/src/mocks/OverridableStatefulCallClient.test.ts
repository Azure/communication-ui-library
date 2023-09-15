// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { VideoDeviceInfo } from '@azure/communication-calling';
import { createStatefulCallClient } from '../StatefulCallClient';
import { createOverridableStatefulCallClient } from './OverridableStatefulCallClient';

describe('OverridableStatefulCallClient', () => {
  test('should override cameras', () => {
    // Check that initial overrides are applied
    const testCamera: VideoDeviceInfo = {
      id: 'testCameraId1',
      name: 'testCameraName1',
      deviceType: 'UsbCamera'
    };
    const baseStatefulCallClient = createStatefulCallClient({ userId: { communicationUserId: 'testUserId' } });
    const overridableStatefulCallClient1 = createOverridableStatefulCallClient(baseStatefulCallClient, {
      deviceManager: {
        cameras: [testCamera]
      }
    });
    expect(overridableStatefulCallClient1.getState()).toMatchInlineSnapshot(`
      {
        "alternateCallerId": undefined,
        "callAgent": undefined,
        "calls": {},
        "callsEnded": {},
        "deviceManager": {
          "cameras": [
            {
              "deviceType": "UsbCamera",
              "id": "testCameraId1",
              "name": "testCameraName1",
            },
          ],
          "isSpeakerSelectionAvailable": false,
          "microphones": [],
          "speakers": [],
          "unparentedViews": [],
        },
        "environmentInfo": undefined,
        "incomingCalls": {},
        "incomingCallsEnded": {},
        "latestErrors": {},
        "userId": {
          "communicationUserId": "testUserId",
          "kind": "communicationUser",
        },
      }
    `);

    // Check updating overrides works
    const testCamera2: VideoDeviceInfo = {
      id: 'testCameraId2',
      name: 'testCameraName2',
      deviceType: 'UsbCamera'
    };
    overridableStatefulCallClient1.updateLocalOverrides({
      deviceManager: {
        cameras: [testCamera2]
      }
    });
    expect(overridableStatefulCallClient1.getState().deviceManager.cameras).toEqual([testCamera2]);

    // Check applying overrides with an existing instance works
    const testCamera3: VideoDeviceInfo = {
      id: 'testCameraId3',
      name: 'testCameraName3',
      deviceType: 'UsbCamera'
    };
    const overridableStatefulCallClient2 = createOverridableStatefulCallClient(overridableStatefulCallClient1, {
      deviceManager: {
        cameras: [testCamera3]
      }
    });

    expect(overridableStatefulCallClient2.getState().deviceManager.cameras).toEqual([testCamera3]);

    // Clear State
    overridableStatefulCallClient2.clearLocalOverrides();
    expect(overridableStatefulCallClient2.getState().deviceManager.cameras).toEqual([testCamera2]);
  });

  test('onStateChange should be called when local overrides are updated', () => {
    const baseStatefulCallClient = createStatefulCallClient({ userId: { communicationUserId: 'testUserId' } });
    const overridableStatefulCallClient = createOverridableStatefulCallClient(baseStatefulCallClient);
    const onStateChange = jest.fn();
    overridableStatefulCallClient.onStateChange(onStateChange);
    expect(onStateChange).toBeCalledTimes(0);

    const testCamera: VideoDeviceInfo = {
      id: 'testCameraId1',
      name: 'testCameraName1',
      deviceType: 'UsbCamera'
    };

    overridableStatefulCallClient.updateLocalOverrides({
      deviceManager: {
        cameras: [testCamera]
      }
    });
    expect(onStateChange).toBeCalledTimes(1);
    expect(onStateChange).toHaveBeenLastCalledWith({
      alternateCallerId: undefined,
      callAgent: undefined,
      calls: {},
      callsEnded: {},
      deviceManager: {
        cameras: [
          {
            deviceType: 'UsbCamera',
            id: 'testCameraId1',
            name: 'testCameraName1'
          }
        ],
        isSpeakerSelectionAvailable: false,
        microphones: [],
        speakers: [],
        unparentedViews: []
      },
      environmentInfo: undefined,
      incomingCalls: {},
      incomingCallsEnded: {},
      latestErrors: {},
      userId: {
        communicationUserId: 'testUserId',
        kind: 'communicationUser'
      }
    });
    overridableStatefulCallClient.clearLocalOverrides();
    expect(onStateChange).toHaveBeenLastCalledWith({
      alternateCallerId: undefined,
      callAgent: undefined,
      calls: {},
      callsEnded: {},
      environmentInfo: undefined,
      incomingCalls: {},
      incomingCallsEnded: {},
      latestErrors: {},
      userId: {
        communicationUserId: 'testUserId',
        kind: 'communicationUser'
      }
    });
    expect(onStateChange).toBeCalledTimes(2);

    // test offstatechange
    overridableStatefulCallClient.offStateChange(onStateChange);
    overridableStatefulCallClient.updateLocalOverrides({
      deviceManager: {
        cameras: [testCamera]
      }
    });
    expect(onStateChange).toBeCalledTimes(2);
  });
});
