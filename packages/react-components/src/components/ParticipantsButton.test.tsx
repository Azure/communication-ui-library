// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ParticipantsButton } from './ParticipantsButton';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createTestLocale, mountWithLocalization } from './utils/testUtils';

Enzyme.configure({ adapter: new Adapter() });

describe('ParticipantsButton strings should be localizable and overridable', () => {
  test('Should localize button label', async () => {
    const testLocale = createTestLocale({ participantsButton: { label: Math.random().toString() } });
    const component = mountWithLocalization(
      <ParticipantsButton showLabel={true} participantListProps={{ participants: [] }} />,
      testLocale
    );
    expect(component.text()).toBe(testLocale.strings.participantsButton.label);
  });

  test('Should override button label with `strings` prop', async () => {
    const testLocale = createTestLocale({ participantsButton: { label: Math.random().toString() } });
    const participantButtonStrings = { label: Math.random().toString() };
    const component = mountWithLocalization(
      <ParticipantsButton
        showLabel={true}
        participantListProps={{ participants: [] }}
        strings={participantButtonStrings}
      />,
      testLocale
    );
    expect(component.text()).toBe(participantButtonStrings.label);
  });
});
