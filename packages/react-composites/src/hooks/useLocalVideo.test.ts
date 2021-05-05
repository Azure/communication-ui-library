// © Microsoft Corporation. All rights reserved.
import { renderHook } from '@testing-library/react-hooks';
import { Call, LocalVideoStream, VideoDeviceInfo } from '@azure/communication-calling';
import { mockCall } from '../mocks';
import useLocalVideo from './useLocalVideo';

type MockCallContextType = {
  call: Call;
  localVideoStream: LocalVideoStream | undefined;
  setLocalVideoStream: jest.Mock<any, any>;
  isLocalVideoRendererBusy: boolean;
  setLocalVideoRendererBusy: jest.Mock<any, any>;
  isLocalVideoOn: boolean;
  setLocalVideoOn: jest.Mock<any, any>;
};

const mockVideoDeviceInfo = {
  name: 'Microsoft Camera Front',
  id: 'camera:54321',
  deviceType: 'Unknown'
} as VideoDeviceInfo;
let startVideo = jest.fn();
let stopVideo = jest.fn();
let setLocalVideoOn = jest.fn();
let callLocalVideoStreams: Array<LocalVideoStream> = [];
let mockCallContext: () => MockCallContextType;

jest.mock('../providers', () => {
  return {
    useCallContext: jest.fn().mockImplementation(
      (): MockCallContextType => {
        return mockCallContext();
      }
    )
  };
});

jest.mock('@azure/communication-calling', () => {
  return {
    LocalVideoStream: jest.fn().mockImplementation((videoDeviceInfo: VideoDeviceInfo) => {
      return {
        source: videoDeviceInfo,
        mediaStreamType: 'Video',
        switchSource: jest.fn()
      };
    })
  };
});

describe('useLocalVideo tests', () => {
  beforeEach(() => {
    startVideo = jest.fn();
    stopVideo = jest.fn();
    setLocalVideoOn = jest.fn();
    callLocalVideoStreams = [];
    mockCallContext = (): MockCallContextType => {
      return {
        // TODO: fix typescript
        call: mockCall({ startVideo, stopVideo, localVideoStreams: callLocalVideoStreams } as any),
        localVideoStream: new LocalVideoStream(mockVideoDeviceInfo),
        setLocalVideoStream: jest.fn(),
        isLocalVideoRendererBusy: false,
        setLocalVideoRendererBusy: jest.fn(),
        isLocalVideoOn: false,
        setLocalVideoOn: setLocalVideoOn
      };
    };
  });

  test('Upon calling startLocalVideo `call.startCall` function should be triggered when localVideoStream is defined.', async () => {
    const { result } = renderHook(() => useLocalVideo());
    // TODO: fix typescript types
    await result.current.startLocalVideo(mockCallContext().localVideoStream);
    expect(startVideo).toBeCalled();
    expect(setLocalVideoOn).toBeCalledWith(true);
  });

  test('startLocalVideo should not call `call.startCall` function if the camera is busy.', async () => {
    const defaultMock = mockCallContext();
    mockCallContext = (): MockCallContextType => {
      return {
        ...defaultMock,
        isLocalVideoRendererBusy: true
      };
    };
    const { result } = renderHook(() => useLocalVideo());

    // TODO: fix typescript types
    await result.current.startLocalVideo(mockCallContext().localVideoStream).catch((e: Error) => {
      expect(e.message).toEqual('Failed to start local video: local video renderer is busy');
    });
    expect(startVideo).not.toBeCalled();
    expect(setLocalVideoOn).not.toBeCalled();
  });

  test('startLocalVideo should call `call.startCall` function if the camera is already on but has not joined the call.', async () => {
    const defaultMock = mockCallContext();
    mockCallContext = (): MockCallContextType => {
      return {
        ...defaultMock,
        isLocalVideoOn: true
      };
    };
    const { result } = renderHook(() => useLocalVideo());
    // TODO: fix typescript types
    await result.current.startLocalVideo(mockCallContext().localVideoStream);
    expect(startVideo).toBeCalledTimes(1);
    expect(setLocalVideoOn).toBeCalledWith(true);
  });

  test('Upon calling stopLocalVideo `call.stopCall` function should be triggered when localVideoStream is defined and exists in the call.', async () => {
    const localStream = new LocalVideoStream(mockVideoDeviceInfo);
    callLocalVideoStreams.push(localStream);
    const defaultMock = mockCallContext();
    mockCallContext = (): MockCallContextType => {
      return {
        ...defaultMock,
        localVideoStream: localStream,
        isLocalVideoOn: true
      };
    };
    const { result } = renderHook(() => useLocalVideo());
    await result.current.stopLocalVideo(mockCallContext().localVideoStream);
    expect(stopVideo).toBeCalledTimes(1);
    expect(setLocalVideoOn).toBeCalledWith(false);
  });

  test('Upon calling stopLocalVideo `call.stopCall` function should not be triggered when localVideoStream is defined but does not exist in the call.', async () => {
    const defaultMock = mockCallContext();
    mockCallContext = (): MockCallContextType => {
      return {
        ...defaultMock,
        isLocalVideoOn: true
      };
    };
    const { result } = renderHook(() => useLocalVideo());
    await result.current.stopLocalVideo(mockCallContext().localVideoStream);
    expect(stopVideo).toBeCalledTimes(0);
    expect(setLocalVideoOn).toBeCalledWith(false);
  });

  test('stopLocalVideo should not call `call.stopCall` function if the camera is busy.', async () => {
    const defaultMock = mockCallContext();
    mockCallContext = (): MockCallContextType => {
      return {
        ...defaultMock,
        isLocalVideoRendererBusy: true,
        isLocalVideoOn: true
      };
    };
    const { result } = renderHook(() => useLocalVideo());
    await result.current.stopLocalVideo(mockCallContext().localVideoStream).catch((e: Error) => {
      expect(e.message).toEqual('Failed to stop local video: local video renderer is busy');
    });
    expect(stopVideo).not.toBeCalled();
    expect(setLocalVideoOn).not.toBeCalled();
  });
});
