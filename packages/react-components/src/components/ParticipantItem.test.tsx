// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ParticipantItem } from './ParticipantItem';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithLocalization, createTestLocale } from './utils/testUtils';

Enzyme.configure({ adapter: new Adapter() });

describe('ParticipantItem should work with localization', () => {
  test('Should use localized string', async () => {
    const testLocale = createTestLocale({ participantItem: { isMeText: Math.random().toString() } });
    const component = mountWithLocalization(<ParticipantItem displayName="Mark" me={true} />, testLocale);
    expect(component.text()).toContain(testLocale.strings.participantItem.isMeText);
  });
});
