// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { OptionsButton, OptionsButtonProps } from './OptionsButton';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createTestLocale, mountWithLocalization } from './utils/testUtils';

Enzyme.configure({ adapter: new Adapter() });

const mockProps: OptionsButtonProps = {
  cameras: [{ id: 'camera1', name: 'testCamera' }],
  selectedCamera: { id: 'camera1', name: 'testCamera' },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSelectCamera: async () => {},
  microphones: [{ id: 'microphone1', name: 'testMicrophone' }],
  selectedMicrophone: { id: 'microphone1', name: 'testMicrophone' },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSelectMicrophone: async () => {},
  speakers: [{ id: 'speaker1', name: 'testMicrophone' }],
  selectedSpeaker: { id: 'microphone1', name: 'testMicrophone' },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSelectSpeaker: async () => {}
};

describe('OptionsButton should work with localization', () => {
  test('Should localize button label', async () => {
    const optionsButtonStrings = { label: Math.random().toString() };
    const testLocale = createTestLocale({ optionsButton: optionsButtonStrings });
    const component = mountWithLocalization(
      <OptionsButton strings={optionsButtonStrings} showLabel={true} {...mockProps} />,
      testLocale
    );
    expect(component.text()).toBe(optionsButtonStrings.label);
  });
});
