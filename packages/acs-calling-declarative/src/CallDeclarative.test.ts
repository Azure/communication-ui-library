// © Microsoft Corporation. All rights reserved.

import { CallerInfo } from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { callDeclaratify } from './CallDeclarative';
import { convertSdkCallToDeclarativeCall } from './Converter';
import { createMockCall } from './TestUtils';

jest.mock('@azure/communication-calling');

const mockCallId = 'a';

describe('declarative call', () => {
  test('should proxy mute and unmute functions and update state', async () => {
    const mockCall = createMockCall(mockCallId);
    mockCall.callerInfo = { identifier: { kind: 'communicationUser' } } as CallerInfo;
    mockCall.state = 'None';
    mockCall.direction = 'Incoming';
    mockCall.isMuted = false;
    mockCall.isScreenSharingOn = false;
    mockCall.localVideoStreams = [];
    mockCall.remoteParticipants = [];
    mockCall.mute = () => {
      return Promise.resolve();
    };
    mockCall.unmute = () => {
      return Promise.resolve();
    };

    const context = new CallContext();
    context.setCall(convertSdkCallToDeclarativeCall(mockCall));

    const declarativeCall = callDeclaratify(mockCall, context);

    mockCall.isMuted = true;
    await declarativeCall.mute();

    expect(context.getState().calls.get(mockCallId)?.isMuted).toBe(true);

    mockCall.isMuted = false;
    await declarativeCall.unmute();

    expect(context.getState().calls.get(mockCallId)?.isMuted).toBe(false);
  });
});
