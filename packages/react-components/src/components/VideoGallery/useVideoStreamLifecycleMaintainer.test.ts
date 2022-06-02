// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { renderHook } from '@testing-library/react-hooks';
import { CreateVideoStreamViewResult } from '../../types';
import {
  useVideoStreamLifecycleMaintainer,
  VideoStreamLifecycleMaintainerExtendableProps
} from './useVideoStreamLifecycleMaintainer';

const createNewStreamProps: VideoStreamLifecycleMaintainerExtendableProps = {
  isStreamAvailable: true,
  renderElementExists: false,
  isMirrored: false,
  scalingMode: 'Crop',
  isScreenSharingOn: false
};

describe('VideoStreamLifecycleMaintainer', () => {
  it('calls onCreateStreamView on an initial render pass and onDisposeStreamView when unmounting', async () => {
    const onCreateStreamViewTracker = jest.fn();
    const onUpdateScalingModeTracker = jest.fn();
    const onDisposeStreamViewTracker = jest.fn();

    const onCreateStreamView = (): Promise<CreateVideoStreamViewResult> => {
      onCreateStreamViewTracker();
      return Promise.resolve({
        view: {
          updateScalingMode: onUpdateScalingModeTracker
        }
      });
    };

    const hook = renderHook(() =>
      useVideoStreamLifecycleMaintainer({
        onCreateStreamView,
        onDisposeStreamView: onDisposeStreamViewTracker,
        ...createNewStreamProps
      })
    );
    expect(onCreateStreamViewTracker).toHaveBeenCalledTimes(1);

    await hook.waitForNextUpdate(); // wait for setStreamRendererResult to be set by a successful onCreateStreamView
    await new Promise(process.nextTick); // wait for the next tick to ensure any async work (like updateScalingMode) has executed
    hook.unmount();

    await new Promise(process.nextTick); // ensure no async calls in execution before performing expects
    expect(onDisposeStreamViewTracker).toHaveBeenCalledTimes(1);
    expect(onUpdateScalingModeTracker).toHaveBeenCalledTimes(0); // should never have been called
    expect(onCreateStreamViewTracker).toHaveBeenCalledTimes(1); // ensure this wasn't called any extra times on unmount
  });

  it('does not call any subsequent onCreateStreamView or updateScalingMode when render element becomes valid after a successful onCreateStreamView', async () => {
    const onCreateStreamViewTracker = jest.fn();
    const onUpdateScalingModeTracker = jest.fn();
    const onDisposeStreamViewTracker = jest.fn();

    const onCreateStreamView = (): Promise<CreateVideoStreamViewResult> => {
      onCreateStreamViewTracker();
      return Promise.resolve({
        view: {
          updateScalingMode: onUpdateScalingModeTracker
        }
      });
    };

    const createStreamWithTrackingProps = {
      onCreateStreamView,
      onDisposeStreamView: onDisposeStreamViewTracker,
      ...createNewStreamProps
    };
    const hook = renderHook((initialProps) => useVideoStreamLifecycleMaintainer(initialProps), {
      initialProps: createStreamWithTrackingProps
    });
    await hook.waitForNextUpdate(); // wait for setStreamRendererResult to be set by a successful onCreateStreamView

    // Rerender with renderElementExists: true because a successful onCreateStreamView should have rendered this
    hook.rerender({
      ...createStreamWithTrackingProps,
      renderElementExists: true
    });

    await new Promise(process.nextTick); // wait for the next tick to ensure any async work (like updateScalingMode) has executed before unmounting
    hook.unmount();

    await new Promise(process.nextTick); // ensure no async calls in execution before performing expects
    expect(onCreateStreamViewTracker).toHaveBeenCalledTimes(1);
    expect(onDisposeStreamViewTracker).toHaveBeenCalledTimes(2); // called in the global useEffect cleanup and in the createStreamView useEffect cleanup
    expect(onUpdateScalingModeTracker).toHaveBeenCalledTimes(0); // should never have been called
  });

  it('calls updateScalingMode when scaling mode changes and not a secondary onCreateStreamView', async () => {
    const onCreateStreamViewTracker = jest.fn();
    const onUpdateScalingModeTracker = jest.fn();
    const onDisposeStreamViewTracker = jest.fn();

    const onCreateStreamView = (): Promise<CreateVideoStreamViewResult> => {
      onCreateStreamViewTracker();
      return Promise.resolve({
        view: {
          updateScalingMode: onUpdateScalingModeTracker
        }
      });
    };

    const createStreamWithTrackingProps = {
      onCreateStreamView,
      onDisposeStreamView: onDisposeStreamViewTracker,
      ...createNewStreamProps
    };
    const hook = renderHook((initialProps) => useVideoStreamLifecycleMaintainer(initialProps), {
      initialProps: createStreamWithTrackingProps
    });
    await hook.waitForNextUpdate(); // wait for setStreamRendererResult to be set by a successful onCreateStreamView

    // rerender with updated scaling mode
    hook.rerender({
      ...createStreamWithTrackingProps,
      renderElementExists: true,
      scalingMode: 'Fit'
    });

    await new Promise(process.nextTick); // wait for the next tick to ensure any async work (like updateScalingMode) has executed before unmounting
    hook.unmount();

    await new Promise(process.nextTick); // ensure no async calls in execution before performing expects
    expect(onUpdateScalingModeTracker).toHaveBeenCalledTimes(1);
    expect(onCreateStreamViewTracker).toHaveBeenCalledTimes(1); // should only be called once when the view is first created
    expect(onDisposeStreamViewTracker).toHaveBeenCalledTimes(2); // called in the global useEffect cleanup and in the createStreamView useEffect cleanup
  });

  it.only('recreates the streamView when isMirrored changes', async () => {
    const onCreateStreamViewTracker = jest.fn();
    const onUpdateScalingModeTracker = jest.fn();
    const onDisposeStreamViewTracker = jest.fn();

    const onCreateStreamView = (): Promise<CreateVideoStreamViewResult> => {
      onCreateStreamViewTracker();
      return Promise.resolve({
        view: {
          updateScalingMode: onUpdateScalingModeTracker
        }
      });
    };

    const createStreamWithTrackingProps = {
      onCreateStreamView,
      onDisposeStreamView: onDisposeStreamViewTracker,
      ...createNewStreamProps
    };
    const hook = renderHook((initialProps) => useVideoStreamLifecycleMaintainer(initialProps), {
      initialProps: createStreamWithTrackingProps
    });

    // rerender with updated renderElementExists after onCreateStreamView would have been called
    await hook.waitForNextUpdate(); // wait for setStreamRendererResult to be set by a successful onCreateStreamView
    expect(onCreateStreamViewTracker).toHaveBeenCalledTimes(1);
    hook.rerender({
      ...createStreamWithTrackingProps,
      renderElementExists: true
    });
    await new Promise(process.nextTick);

    // Now update with the isMirrored property
    const newIsMirroredProp = !createNewStreamProps.isMirrored;
    hook.rerender({
      ...createStreamWithTrackingProps,
      renderElementExists: true,
      isMirrored: newIsMirroredProp
    });
    expect(onDisposeStreamViewTracker).toHaveBeenCalledTimes(1);
    hook.rerender({
      ...createStreamWithTrackingProps,
      renderElementExists: false,
      isMirrored: newIsMirroredProp
    });
    await new Promise(process.nextTick);
    expect(onDisposeStreamViewTracker).toHaveBeenCalledTimes(2);
    expect(onCreateStreamViewTracker).toHaveBeenCalledTimes(2);

    // Checks no unexpected tracking calls occurred
    expect(onUpdateScalingModeTracker).toHaveBeenCalledTimes(0);
  });
});
