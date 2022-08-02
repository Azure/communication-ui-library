// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ParticipantsButton } from './ParticipantsButton';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createTestLocale, mountWithLocalization, mountWithPermissions } from './utils/testUtils';
import { setIconOptions } from '@fluentui/react';
import { _getPermissions } from '../permissions';
import { ControlBarButton } from './ControlBarButton';

// Suppress icon warnings for tests. Icons are fetched from CDN which we do not want to perform during tests.
// More information: https://github.com/microsoft/fluentui/wiki/Using-icons#test-scenarios
setIconOptions({
  disableWarnings: true
});

Enzyme.configure({ adapter: new Adapter() });

describe('ParticipantsButton strings should be localizable and overridable', () => {
  test('Should localize button label', async () => {
    const testLocale = createTestLocale({ participantsButton: { label: Math.random().toString() } });
    const component = mountWithLocalization(<ParticipantsButton showLabel={true} participants={[]} />, testLocale);
    expect(component.text()).toBe(testLocale.strings.participantsButton.label);
  });

  test('Should override button label with `strings` prop', async () => {
    const testLocale = createTestLocale({ participantsButton: { label: Math.random().toString() } });
    const participantButtonStrings = { label: Math.random().toString() };
    const component = mountWithLocalization(
      <ParticipantsButton showLabel={true} participants={[]} strings={participantButtonStrings} />,
      testLocale
    );
    expect(component.text()).toBe(participantButtonStrings.label);
  });
});

describe('ParticipantListButton tests for different roles', () => {
  test('ParticipantListButton should be enabled for Presenter role', async () => {
    const wrapper = mountWithPermissions(
      <ParticipantsButton participants={[{ displayName: 'User1', userId: '1', isRemovable: true }]} />,
      _getPermissions('Presenter')
    );
    const participantButton = wrapper.find(ControlBarButton).first();
    expect(participantButton.prop('disabled')).toBe(false);
  });
  test('ParticipantListButton should be enabled for Attendee role', async () => {
    const wrapper = mountWithPermissions(
      <ParticipantsButton participants={[{ displayName: 'User1', userId: '1', isRemovable: true }]} />,
      _getPermissions('Attendee')
    );
    const participantButton = wrapper.find(ControlBarButton).first();
    expect(participantButton.prop('disabled')).toBe(false);
  });
  test('ParticipantListButton should be disabled for Consumer role', async () => {
    const wrapper = mountWithPermissions(
      <ParticipantsButton participants={[{ displayName: 'User1', userId: '1', isRemovable: true }]} />,
      _getPermissions('Consumer')
    );
    const participantButton = wrapper.find(ControlBarButton).first();
    expect(participantButton.prop('disabled')).toBe(true);
  });
});
