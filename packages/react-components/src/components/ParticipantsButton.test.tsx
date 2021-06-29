// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ParticipantsButton } from './ParticipantsButton';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createTestLocale, mountWithLocalization } from './utils/testUtils';

Enzyme.configure({ adapter: new Adapter() });

describe('ParticipantsButton should work with localization', () => {
  test('Should localize button label', async () => {
    const participantsButtonStrings = { label: Math.random().toString() };
    const testLocale = createTestLocale({ participantsButton: participantsButtonStrings });
    const component = mountWithLocalization(
      <ParticipantsButton
        strings={participantsButtonStrings}
        showLabel={true}
        participantListProps={{ participants: [] }}
      />,
      testLocale
    );
    expect(component.text()).toBe(participantsButtonStrings.label);
  });
});
