// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { render } from '@testing-library/react';
import { _Announcer } from './Announcer';

describe('Announcer', () => {
  test('renders string to be announced', () => {
    const testString = 'test';
    const testAriaLive = 'polite';
    const { container } = render(<_Announcer announcementString={testString} ariaLive={testAriaLive} />);
    expect(container.querySelector(`[aria-label=${testString}]`)).toBeTruthy();
    expect(container.querySelector(`[aria-live=${testAriaLive}]`)).toBeTruthy();
  });
});
