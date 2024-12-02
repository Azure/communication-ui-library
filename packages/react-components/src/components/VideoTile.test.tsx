// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { VideoTile } from './VideoTile';
import { act, fireEvent, render } from '@testing-library/react';

import { screen } from '@testing-library/react';

import { VideoTileProps } from './VideoTile';

describe('VideoTile', () => {
  test('onLongTouch should trigger callback', async () => {
    const mockCallback = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const videoTileProps = { onLongTouch: mockCallback } as any;
    const { container } = render(<VideoTile {...videoTileProps} />);
    const videoTile = container.querySelector('[data-ui-id="video-tile"]') as HTMLElement;
    expect(videoTile).toBeTruthy();

    jest.useFakeTimers();
    await act(async () => {
      fireEvent.touchStart(videoTile);
      jest.runAllTimers();
      fireEvent.touchEnd(videoTile);
    });

    expect(mockCallback).toBeCalledTimes(1);
  });

  test('VideoTile does not show more button when contextualMenu is undefined', async () => {
    const { rerender, container } = render(<VideoTile />);

    const noContextMenuVideoTileProps = {
      displayName: 'John Doe',
      contextualMenu: undefined
    } as Partial<VideoTileProps>;
    rerender(<VideoTile {...noContextMenuVideoTileProps} />);
    act(() => {
      fireEvent.focus(container);
    });
    expect(screen.queryAllByRole('button').length).toBe(0);
  });
});
