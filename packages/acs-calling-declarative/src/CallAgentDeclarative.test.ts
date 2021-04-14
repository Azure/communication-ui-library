// © Microsoft Corporation. All rights reserved.
import {
  Call,
  CallAgent,
  CollectionUpdatedEvent,
  GroupChatCallLocator,
  GroupLocator,
  IncomingCallEvent,
  JoinCallOptions,
  MeetingLocator,
  StartCallOptions
} from '@azure/communication-calling';
import { CommunicationUserIdentifier, PhoneNumberIdentifier, UnknownIdentifier } from '@azure/communication-common';
import EventEmitter from 'events';
import { callAgentDeclaratify } from './CallAgentDeclarative';
import { CallContext } from './CallContext';
import { createMockCall, createMockRemoteParticipant, MockCall, mockoutObjectFreeze } from './TestUtils';

mockoutObjectFreeze();

jest.mock('@azure/communication-calling');

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
    const context = new CallContext();
    callAgentDeclaratify(mockCallAgent, context);
    expect(mockCallAgent.emitter.eventNames().includes('incomingCall')).toBe(true);
    expect(mockCallAgent.emitter.eventNames().includes('callsUpdated')).toBe(true);
  });

  test('should subscribe to any existing calls and add to state when created', () => {
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext();
    const mockCall = createMockCall(mockCallId);
    mockCallAgent.calls = [mockCall];
    callAgentDeclaratify(mockCallAgent, context);
    expect(context.getState().calls.size).toBe(1);
    expect(mockCall.emitter.eventNames().length).not.toBe(0);
  });

  test('should unsubscribe when disposed is invoked', async () => {
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext();
    const mockCall = createMockCall(mockCallId);
    mockCallAgent.calls = [mockCall];
    const declarativeCallAgent = callAgentDeclaratify(mockCallAgent, context);
    await declarativeCallAgent.dispose();
    expect(mockCall.emitter.eventNames().length).toBe(0);
    expect(mockCallAgent.emitter.eventNames().length).toBe(0);
  });

  test('should update state with new call when startCall is invoked', () => {
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext();
    expect(context.getState().calls.size).toBe(0);
    const declarativeCallAgent = callAgentDeclaratify(mockCallAgent, context);
    declarativeCallAgent.startCall([]);
    expect(context.getState().calls.size).toBe(1);
  });

  test('should update state with new call when join is invoked', () => {
    const mockCallAgent = new MockCallAgent();
    const context = new CallContext();
    expect(context.getState().calls.size).toBe(0);
    const declarativeCallAgent = callAgentDeclaratify(mockCallAgent, context);
    declarativeCallAgent.join({ meetingLink: '' });
    expect(context.getState().calls.size).toBe(1);
  });
});
