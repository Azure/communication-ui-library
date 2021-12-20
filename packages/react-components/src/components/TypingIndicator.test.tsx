// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { TypingIndicator } from './TypingIndicator';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithLocalization, createTestLocale } from './utils/testUtils';

Enzyme.configure({ adapter: new Adapter() });

const testLocale = createTestLocale({
  typingIndicator: {
    singleUser: '{user} is typing',
    multipleUsers: '{users} are typing',
    multipleUsersAbbreviateOne: '{users} and 1 other are typing',
    multipleUsersAbbreviateMany: '{users} and {numOthers} others are typing'
  }
});

describe('TypingIndicator should format string correctly', () => {
  test('One user case', async () => {
    const component = mountWithLocalization(
      <TypingIndicator typingUsers={[{ userId: 'user1', displayName: 'Claire' }]} />,
      testLocale
    );

    const expectedString = 'Claire is typing';
    expect(component.text()).toBe(expectedString);
    expect(component.html().includes(`aria-label="${expectedString}"`)).toBe(true);
  });

  test('Two users case', async () => {
    const component = mountWithLocalization(
      <TypingIndicator
        typingUsers={[
          { userId: 'user1', displayName: 'Claire' },
          { userId: 'user2', displayName: 'Christopher' }
        ]}
      />,
      testLocale
    );

    const expectedString = 'Claire, Christopher are typing';
    expect(component.text()).toBe(expectedString);
    expect(component.html().includes(`aria-label="${expectedString}"`)).toBe(true);
  });

  test('Two users with abbreviation case', async () => {
    const component = mountWithLocalization(
      <TypingIndicator
        typingUsers={[
          { userId: 'user1', displayName: 'Claire Romanov' },
          { userId: 'user2', displayName: 'Christopher Rutherford' }
        ]}
      />,
      testLocale
    );

    const expectedString = 'Claire Romanov and 1 other are typing';
    expect(component.text()).toBe(expectedString);
    expect(component.html().includes(`aria-label="${expectedString}"`)).toBe(true);
  });

  test('Three users with abbreviation case', async () => {
    const component = mountWithLocalization(
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
    expect(component.text()).toBe(expectedString);
    expect(component.html().includes(`aria-label="${expectedString}"`)).toBe(true);
  });
});
