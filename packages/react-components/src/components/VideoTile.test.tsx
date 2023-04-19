// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { initializeIcons, registerIcons } from '@fluentui/react';
import React from 'react';
import { VideoTile } from './VideoTile';
import { act, fireEvent, render } from '@testing-library/react';
/* @conditional-compile-remove(pinned-participants) */
import { screen } from '@testing-library/react';
/* @conditional-compile-remove(pinned-participants) */
import { VideoTileProps } from './VideoTile';

describe('VideoTile', () => {
  beforeAll(() => {
    initializeIcons();
    registerIcons({
      icons: {
        videotilemoreoptions: <></>
      }
    });
  });

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

    /* @conditional-compile-remove(pinned-participants) */
    expect(mockCallback).toBeCalledTimes(1);
  });

  /* @conditional-compile-remove(pinned-participants) */
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
