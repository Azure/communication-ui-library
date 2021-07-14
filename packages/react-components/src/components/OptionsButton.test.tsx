// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { OptionsButton, OptionsButtonProps } from './OptionsButton';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createTestLocale, mountWithLocalization } from './utils/testUtils';
import { setIconOptions } from '@fluentui/react';

// Suppress icon warnings for tests. Icons are fetched from CDN which we do not want to perform during tests.
// More information: https://github.com/microsoft/fluentui/wiki/Using-icons#test-scenarios
setIconOptions({
  disableWarnings: true
});

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

describe('OptionsButton strings should be localizable and overridable', () => {
  test('Should localize button label', async () => {
    const testLocale = createTestLocale({ optionsButton: { label: Math.random().toString() } });
    const component = mountWithLocalization(<OptionsButton showLabel={true} {...mockProps} />, testLocale);
    expect(component.text()).toBe(testLocale.strings.optionsButton.label);
  });

  test('Should override button label with `strings` prop', async () => {
    const testLocale = createTestLocale({ optionsButton: { label: Math.random().toString() } });
    const optionsButtonStrings = { label: Math.random().toString() };
    const component = mountWithLocalization(
      <OptionsButton showLabel={true} {...mockProps} strings={optionsButtonStrings} />,
      testLocale
    );
    expect(component.text()).toBe(optionsButtonStrings.label);
  });
});
