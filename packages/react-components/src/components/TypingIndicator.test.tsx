// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { TypingIndicator } from './TypingIndicator';
import { renderWithLocalization, createTestLocale } from './utils/testUtils';
import { screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

const testLocale = createTestLocale({
  typingIndicator: {
    singleUser: '{user} is typing',
    multipleUsers: '{users} are typing',
    multipleUsersAbbreviateOne: '{users} and 1 other are typing',
    multipleUsersAbbreviateMany: '{users} and {numOthers} others are typing'
  }
});

describe.only('Component is shown correctly', () => {
  test('One user case', async () => {
    const tree = renderer
      .create(<TypingIndicator typingUsers={[{ userId: 'user1', displayName: 'Claire' }]} />)
      .toJSON();
    expect(tree).toMatchInlineSnapshot(`
      <div
        className="ms-Stack css-111"
      >
        <div
          aria-label="Claire is typing"
          className="css-110"
          data-ui-id="typing-indicator"
          role="status"
        >
          <span
            className="css-112"
          >
            <span
              className="css-112"
            >
              Claire
            </span>
          </span>
          <span
            className="css-112"
          >
             is typing
          </span>
        </div>
      </div>
    `);
  });
});

describe('TypingIndicator should format string correctly', () => {
  test('One user case', async () => {
    renderWithLocalization(<TypingIndicator typingUsers={[{ userId: 'user1', displayName: 'Claire' }]} />, testLocale);

    const expectedString = 'Claire is typing';
    expect(screen.getByRole('status').textContent).toBe(expectedString);
    expect(screen.getByRole('status').getAttribute('aria-label')).toBe(expectedString);
  });

  test('Two users case', async () => {
    renderWithLocalization(
      <TypingIndicator
        typingUsers={[
          { userId: 'user1', displayName: 'Claire' },
          { userId: 'user2', displayName: 'Christopher' }
        ]}
      />,
      testLocale
    );

    const expectedString = 'Claire, Christopher are typing';
    expect(screen.getByRole('status').textContent).toBe(expectedString);
    expect(screen.getByRole('status').getAttribute('aria-label')).toBe(expectedString);
  });

  test('Two users with abbreviation case', async () => {
    renderWithLocalization(
      <TypingIndicator
        typingUsers={[
          { userId: 'user1', displayName: 'Claire Romanov' },
          { userId: 'user2', displayName: 'Christopher Rutherford' }
        ]}
      />,
      testLocale
    );

    const expectedString = 'Claire Romanov and 1 other are typing';
    expect(screen.getByRole('status').textContent).toBe(expectedString);
    expect(screen.getByRole('status').getAttribute('aria-label')).toBe(expectedString);
  });

  test('Three users with abbreviation case', async () => {
    renderWithLocalization(
      <TypingIndicator
        typingUsers={[
          { userId: 'user1', displayName: 'Claire Romanov' },
          { userId: 'user2', displayName: 'Christopher Rutherford' },
          { userId: 'user3', displayName: 'Jill Vernblom' }
        ]}
      />,
      testLocale
    );

    const expectedString = 'Claire Romanov and 2 others are typing';
    expect(screen.getByRole('status').textContent).toBe(expectedString);
    expect(screen.getByRole('status').getAttribute('aria-label')).toBe(expectedString);
  });
});
