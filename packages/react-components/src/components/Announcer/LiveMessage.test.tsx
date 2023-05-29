// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { renderWithLiveAnnouncer } from '../utils/testUtils';
import LiveMessage from './LiveMessage';
import { screen } from '@testing-library/react';

const getLiveMessages = (ariaLive: 'assertive' | 'polite'): HTMLElement[] =>
  screen
    .queryAllByRole('log')
    .filter((message) => message.getAttribute('aria-live') === ariaLive && !!message.textContent);

describe('LiveMessage tests', () => {
  it('Live message should have assertive message and update appropriately', () => {
    const { rerender } = renderWithLiveAnnouncer(<LiveMessage message="Demo message" ariaLive="assertive" />);
    const liveMessages = getLiveMessages('assertive');
    expect(liveMessages.length).toBe(1);
    expect(liveMessages[0].textContent).toBe('Demo message');

    rerender(<LiveMessage message="Demo message 2" ariaLive="assertive" />);
    const updatedLiveMessages = getLiveMessages('assertive');
    expect(updatedLiveMessages.length).toBe(1);
    expect(updatedLiveMessages[0].textContent).toBe('Demo message 2');
  });

  it('Live message should have polite message and update appropriately', () => {
    const { rerender } = renderWithLiveAnnouncer(<LiveMessage message="Demo message" ariaLive="polite" />);
    const liveMessages = getLiveMessages('polite');
    expect(liveMessages.length).toBe(1);
    expect(liveMessages[0].textContent).toBe('Demo message');

    rerender(<LiveMessage message="Demo message 2" ariaLive="polite" />);
    const updatedLiveMessages = getLiveMessages('polite');
    expect(updatedLiveMessages.length).toBe(1);
    expect(updatedLiveMessages[0].textContent).toBe('Demo message 2');
  });

  it('Only the latest message is announced', () => {
    const FINAL_MESSAGE = 'Demo message FINAL';
    renderWithLiveAnnouncer(
      <>
        <LiveMessage message="Demo message 1" ariaLive="polite" />
        <LiveMessage message="Demo message 2" ariaLive="polite" />
        <LiveMessage message="Demo message 3" ariaLive="polite" />
        <LiveMessage message={FINAL_MESSAGE} ariaLive="polite" />
      </>
    );
    const liveMessages = getLiveMessages('polite');
    expect(liveMessages.length).toBe(1);
    expect(liveMessages[0].textContent).toBe(FINAL_MESSAGE);
  });
});
