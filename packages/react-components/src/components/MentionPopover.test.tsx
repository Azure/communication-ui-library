// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Mention, _MentionPopover } from './MentionPopover';

describe('Display mention popover in the correct position', () => {
  interface TargetRect {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
  }
  const mentionSuggestionListContainerId = 'mention-suggestion-list-container';
  const suggestions: Mention[] = [
    {
      id: '1',
      displayText: 'Test User1'
    },
    {
      id: 'everyone',
      displayText: 'Everyone'
    }
  ];

  const renderMentionPopoverComponent = (
    targetPositionOffset?: { top: number; left: number },
    location?: 'above' | 'below',
    targetRect?: TargetRect
  ): void => {
    const rect = targetRect || {
      x: 0,
      y: 0,
      width: 500,
      height: 200,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
    const ref = React.createRef<HTMLDivElement>();
    render(<div ref={ref} />);
    if (ref.current) {
      jest.spyOn(ref.current, 'getBoundingClientRect').mockImplementation(() => {
        return {
          ...rect,
          toJSON: () => {
            return {
              ...rect
            };
          }
        };
      });
    }
    render(
      <_MentionPopover
        targetPositionOffset={targetPositionOffset}
        location={location}
        suggestions={suggestions}
        target={ref}
        onSuggestionSelected={jest.fn()}
      />
    );
  };

  test('Show mention popover above the cursor when popover fits horizontally of the target', async () => {
    const targetPositionOffset = { top: 50, left: 100 };

    renderMentionPopoverComponent(targetPositionOffset, 'above');

    const mentionPopover = await screen.findByTestId(mentionSuggestionListContainerId);
    const element = document.getElementsByClassName(mentionPopover.className)[0];
    if (!element) {
      throw new Error('Mention Popover not found');
    }
    const style = window.getComputedStyle(element);
    expect(style.position).toBe('absolute');
    expect(style.maxWidth).toBe('200px');
    expect(style.left).toBe('100px');
    expect(style.right).toBe('');
    expect(style.top).toBe('');
    expect(style.bottom).toBe('154px');
  });

  test('Show mention popover above the cursor when popover does not fit horizontally of the target', async () => {
    const targetPositionOffset = { top: 50, left: 350 };

    renderMentionPopoverComponent(targetPositionOffset);

    const mentionPopover = await screen.findByTestId(mentionSuggestionListContainerId);
    const element = document.getElementsByClassName(mentionPopover.className)[0];
    if (!element) {
      throw new Error('Mention Popover not found');
    }
    const style = window.getComputedStyle(element);
    expect(style.position).toBe('absolute');
    expect(style.maxWidth).toBe('200px');
    expect(style.left).toBe('');
    expect(style.right).toBe('150px');
    expect(style.top).toBe('');
    expect(style.bottom).toBe('154px');
  });

  test('Show mention popover below the cursor when popover fits horizontally of the target', async () => {
    const targetPositionOffset = { top: 50, left: 100 };

    renderMentionPopoverComponent(targetPositionOffset, 'below');

    const mentionPopover = await screen.findByTestId(mentionSuggestionListContainerId);
    const element = document.getElementsByClassName(mentionPopover.className)[0];
    if (!element) {
      throw new Error('Mention Popover not found');
    }
    const style = window.getComputedStyle(element);
    expect(style.position).toBe('absolute');
    expect(style.maxWidth).toBe('200px');
    expect(style.left).toBe('100px');
    expect(style.right).toBe('');
    expect(style.top).toBe('254px');
    expect(style.bottom).toBe('');
  });

  test('Show mention popover below the cursor when popover does not fit horizontally of the target', async () => {
    const targetPositionOffset = { top: 50, left: 400 };

    renderMentionPopoverComponent(targetPositionOffset, 'below');

    const mentionPopover = await screen.findByTestId(mentionSuggestionListContainerId);
    const element = document.getElementsByClassName(mentionPopover.className)[0];
    if (!element) {
      throw new Error('Mention Popover not found');
    }
    const style = window.getComputedStyle(element);
    expect(style.position).toBe('absolute');
    expect(style.maxWidth).toBe('200px');
    expect(style.left).toBe('');
    expect(style.right).toBe('100px');
    expect(style.top).toBe('254px');
    expect(style.bottom).toBe('');
  });

  test('Show mention popover in the correct position when optional params are not passed in', async () => {
    renderMentionPopoverComponent();

    const mentionPopover = await screen.findByTestId(mentionSuggestionListContainerId);
    const element = document.getElementsByClassName(mentionPopover.className)[0];
    if (!element) {
      throw new Error('Mention Popover not found');
    }
    const style = window.getComputedStyle(element);
    expect(style.position).toBe('absolute');
    expect(style.maxWidth).toBe('200px');
    expect(style.left).toBe('0px');
    expect(style.right).toBe('');
    expect(style.top).toBe('');
    expect(style.bottom).toBe('204px');
  });
});
