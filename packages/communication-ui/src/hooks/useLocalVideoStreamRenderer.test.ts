// © Microsoft Corporation. All rights reserved.
import { renderHook } from '@testing-library/react-hooks';
import useLocalVideoStreamRenderer from './useLocalVideoStreamRenderer';
import { LocalVideoStream, VideoDeviceInfo } from '@azure/communication-calling';

type MockCallContextType = {
  isLocalVideoRendererBusy: boolean;
  setLocalVideoRendererBusy: jest.Mock<any, any>;
};
let mockCallContext: () => MockCallContextType;

jest.mock('@azure/communication-calling', () => {
  return {
    VideoStreamRenderer: jest.fn().mockImplementation(() => {
      return {
        createView: jest.fn().mockImplementation(() => {
          return {
            target: null
          };
        })
      };
    }),
    LocalVideoStream: jest.fn().mockImplementation(() => {
      return {};
    })
  };
});

jest.mock('../providers', () => {
  return {
    useCallContext: jest.fn().mockImplementation(
      (): MockCallContextType => {
        return mockCallContext();
      }
    )
  };
});

jest.mock('../providers/ErrorProvider', () => {
  return {
    useTriggerOnErrorCallback: jest.fn()
  };
});

const videoDeviceInfoStub: VideoDeviceInfo = {
  id: '1',
  name: 'camera',
  deviceType: 'Unknown'
};

describe('useLocalVideoStreamRenderer tests', () => {
  beforeEach(() => {
    mockCallContext = (): MockCallContextType => {
      return {
        isLocalVideoRendererBusy: false,
        setLocalVideoRendererBusy: jest.fn()
      };
    };
  });

  test('undefined local video stream should never be available', () => {
    const { result } = renderHook(() => useLocalVideoStreamRenderer(undefined, undefined));
    expect(result.current.render).toBe(null);
    expect(result.current.isAvailable).toBe(false);
  });

  test('local video stream should be available', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useLocalVideoStreamRenderer(new LocalVideoStream(videoDeviceInfoStub), undefined)
    );
    expect(result.current.isAvailable).toBe(false);
    await waitForNextUpdate();
    expect(result.current.isAvailable).toBe(true);
  });
});
