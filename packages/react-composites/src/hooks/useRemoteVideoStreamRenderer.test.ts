// © Microsoft Corporation. All rights reserved.
import { renderHook } from '@testing-library/react-hooks';
import useRemoteVideoStreamRenderer from './useRemoteVideoStreamRenderer';
import { PropertyChangedEvent, RemoteVideoStream } from '@azure/communication-calling';

jest.mock('@azure/communication-calling', () => {
  // Works and lets you check for constructor calls:
  return {
    VideoStreamRenderer: jest.fn().mockImplementation(() => {
      return {
        createView: jest.fn().mockImplementation(() => {
          return {
            target: null
          };
        })
      };
    })
  };
});

jest.mock('../providers/ErrorProvider', () => {
  return {
    useTriggerOnErrorCallback: jest.fn()
  };
});

const getRemoteVideoStreamStub = (isAvailable: boolean): RemoteVideoStream => {
  return {
    id: 1,
    mediaStreamType: 'Video',
    isAvailable: isAvailable,
    on: () => {
      return;
    },
    off: () => {
      return;
    }
  };
};

describe('useRemoteVideoStreamRenderer tests', () => {
  test('undefined remote video stream should never be available', () => {
    const { result } = renderHook(() => useRemoteVideoStreamRenderer(undefined));
    expect(result.current.render).toBe(null);
    expect(result.current.isAvailable).toBe(false);
  });

  test('if available should have a render', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useRemoteVideoStreamRenderer(getRemoteVideoStreamStub(true))
    );
    expect(result.current.isAvailable).toBe(false);
    await waitForNextUpdate();
    expect(result.current.isAvailable).toBe(true);
  });

  test('if not available should not have a render', async () => {
    const { result } = renderHook(() => useRemoteVideoStreamRenderer(getRemoteVideoStreamStub(false)));
    expect(result.current.render).toBe(null);
    expect(result.current.isAvailable).toBe(false);
  });

  test('if availabilityChanged called and stream is not available, isAvailable should be set to false', async () => {
    const remoteVideoStreamEvents: {
      [name: string]: PropertyChangedEvent;
    } = {};
    const remoteVideoStream = getRemoteVideoStreamStub(false);
    remoteVideoStream.on = (event: string, listener: PropertyChangedEvent) => {
      remoteVideoStreamEvents[event] = listener;
    };
    const { result } = renderHook(() => useRemoteVideoStreamRenderer(remoteVideoStream));

    expect(remoteVideoStreamEvents.isAvailableChanged).toBeDefined();

    remoteVideoStreamEvents.isAvailableChanged();

    expect(result.current.isAvailable).toBe(false);
  });
});
