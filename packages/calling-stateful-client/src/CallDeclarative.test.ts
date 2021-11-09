// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CallerInfo,
  CallFeatureApiFactory,
  UserFacingDiagnosticsFeature,
  Features,
  RecordingCallFeature,
  TranscriptionCallFeature,
  TransferCallFeature
} from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { callDeclaratify, DeclarativeCall } from './CallDeclarative';
import { convertSdkCallToDeclarativeCall } from './Converter';
import {
  createMockApiFeatures,
  createMockCall,
  MockRecordingCallFeatureImpl,
  MockTranscriptionCallFeatureImpl,
  MockTransferCallFeatureImpl,
  StubDiagnosticsCallFeatureImpl,
  waitWithBreakCondition
} from './TestUtils';

jest.mock('@azure/communication-calling', () => {
  return {
    Features: {
      get Recording(): CallFeatureApiFactory<RecordingCallFeature> {
        return { callApiCtor: MockRecordingCallFeatureImpl };
      },
      get Transfer(): CallFeatureApiFactory<TransferCallFeature> {
        return { callApiCtor: MockTransferCallFeatureImpl };
      },
      get Transcription(): CallFeatureApiFactory<TranscriptionCallFeature> {
        return { callApiCtor: MockTranscriptionCallFeatureImpl };
      },
      get Diagnostics(): CallFeatureApiFactory<UserFacingDiagnosticsFeature> {
        return { callApiCtor: StubDiagnosticsCallFeatureImpl };
      }
    }
  };
});

const mockCallId = 'a';

describe('declarative call', () => {
  test('proxies feature() to return a DeclarativeTransferCallFeature which proxies transfer() in state', async () => {
    const mockCall = createMockCall(mockCallId);
    mockCall.callerInfo = { identifier: { kind: 'communicationUser' } } as CallerInfo;
    mockCall.state = 'None';
    mockCall.direction = 'Incoming';
    mockCall.isMuted = false;
    mockCall.isScreenSharingOn = false;
    mockCall.localVideoStreams = [];
    mockCall.remoteParticipants = [];
    mockCall.feature = createMockApiFeatures(new Map());

    const context = new CallContext({ kind: 'communicationUser', communicationUserId: '' });
    context.setCall(convertSdkCallToDeclarativeCall(mockCall));

    const declarativeCall = callDeclaratify(mockCall, context);

    const declarativeTransfer = declarativeCall.feature(Features.Transfer);

    const transfer = declarativeTransfer.transfer({ targetParticipant: { communicationUserId: 'a' } }) as any;

    expect(context.getState().calls[mockCallId]?.transfer.requestedTransfers.length).toBe(1);
    expect(context.getState().calls[mockCallId]?.transfer.requestedTransfers[0].state).toBe('None');

    transfer.state = 'Transferred';
    transfer.emit('stateChanged');

    await waitWithBreakCondition(
      () => context.getState().calls[mockCallId]?.transfer.requestedTransfers[0].state !== 'None'
    );

    expect(context.getState().calls[mockCallId]?.transfer.requestedTransfers[0].state).toBe('Transferred');
  });

  test('when unsubscribe called unsubscribes from DeclarativeTransferCallFeature', async () => {
    const mockCall = createMockCall(mockCallId);
    mockCall.state = 'None';
    mockCall.direction = 'Incoming';
    mockCall.isMuted = false;
    mockCall.isScreenSharingOn = false;
    mockCall.localVideoStreams = [];
    mockCall.remoteParticipants = [];
    mockCall.feature = createMockApiFeatures(new Map());

    const context = new CallContext({ kind: 'communicationUser', communicationUserId: '' });
    context.setCall(convertSdkCallToDeclarativeCall(mockCall));

    const declarativeCall = callDeclaratify(mockCall, context) as DeclarativeCall;

    const declarativeTransfer = declarativeCall.feature(Features.Transfer);

    const transfer = declarativeTransfer.transfer({ targetParticipant: { communicationUserId: 'a' } }) as any;

    expect(transfer.emitter.eventNames().length).toBe(1);

    declarativeCall.unsubscribe();

    expect(transfer.emitter.eventNames().length).toBe(0);
  });
});
