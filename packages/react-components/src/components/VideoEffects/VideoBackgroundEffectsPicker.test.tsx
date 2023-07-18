// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { render } from '@testing-library/react';
import { _VideoBackgroundEffectsPicker } from './VideoBackgroundEffectsPicker';

const TEST_PICKER_OPTIONS = [
  {
    itemKey: 'ab1',
    url: '/backgrounds/abstract1.jpg',
    tooltipText: 'Custom Background'
  },
  {
    itemKey: 'ab2',
    url: '/backgrounds/abstract2.jpg',
    tooltipText: 'Custom Background'
  },
  {
    itemKey: 'ab3',
    url: '/backgrounds/abstract3.jpg',
    tooltipText: 'Custom Background'
  },
  {
    itemKey: 'ab4',
    url: '/backgrounds/room1.jpg',
    tooltipText: 'Custom Background'
  },
  {
    itemKey: 'ab5',
    url: '/backgrounds/room2.jpg',
    tooltipText: 'Custom Background'
  },
  {
    itemKey: 'ab6',
    url: '/backgrounds/room3.jpg',
    tooltipText: 'Custom Background'
  },
  {
    itemKey: 'ab7',
    url: '/backgrounds/room4.jpg',
    tooltipText: 'Custom Background'
  }
];

describe('Background Picker should have the correct number of tiles', () => {
  test('Background Picker should have 7 tiles when items are set to wrap', async () => {
    const { container } = render(<_VideoBackgroundEffectsPicker options={TEST_PICKER_OPTIONS} itemsPerRow="wrap" />);
    expect(container.querySelectorAll('[data-ui-id="video-effects-item"]').length).toBe(TEST_PICKER_OPTIONS.length);
  });

  test('Background Picker should have 7 tiles and 2 hidden tiles spanning 3 rows when items per row is set to 3', async () => {
    const { container } = render(<_VideoBackgroundEffectsPicker options={TEST_PICKER_OPTIONS} itemsPerRow={3} />);
    expect(container.querySelectorAll('[data-ui-id="video-effects-item"]').length).toBe(7);
    expect(container.querySelectorAll('[data-ui-id="video-effects-hidden-item"]').length).toBe(2);
    expect(container.querySelectorAll('[data-ui-id="video-effects-picker-row"]').length).toBe(3);
  });

  test('Background Picker should have 7 tiles and 1 hidden tile spanning 4 rows when items per row is set to 2', async () => {
    const { container } = render(<_VideoBackgroundEffectsPicker options={TEST_PICKER_OPTIONS} itemsPerRow={2} />);
    expect(container.querySelectorAll('[data-ui-id="video-effects-item"]').length).toBe(7);
    expect(container.querySelectorAll('[data-ui-id="video-effects-hidden-item"]').length).toBe(1);
    expect(container.querySelectorAll('[data-ui-id="video-effects-picker-row"]').length).toBe(4);
  });
});
