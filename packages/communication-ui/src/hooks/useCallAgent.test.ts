// © Microsoft Corporation. All rights reserved.

import { renderHook } from '@testing-library/react-hooks';
import {
  Call,
  CallAgent,
  CollectionUpdatedEvent,
  LocalVideoStream,
  PropertyChangedEvent,
  RemoteParticipant,
  RemoteVideoStream
} from '@azure/communication-calling';
import { createSpyObj, defaultMockCallProps, mockCall, mockRemoteParticipant, mockRemoteVideoStream } from '../mocks';
import useCallAgent from './useCallAgent';
import { MockCall, MockRemoteVideoStream } from '../mocks/CallingTypeMocks';

let tsCallAgentMock: jest.Mocked<CallAgent>;
let events: { [name: string]: CollectionUpdatedEvent<Call> };

export type MockCallingContextType = {
  callAgent: CallAgent | undefined;
  setLocalScreenShare: jest.Mock;
};

export type MockCallContextType = {
  call: Call | undefined;
  setCallState: jest.Mock<any, any>;
  setCall: jest.Mock<any, any>;
  setParticipants: jest.Mock<any, any>;
  setScreenShareStream: jest.Mock<any, any>;
};

let mockCallingContext: () => MockCallingContextType;

let mockCallContext: () => MockCallContextType;

jest.mock('../providers', () => {
  return {
    useCallingContext: jest.fn().mockImplementation(
      (): MockCallingContextType => {
        return mockCallingContext();
      }
    ),
    useCallContext: jest.fn().mockImplementation(() => {
      return mockCallContext();
    })
  };
});

let rejectExecutedCallback: jest.Mock<any, any>;
let setCallStateCallback: jest.Mock<any, any>;
let setCallCallback: jest.Mock<any, any>;
let setParticipantsCallback: jest.Mock<any, any>;
let setScreenShareStreamCallback: jest.Mock<any, any>;
let addedCall: MockCall;
let addedCallEvents: {
  [name: string]:
    | PropertyChangedEvent
    | CollectionUpdatedEvent<RemoteParticipant>
    | CollectionUpdatedEvent<LocalVideoStream>;
};
let remoteParticipant: RemoteParticipant;
let remoteParticipantEvents: {
  [name: string]: PropertyChangedEvent | CollectionUpdatedEvent<RemoteVideoStream>;
};
let addedRemoteVideoStream: MockRemoteVideoStream;
let addedRemoteVideoStreamEvents: {
  [name: string]: PropertyChangedEvent;
};

describe('useCallAgent tests', () => {
  beforeEach(() => {
    rejectExecutedCallback = jest.fn();
    setCallStateCallback = jest.fn();
    setCallCallback = jest.fn();
    setParticipantsCallback = jest.fn();
    setScreenShareStreamCallback = jest.fn();

    remoteParticipantEvents = {};
    remoteParticipant = mockRemoteParticipant();
    remoteParticipant.on = (
      event: string,
      listener: PropertyChangedEvent | CollectionUpdatedEvent<RemoteVideoStream>
    ) => {
      remoteParticipantEvents[event] = listener;
    };

    addedCallEvents = {};
    addedCall = mockCall({
      ...defaultMockCallProps,
      rejectExecutedCallback: rejectExecutedCallback
    });
    addedCall.on = (
      event: string,
      listener:
        | PropertyChangedEvent
        | CollectionUpdatedEvent<RemoteParticipant>
        | CollectionUpdatedEvent<LocalVideoStream>
    ) => {
      addedCallEvents[event] = listener;
    };
    addedCall.remoteParticipants = [remoteParticipant];

    addedRemoteVideoStreamEvents = {};
    addedRemoteVideoStream = mockRemoteVideoStream();
    addedRemoteVideoStream.on = (event: string, listener: PropertyChangedEvent) => {
      addedRemoteVideoStreamEvents[event] = listener;
    };

    mockCallingContext = (): MockCallingContextType => {
      return {
        callAgent: tsCallAgentMock,
        setLocalScreenShare: jest.fn()
      };
    };
    mockCallContext = (): MockCallContextType => {
      return {
        call: mockCall(),
        setCall: setCallCallback,
        setParticipants: setParticipantsCallback,
        setCallState: setCallStateCallback,
        setScreenShareStream: setScreenShareStreamCallback
      };
    };
    events = {};
    tsCallAgentMock = createSpyObj<CallAgent>('tsCallAgentMock', ['on', 'off']);
    tsCallAgentMock.on.mockImplementation((event: string, listener: CollectionUpdatedEvent<Call>) => {
      events[event] = listener;
    });
    tsCallAgentMock.off.mockImplementation(() => {
      return;
    });
  });

  test('useCallAgent hook should subscribe for callsUpdated event', async () => {
    renderHook(() => useCallAgent());
    const callsUpdatedEvent = events.callsUpdated;
    expect(callsUpdatedEvent).toBeDefined();
  });

  test('after callsUpdated listener is called, if the addedCall is defined and not incoming, addedCall should subscibe for stateChanged and remoteParticipantsUpdated', async () => {
    renderHook(() => useCallAgent());
    await events.callsUpdated({ added: [addedCall], removed: [] });

    expect(addedCallEvents.stateChanged).toBeDefined();
    expect(addedCallEvents.remoteParticipantsUpdated).toBeDefined();
  });

  test('after callsUpdated listener is called, if the addedCall is defined and not incoming, setCall should have been called', async () => {
    renderHook(() => useCallAgent());
    await events.callsUpdated({ added: [addedCall], removed: [] });

    expect(setCallCallback).toHaveBeenCalled();
  });

  test('if stateChanged listener of the added call is called, setCallState should have been called', async () => {
    expect(setCallStateCallback).not.toHaveBeenCalled();

    renderHook(() => useCallAgent());
    await events.callsUpdated({ added: [addedCall], removed: [] });

    const callStateChangedCallback = addedCallEvents.stateChanged as PropertyChangedEvent;
    callStateChangedCallback();

    expect(setCallStateCallback).toHaveBeenCalled();
  });

  test('if remoteParticipantsUpdated listener of the added call is called and there is an added remote participant, setParticipantsCallback should have been called', async () => {
    renderHook(() => useCallAgent());
    await events.callsUpdated({ added: [addedCall], removed: [] });

    const remoteParticipantsUpdatedCallback = addedCallEvents.remoteParticipantsUpdated as CollectionUpdatedEvent<
      RemoteParticipant
    >;
    remoteParticipantsUpdatedCallback({
      added: [remoteParticipant],
      removed: []
    });

    expect(setParticipantsCallback).toHaveBeenCalled();
  });

  test('if remoteParticipantsUpdated listener of the added call is called and there is an removed remote participant, setParticipantsCallback should have been called', async () => {
    renderHook(() => useCallAgent());
    await events.callsUpdated({ added: [addedCall], removed: [] });

    const remoteParticipantsUpdatedCallback = addedCallEvents.remoteParticipantsUpdated as CollectionUpdatedEvent<
      RemoteParticipant
    >;
    remoteParticipantsUpdatedCallback({ added: [], removed: [remoteParticipant] });

    expect(setParticipantsCallback).toHaveBeenCalled();
  });

  test('if added call has remoteParticipants, then the remoteParticipants should subsribe to stateChanged, isSpeakingChanged, videoStreamsUpdated', async () => {
    renderHook(() => useCallAgent());
    await events.callsUpdated({ added: [addedCall], removed: [] });

    expect(remoteParticipantEvents.stateChanged).toBeDefined();
    expect(remoteParticipantEvents.isSpeakingChanged).toBeDefined();
    expect(remoteParticipantEvents.videoStreamsUpdated).toBeDefined();
  });

  test('if addedRemoteVideoStream is type video, it should not subscribe to any events', async () => {
    addedRemoteVideoStream.mediaStreamType = 'Video';
    renderHook(() => useCallAgent());
    await events.callsUpdated({ added: [addedCall], removed: [] });

    const videoStreamsUpdatedCallback = remoteParticipantEvents.videoStreamsUpdated as CollectionUpdatedEvent<
      RemoteVideoStream
    >;
    videoStreamsUpdatedCallback({ added: [addedRemoteVideoStream], removed: [] });

    expect(addedRemoteVideoStreamEvents).toStrictEqual({});
  });

  test('if addedRemoteVideoStream is type ScreenSharing, it should not subscribe to isAvailableChanged event', async () => {
    addedRemoteVideoStream.mediaStreamType = 'ScreenSharing';
    renderHook(() => useCallAgent());
    await events.callsUpdated({ added: [addedCall], removed: [] });

    const videoStreamsUpdatedCallback = remoteParticipantEvents.videoStreamsUpdated as CollectionUpdatedEvent<
      RemoteVideoStream
    >;
    videoStreamsUpdatedCallback({ added: [addedRemoteVideoStream], removed: [] });

    expect(addedRemoteVideoStreamEvents.isAvailableChanged).toBeDefined();
  });

  test('if addedRemoteVideoStream is type ScreenSharing and available, setScreenShareStream should have been called', async () => {
    addedRemoteVideoStream.mediaStreamType = 'ScreenSharing';
    addedRemoteVideoStream.isAvailable = true;
    renderHook(() => useCallAgent());
    await events.callsUpdated({ added: [addedCall], removed: [] });

    const videoStreamsUpdatedCallback = remoteParticipantEvents.videoStreamsUpdated as CollectionUpdatedEvent<
      RemoteVideoStream
    >;
    videoStreamsUpdatedCallback({ added: [addedRemoteVideoStream], removed: [] });

    expect(setScreenShareStreamCallback).toHaveBeenCalled();
  });

  test('if addedRemoteVideoStream is type ScreenSharing and not available, setScreenShareStream should not have been called', async () => {
    addedRemoteVideoStream.mediaStreamType = 'ScreenSharing';
    addedRemoteVideoStream.isAvailable = false;
    renderHook(() => useCallAgent());
    await events.callsUpdated({ added: [addedCall], removed: [] });

    const videoStreamsUpdatedCallback = remoteParticipantEvents.videoStreamsUpdated as CollectionUpdatedEvent<
      RemoteVideoStream
    >;
    videoStreamsUpdatedCallback({ added: [addedRemoteVideoStream], removed: [] });

    expect(setScreenShareStreamCallback).not.toHaveBeenCalled();
  });

  test('if isAvailableChanged of addedRemoteVideoStream and addedRemoteVideoStream is not available, setScreenShareStream should have been called with undefined', async () => {
    addedRemoteVideoStream.mediaStreamType = 'ScreenSharing';
    addedRemoteVideoStream.isAvailable = false;
    renderHook(() => useCallAgent());
    await events.callsUpdated({ added: [addedCall], removed: [] });

    const videoStreamsUpdatedCallback = remoteParticipantEvents.videoStreamsUpdated as CollectionUpdatedEvent<
      RemoteVideoStream
    >;
    videoStreamsUpdatedCallback({ added: [addedRemoteVideoStream], removed: [] });

    addedRemoteVideoStreamEvents.isAvailableChanged();

    expect(setScreenShareStreamCallback).toHaveBeenCalledWith(undefined);
  });

  test('if isAvailableChanged of addedRemoteVideoStream is called and addedRemoteVideoStream is available, setScreenShareStream should have been called', async () => {
    addedRemoteVideoStream.mediaStreamType = 'ScreenSharing';
    addedRemoteVideoStream.isAvailable = false;
    renderHook(() => useCallAgent());
    await events.callsUpdated({ added: [addedCall], removed: [] });

    const videoStreamsUpdatedCallback = remoteParticipantEvents.videoStreamsUpdated as CollectionUpdatedEvent<
      RemoteVideoStream
    >;
    videoStreamsUpdatedCallback({ added: [addedRemoteVideoStream], removed: [] });
    addedRemoteVideoStream.isAvailable = true;

    expect(setScreenShareStreamCallback).not.toHaveBeenCalled();

    addedRemoteVideoStreamEvents.isAvailableChanged();

    expect(setScreenShareStreamCallback).toHaveBeenCalled();
  });
});
