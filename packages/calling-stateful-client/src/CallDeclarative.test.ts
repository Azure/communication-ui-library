// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CallerInfo,
  CallFeatureFactoryType,
  DiagnosticsCallFeature,
  Features,
  RecordingCallFeature,
  TranscriptionCallFeature,
  TransferCallFeature
} from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { callDeclaratify, DeclarativeCall } from './CallDeclarative';
import { convertSdkCallToDeclarativeCall } from './Converter';
import {
  addMockEmitter,
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
    TransferCallFeature: {
      transfer: () => {
        return addMockEmitter({ state: 'None' });
      }
    },
    Features: {
      get Recording(): CallFeatureFactoryType<RecordingCallFeature> {
        return MockRecordingCallFeatureImpl;
      },
      get Transfer(): CallFeatureFactoryType<TransferCallFeature> {
        return MockTransferCallFeatureImpl;
      },
      get Transcription(): CallFeatureFactoryType<TranscriptionCallFeature> {
        return MockTranscriptionCallFeatureImpl;
      },
      get Diagnostics(): CallFeatureFactoryType<DiagnosticsCallFeature> {
        return StubDiagnosticsCallFeatureImpl;
      }
    }
  };
});

const mockCallId = 'a';

describe('declarative call', () => {
  test('proxies api() to return a DeclarativeTransferCallFeature which proxies transfer() in state', async () => {
    const mockCall = createMockCall(mockCallId);
    mockCall.callerInfo = { identifier: { kind: 'communicationUser' } } as CallerInfo;
    mockCall.state = 'None';
    mockCall.direction = 'Incoming';
    mockCall.isMuted = false;
    mockCall.isScreenSharingOn = false;
    mockCall.localVideoStreams = [];
    mockCall.remoteParticipants = [];
    mockCall.api = createMockApiFeatures(new Map());

    const context = new CallContext({ kind: 'communicationUser', communicationUserId: '' });
    context.setCall(convertSdkCallToDeclarativeCall(mockCall));

    const declarativeCall = callDeclaratify(mockCall, context);

    const declarativeTransfer = declarativeCall.api(Features.Transfer);

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
    mockCall.api = createMockApiFeatures(new Map());

    const context = new CallContext({ kind: 'communicationUser', communicationUserId: '' });
    context.setCall(convertSdkCallToDeclarativeCall(mockCall));

    const declarativeCall = callDeclaratify(mockCall, context) as DeclarativeCall;

    const declarativeTransfer = declarativeCall.api(Features.Transfer);

    const transfer = declarativeTransfer.transfer({ targetParticipant: { communicationUserId: 'a' } }) as any;

    expect(transfer.emitter.eventNames().length).toBe(1);

    declarativeCall.unsubscribe();

    expect(transfer.emitter.eventNames().length).toBe(0);
  });
});
