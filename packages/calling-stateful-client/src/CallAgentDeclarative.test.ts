// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  Call,
  CallAgent,
  CallFeatureFactoryType,
  CollectionUpdatedEvent,
  GroupChatCallLocator,
  GroupLocator,
  IncomingCallEvent,
  JoinCallOptions,
  MeetingLocator,
  RecordingCallFeature,
  StartCallOptions,
  TranscriptionCallFeature,
  TransferCallFeature
} from '@azure/communication-calling';
import { CommunicationUserIdentifier, PhoneNumberIdentifier, UnknownIdentifier } from '@azure/communication-common';
import EventEmitter from 'events';
import { callAgentDeclaratify } from './CallAgentDeclarative';
import { CallContext, MAX_CALL_HISTORY_LENGTH } from './CallContext';
import { InternalCallContext } from './InternalCallContext';
import {
  createMockCall,
  createMockIncomingCall,
  createMockRemoteParticipant,
  MockCall,
  MockIncomingCall,
  mockoutObjectFreeze,
  MockRecordingCallFeatureImpl,
  MockTranscriptionCallFeatureImpl,
  MockTransferCallFeatureImpl,
  waitWithBreakCondition
} from './TestUtils';

mockoutObjectFreeze();

jest.mock('@azure/communication-calling', () => {
  return {
    Features: {
      get Recording(): CallFeatureFactoryType<RecordingCallFeature> {
        return MockRecordingCallFeatureImpl;
      },
      get Transfer(): CallFeatureFactoryType<TransferCallFeature> {
        return MockTransferCallFeatureImpl;
      },
      get Transcription(): CallFeatureFactoryType<TranscriptionCallFeature> {
        return MockTranscriptionCallFeatureImpl;
      }
    }
  };
});

const mockRemoteParticipantId = 'a';
const mockCallId = 'b';

class MockCallAgent implements CallAgent {
  calls: MockCall[] = [];
  displayName = undefined;
  emitter = new EventEmitter();

  startCall(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    participants: (CommunicationUserIdentifier | PhoneNumberIdentifier | UnknownIdentifier)[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: StartCallOptions
  ): Call {
    const remoteParticipant = createMockRemoteParticipant(mockRemoteParticipantId);
    const call = createMockCall(mockCallId);
    call.remoteParticipants = [remoteParticipant];
    return call;
  }
  join(groupLocator: GroupLocator, options?: JoinCallOptions): Call;
  join(groupChatCallLocator: GroupChatCallLocator, options?: JoinCallOptions): Call;
  join(meetingLocator: MeetingLocator, options?: JoinCallOptions): Call;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  join(meetingLocator: any, options?: any): Call {
    const remoteParticipant = createMockRemoteParticipant(mockRemoteParticipantId);
    const call = createMockCall(mockCallId);
    call.remoteParticipants = [remoteParticipant];
    return call;
  }
  dispose(): Promise<void> {
    return Promise.resolve();
  }
  on(event: 'incomingCall', listener: IncomingCallEvent): void;
  on(event: 'callsUpdated', listener: CollectionUpdatedEvent<Call>): void;
  on(event: any, listener: any): void {
    this.emitter.on(event, listener);
  }
  off(event: 'incomingCall', listener: IncomingCallEvent): void;
  off(event: 'callsUpdated', listener: CollectionUpdatedEvent<Call>): void;
  off(event: any, listener: any): void {
    this.emitter.off(event, listener);
  }

  emit(event: string, data: any): void {
    this.emitter.emit(event, data);
  }
}

describe('declarative call agent', () => {
  test('should subscribe to callsUpdated and incomingCall events when created', () => {
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext('');
    const internalContext = new InternalCallContext();
    callAgentDeclaratify(mockCallAgent, context, internalContext);
    expect(mockCallAgent.emitter.eventNames().includes('incomingCall')).toBe(true);
    expect(mockCallAgent.emitter.eventNames().includes('callsUpdated')).toBe(true);
  });

  test('should subscribe to any existing calls and add to state when created', () => {
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext('');
    const mockCall = createMockCall(mockCallId);
    mockCallAgent.calls = [mockCall];
    const internalContext = new InternalCallContext();
    callAgentDeclaratify(mockCallAgent, context, internalContext);
    expect(context.getState().calls.size).toBe(1);
    expect(mockCall.emitter.eventNames().length).not.toBe(0);
  });

  test('should unsubscribe but not clear data when disposed is invoked', async () => {
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext('');
    const internalContext = new InternalCallContext();
    const mockCall = createMockCall(mockCallId);
    mockCallAgent.calls = [mockCall];
    const declarativeCallAgent = callAgentDeclaratify(mockCallAgent, context, internalContext);
    await declarativeCallAgent.dispose();
    expect(mockCall.emitter.eventNames().length).toBe(0);
    expect(mockCallAgent.emitter.eventNames().length).toBe(0);
    expect(context.getState().calls.size).toBe(1);
  });

  test('should clear state if newly created agent and if there is old existing state', async () => {
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext('');
    const internalContext = new InternalCallContext();
    const mockCall = createMockCall(mockCallId);
    mockCallAgent.calls = [mockCall];
    const declarativeCallAgent = callAgentDeclaratify(mockCallAgent, context, internalContext);
    await declarativeCallAgent.dispose();
    expect(mockCall.emitter.eventNames().length).toBe(0);
    expect(mockCallAgent.emitter.eventNames().length).toBe(0);
    expect(context.getState().calls.size).toBe(1);
    mockCallAgent.calls = [];
    callAgentDeclaratify(mockCallAgent, context, internalContext);
    expect(context.getState().calls.size).toBe(0);
    expect(internalContext.getRemoteVideoStreamsAll().size).toBe(0);
  });

  test('should update state with new call when startCall is invoked', () => {
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext('');
    const internalContext = new InternalCallContext();
    expect(context.getState().calls.size).toBe(0);
    const declarativeCallAgent = callAgentDeclaratify(mockCallAgent, context, internalContext);
    declarativeCallAgent.startCall([]);
    expect(context.getState().calls.size).toBe(1);
  });

  test('should update state with new call when join is invoked', () => {
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext('');
    const internalContext = new InternalCallContext();
    expect(context.getState().calls.size).toBe(0);
    const declarativeCallAgent = callAgentDeclaratify(mockCallAgent, context, internalContext);
    declarativeCallAgent.join({ meetingLink: '' });
    expect(context.getState().calls.size).toBe(1);
  });

  test('should move call to callEnded when call is removed and add endTime', async () => {
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext('');
    const internalContext = new InternalCallContext();
    expect(context.getState().calls.size).toBe(0);
    callAgentDeclaratify(mockCallAgent, context, internalContext);

    const mockCall = createMockCall(mockCallId);
    mockCallAgent.calls = [mockCall];
    mockCallAgent.emit('callsUpdated', { added: [mockCall], removed: [] });

    await waitWithBreakCondition(() => context.getState().calls.size !== 0);

    expect(context.getState().calls.size).toBe(1);

    mockCall.callEndReason = { code: 1 };
    mockCallAgent.calls = [];
    mockCallAgent.emit('callsUpdated', { added: [], removed: [mockCall] });

    await waitWithBreakCondition(() => context.getState().callsEnded.length !== 0);

    expect(context.getState().calls.size).toBe(0);
    expect(context.getState().callsEnded.length).toBe(1);
    expect(context.getState().callsEnded[0].callEndReason?.code).toBe(1);
    expect(context.getState().callsEnded[0].endTime).toBeTruthy();
  });

  test('should move incoming call to incomingCallEnded when incoming call is ended and add endTime', async () => {
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext('');
    const internalContext = new InternalCallContext();
    expect(context.getState().calls.size).toBe(0);
    callAgentDeclaratify(mockCallAgent, context, internalContext);

    const mockIncomingCall = createMockIncomingCall(mockCallId);
    mockCallAgent.emit('incomingCall', { incomingCall: mockIncomingCall });

    await waitWithBreakCondition(() => context.getState().incomingCalls.size !== 0);

    expect(context.getState().incomingCalls.size).toBe(1);

    mockIncomingCall.emit('callEnded', { callEndReason: { code: 1 } });

    await waitWithBreakCondition(() => context.getState().incomingCallsEnded.length !== 0);

    expect(context.getState().incomingCalls.size).toBe(0);
    expect(context.getState().incomingCallsEnded.length).toBe(1);
    expect(context.getState().incomingCallsEnded[0].callEndReason?.code).toBe(1);
    expect(context.getState().incomingCallsEnded[0].endTime).toBeTruthy();
  });

  test('should make sure that callsEnded not exceed max length', async () => {
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext('');
    const internalContext = new InternalCallContext();
    callAgentDeclaratify(mockCallAgent, context, internalContext);

    const numberOfCalls = MAX_CALL_HISTORY_LENGTH + 10;
    const mockCalls: MockCall[] = [];
    for (let i = 0; i < numberOfCalls; i++) {
      const mockCall = createMockCall(mockCallId + i.toString());
      mockCalls.push(mockCall);
    }
    mockCallAgent.calls = mockCalls;
    mockCallAgent.emit('callsUpdated', { added: mockCalls, removed: [] });

    await waitWithBreakCondition(() => context.getState().calls.size === numberOfCalls);

    mockCallAgent.emit('callsUpdated', { added: [], removed: mockCalls });

    await waitWithBreakCondition(() => context.getState().calls.size === 0);

    expect(context.getState().callsEnded.length).toBe(MAX_CALL_HISTORY_LENGTH);
  });

  test('should make sure that incomingCallsEnded not exceed max length', async () => {
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext('');
    const internalContext = new InternalCallContext();
    callAgentDeclaratify(mockCallAgent, context, internalContext);

    const numberOfCalls = MAX_CALL_HISTORY_LENGTH + 10;
    const mockIncomingCalls: MockIncomingCall[] = [];
    for (let i = 0; i < numberOfCalls; i++) {
      const mockIncomingCall = createMockIncomingCall(mockCallId + i);
      mockIncomingCalls.push(mockIncomingCall);
      mockCallAgent.emit('incomingCall', { incomingCall: mockIncomingCall });
    }

    await waitWithBreakCondition(() => context.getState().incomingCalls.size === numberOfCalls);

    for (const mockIncomingCall of mockIncomingCalls) {
      mockIncomingCall.emit('callEnded', { callEndReason: { code: 1 } });
    }

    await waitWithBreakCondition(() => context.getState().incomingCalls.size === 0);

    expect(context.getState().incomingCallsEnded.length).toBe(MAX_CALL_HISTORY_LENGTH);
  });
});
