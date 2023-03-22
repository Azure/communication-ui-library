// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  Call,
  CallAgent,
  CollectionUpdatedEvent,
  UserFacingDiagnosticsFeature,
  GroupLocator,
  IncomingCallEvent,
  JoinCallOptions,
  TeamsMeetingLinkLocator,
  RecordingCallFeature,
  TranscriptionCallFeature,
  CallFeatureFactory,
  StartCallOptions,
  PushNotificationData
} from '@azure/communication-calling';
/* @conditional-compile-remove(teams-identity-support) */
import { CallAgentKind } from '@azure/communication-calling';
/* @conditional-compile-remove(calling-beta-sdk) */
import { GroupChatCallLocator, MeetingLocator, RoomLocator } from '@azure/communication-calling';
import { CommunicationUserIdentifier, PhoneNumberIdentifier, UnknownIdentifier } from '@azure/communication-common';
import EventEmitter from 'events';
import { callAgentDeclaratify } from './CallAgentDeclarative';
import { CallError } from './CallClientState';
import { CallContext, MAX_CALL_HISTORY_LENGTH } from './CallContext';
import { DeclarativeCall } from './CallDeclarative';
import { InternalCallContext } from './InternalCallContext';
import {
  createMockCall,
  createMockCallAgent,
  createMockIncomingCall,
  createMockRemoteParticipant,
  createStatefulCallClientWithAgent,
  MockCall,
  MockIncomingCall,
  mockoutObjectFreeze,
  MockRecordingCallFeatureImpl,
  MockTranscriptionCallFeatureImpl,
  StateChangeListener,
  stubCommunicationTokenCredential,
  StubDiagnosticsCallFeatureImpl,
  waitWithBreakCondition
} from './TestUtils';

mockoutObjectFreeze();

jest.mock('@azure/communication-calling', () => {
  return {
    Features: {
      get Recording(): CallFeatureFactory<RecordingCallFeature> {
        return { callApiCtor: MockRecordingCallFeatureImpl };
      },
      get Transcription(): CallFeatureFactory<TranscriptionCallFeature> {
        return { callApiCtor: MockTranscriptionCallFeatureImpl };
      },
      get Diagnostics(): CallFeatureFactory<UserFacingDiagnosticsFeature> {
        return { callApiCtor: StubDiagnosticsCallFeatureImpl };
      }
    }
  };
});

const mockRemoteParticipantId = 'a';
const mockCallId = 'b';

class MockCallAgent implements CallAgent {
  calls: MockCall[] = [];
  displayName = undefined;
  /* @conditional-compile-remove(teams-identity-support) */
  kind = 'CallAgent' as CallAgentKind;
  emitter = new EventEmitter();
  feature;
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
  /* @conditional-compile-remove(calling-beta-sdk) */
  handlePushNotification(data: PushNotificationData): Promise<void> {
    console.error('handlePushNotification not implemented, data: ', data);
    return Promise.resolve();
  }
  join(groupLocator: GroupLocator, options?: JoinCallOptions): Call;
  /* @conditional-compile-remove(calling-beta-sdk) */
  join(groupChatCallLoctor: GroupChatCallLocator, options?: JoinCallOptions): Call;
  join(meetingLocator: TeamsMeetingLinkLocator, options?: JoinCallOptions): Call;
  /* @conditional-compile-remove(calling-beta-sdk) */
  join(meetingLocator: MeetingLocator, options?: JoinCallOptions): Call;
  /* @conditional-compile-remove(calling-beta-sdk) */
  join(roomLocator: RoomLocator, options?: JoinCallOptions): Call;
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

class MockCallAgentWithMultipleCalls extends MockCallAgent {
  constructor(calls: MockCall[]) {
    super();
    this.calls = calls;
  }
}

describe('declarative call agent', () => {
  test('should subscribe to callsUpdated and incomingCall events when created', () => {
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext({ kind: 'communicationUser', communicationUserId: '' });
    const internalContext = new InternalCallContext();
    callAgentDeclaratify(mockCallAgent, context, internalContext);
    expect(mockCallAgent.emitter.eventNames().includes('incomingCall')).toBe(true);
    expect(mockCallAgent.emitter.eventNames().includes('callsUpdated')).toBe(true);
  });

  test('should subscribe to any existing calls and add to state when created', () => {
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext({ kind: 'communicationUser', communicationUserId: '' });
    const mockCall = createMockCall(mockCallId);
    mockCallAgent.calls = [mockCall];
    const internalContext = new InternalCallContext();
    callAgentDeclaratify(mockCallAgent, context, internalContext);
    expect(Object.keys(context.getState().calls).length).toBe(1);
    expect(mockCall.emitter.eventNames().length).not.toBe(0);
  });

  test('should unsubscribe but not clear data when disposed is invoked', async () => {
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext({ kind: 'communicationUser', communicationUserId: '' });
    const internalContext = new InternalCallContext();
    const mockCall = createMockCall(mockCallId);
    mockCallAgent.calls = [mockCall];
    const declarativeCallAgent = callAgentDeclaratify(mockCallAgent, context, internalContext);
    await declarativeCallAgent.dispose();
    expect(mockCall.emitter.eventNames().length).toBe(0);
    expect(mockCallAgent.emitter.eventNames().length).toBe(0);
    expect(Object.keys(context.getState().calls).length).toBe(1);
  });

  test('should clear state if newly created agent and if there is old existing state', async () => {
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext({ kind: 'communicationUser', communicationUserId: '' });
    const internalContext = new InternalCallContext();
    const mockCall = createMockCall(mockCallId);
    mockCallAgent.calls = [mockCall];
    const declarativeCallAgent = callAgentDeclaratify(mockCallAgent, context, internalContext);
    await declarativeCallAgent.dispose();
    expect(mockCall.emitter.eventNames().length).toBe(0);
    expect(mockCallAgent.emitter.eventNames().length).toBe(0);
    expect(Object.keys(context.getState().calls).length).toBe(1);
    mockCallAgent.calls = [];
    callAgentDeclaratify(mockCallAgent, context, internalContext);
    expect(Object.keys(context.getState().calls).length).toBe(0);
    expect(Array.from(internalContext.getCallIds()).length).toBe(0);
  });

  test('should update state with new call when startCall is invoked', () => {
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext({ kind: 'communicationUser', communicationUserId: '' });
    const internalContext = new InternalCallContext();
    expect(Object.keys(context.getState().calls).length).toBe(0);
    const declarativeCallAgent = callAgentDeclaratify(mockCallAgent, context, internalContext);
    declarativeCallAgent.startCall([]);
    expect(Object.keys(context.getState().calls).length).toBe(1);
  });

  test('should update state with new call when join is invoked', () => {
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext({ kind: 'communicationUser', communicationUserId: '' });
    const internalContext = new InternalCallContext();
    expect(Object.keys(context.getState().calls).length).toBe(0);
    const declarativeCallAgent = callAgentDeclaratify(mockCallAgent, context, internalContext);
    declarativeCallAgent.join({ meetingLink: '' });
    expect(Object.keys(context.getState().calls).length).toBe(1);
  });

  test('should move call to callEnded when call is removed and add endTime', async () => {
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext({ kind: 'communicationUser', communicationUserId: '' });
    const internalContext = new InternalCallContext();
    expect(Object.keys(context.getState().calls).length).toBe(0);
    callAgentDeclaratify(mockCallAgent, context, internalContext);

    const mockCall = createMockCall(mockCallId);
    mockCallAgent.calls = [mockCall];
    mockCallAgent.emit('callsUpdated', { added: [mockCall], removed: [] });

    await waitWithBreakCondition(() => Object.keys(context.getState().calls).length !== 0);

    expect(Object.keys(context.getState().calls).length).toBe(1);

    mockCall.callEndReason = { code: 1 };
    mockCallAgent.calls = [];
    mockCallAgent.emit('callsUpdated', { added: [], removed: [mockCall] });

    await waitWithBreakCondition(() => Object.keys(context.getState().callsEnded).length !== 0);

    expect(Object.keys(context.getState().calls).length).toBe(0);
    expect(Object.keys(context.getState().callsEnded).length).toBe(1);
    expect(context.getState().callsEnded[mockCallId].callEndReason?.code).toBe(1);
    expect(context.getState().callsEnded[mockCallId].endTime).toBeTruthy();
  });

  test('should move incoming call to incomingCallEnded when incoming call is ended and add endTime', async () => {
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext({ kind: 'communicationUser', communicationUserId: '' });
    const internalContext = new InternalCallContext();
    expect(Object.keys(context.getState().calls).length).toBe(0);
    callAgentDeclaratify(mockCallAgent, context, internalContext);

    const mockIncomingCall = createMockIncomingCall(mockCallId);
    mockCallAgent.emit('incomingCall', { incomingCall: mockIncomingCall });

    await waitWithBreakCondition(() => Object.keys(context.getState().incomingCalls).length !== 0);

    expect(Object.keys(context.getState().incomingCalls).length).toBe(1);

    mockIncomingCall.emit('callEnded', { callEndReason: { code: 1 } });

    await waitWithBreakCondition(() => Object.keys(context.getState().incomingCallsEnded).length !== 0);

    expect(Object.keys(context.getState().incomingCalls).length).toBe(0);
    expect(Object.keys(context.getState().incomingCallsEnded).length).toBe(1);
    expect(context.getState().incomingCallsEnded[mockCallId].callEndReason?.code).toBe(1);
    expect(context.getState().incomingCallsEnded[mockCallId].endTime).toBeTruthy();
  });

  test('should make sure that callsEnded not exceed max length', async () => {
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext({ kind: 'communicationUser', communicationUserId: '' });
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

    await waitWithBreakCondition(() => Object.keys(context.getState().calls).length === numberOfCalls);

    mockCallAgent.emit('callsUpdated', { added: [], removed: mockCalls });

    await waitWithBreakCondition(() => Object.keys(context.getState().calls).length === 0);

    expect(Object.keys(context.getState().callsEnded).length).toBe(MAX_CALL_HISTORY_LENGTH);
  });

  test('should make sure that incomingCallsEnded not exceed max length', async () => {
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext({ kind: 'communicationUser', communicationUserId: '' });
    const internalContext = new InternalCallContext();
    callAgentDeclaratify(mockCallAgent, context, internalContext);

    const numberOfCalls = MAX_CALL_HISTORY_LENGTH + 10;
    const mockIncomingCalls: MockIncomingCall[] = [];
    for (let i = 0; i < numberOfCalls; i++) {
      const mockIncomingCall = createMockIncomingCall(mockCallId + i);
      mockIncomingCalls.push(mockIncomingCall);
      mockCallAgent.emit('incomingCall', { incomingCall: mockIncomingCall });
    }

    await waitWithBreakCondition(() => Object.keys(context.getState().incomingCalls).length === numberOfCalls);

    for (const mockIncomingCall of mockIncomingCalls) {
      mockIncomingCall.emit('callEnded', { callEndReason: { code: 1 } });
    }

    await waitWithBreakCondition(() => Object.keys(context.getState().incomingCalls).length === 0);

    expect(Object.keys(context.getState().incomingCallsEnded).length).toBe(MAX_CALL_HISTORY_LENGTH);
  });

  test('should wrap the calls property and the onCallsUpdated and return DeclarativeCall when accessed', async () => {
    const mockCallOne = createMockCall('mockCallIdOne');
    const mockCallTwo = createMockCall('mockCallIdTwo');
    const mockCallAgent = new MockCallAgentWithMultipleCalls([mockCallOne, mockCallTwo]);
    const context = new CallContext({ kind: 'communicationUser', communicationUserId: '' });
    const internalContext = new InternalCallContext();
    const declarativeCallAgent = callAgentDeclaratify(mockCallAgent, context, internalContext);

    expect(Object.keys(declarativeCallAgent.calls).length).toBe(2);
    expect((declarativeCallAgent.calls[0] as DeclarativeCall).unsubscribe).toBeDefined();
    expect((declarativeCallAgent.calls[1] as DeclarativeCall).unsubscribe).toBeDefined();

    let receivedEvent: any | undefined = undefined;
    const callsUpdatedListener = (event: { added: Call[]; removed: Call[] }): void => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      receivedEvent = event;
    };
    declarativeCallAgent.on('callsUpdated', callsUpdatedListener);
    mockCallAgent.emit('callsUpdated', {
      added: [createMockCall('mockCallIdThree')],
      removed: [createMockCall('mockCallIdFour')]
    });

    await waitWithBreakCondition(() => receivedEvent !== undefined);

    expect(receivedEvent).toBeDefined();
    expect(receivedEvent.added).toBeDefined();
    expect(receivedEvent.added[0]).toBeDefined();
    expect((receivedEvent.added[0] as DeclarativeCall).unsubscribe).toBeDefined();
    expect(receivedEvent.removed).toBeDefined();
    expect(receivedEvent.removed[0]).toBeDefined();
    expect((receivedEvent.removed[0] as DeclarativeCall).unsubscribe).toBeDefined();
  });

  /* @conditional-compile-remove(one-to-n-calling) */
  test('`incomingCalls` should return declarative incoming calls array', () => {
    const mockIncomingCallOne = createMockIncomingCall('mockIncomingCallIdOne');
    const mockIncomingCallTwo = createMockIncomingCall('mockIncomingCallIdTwo');
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext({ kind: 'communicationUser', communicationUserId: '' });
    const internalContext = new InternalCallContext();
    const declarativeCallAgent = callAgentDeclaratify(mockCallAgent, context, internalContext);
    mockCallAgent.emit('incomingCall', { incomingCall: mockIncomingCallOne });
    mockCallAgent.emit('incomingCall', { incomingCall: mockIncomingCallTwo });
    expect(declarativeCallAgent.incomingCalls.length).toBe(2);
    expect(
      declarativeCallAgent.incomingCalls.find((incomingCall) => incomingCall.id === 'mockIncomingCallIdOne')
    ).toBeDefined();
    expect(
      declarativeCallAgent.incomingCalls.find((incomingCall) => incomingCall.id === 'mockIncomingCallIdTwo')
    ).toBeDefined();
  });
});

describe('errors should be reported correctly from CallAgent when', () => {
  test('join fails', async () => {
    const baseAgent = createMockCallAgent();
    baseAgent.join = (): Call => {
      throw new Error('injected error');
    };
    const client = createStatefulCallClientWithAgent(baseAgent);
    const agent = await client.createCallAgent(stubCommunicationTokenCredential());

    const listener = new StateChangeListener(client);
    await expect(() => {
      agent.join({ groupId: 'fakeCallGroup' });
    }).toThrow(new CallError('CallAgent.join', new Error('injected error')));
    expect(listener.onChangeCalledCount).toBe(1);
    expect(client.getState().latestErrors['CallAgent.join']).toBeDefined();
  });

  test('startCall fails', async () => {
    const baseAgent = createMockCallAgent();
    baseAgent.startCall = (): Call => {
      throw new Error('injected error');
    };
    const client = createStatefulCallClientWithAgent(baseAgent);
    const agent = await client.createCallAgent(stubCommunicationTokenCredential());

    const listener = new StateChangeListener(client);
    await expect(() => {
      agent.startCall([]);
    }).toThrow(new CallError('CallAgent.startCall', new Error('injected error')));
    expect(listener.onChangeCalledCount).toBe(1);
    expect(client.getState().latestErrors['CallAgent.startCall']).toBeDefined();
  });
});
