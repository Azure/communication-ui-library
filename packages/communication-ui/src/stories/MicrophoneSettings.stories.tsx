// © Microsoft Corporation. All rights reserved.

import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta } from '@storybook/react/types-6-0';
import { text, object, select } from '@storybook/addon-knobs';
import { Dropdown } from '@fluentui/react';
import { dropDownStyles } from '../components/styles/LocalSettings.styles';
import { getDocs } from './docs/MicrophoneSettingsDocs';
import { COMPONENT_FOLDER_PREFIX } from './constants';

export const MicrophoneSettings: () => JSX.Element = () => {
  const label = text('Label', 'Microphone');
  const defaultPlaceHolder = text('Default place holder', 'Select an option');
  const defaultOptions = [
    {
      key: 'Audio1',
      text: 'Headphones (Buy More Brand)'
    },
    {
      key: 'Audio2',
      text: 'Speakers (Stark Industries)'
    },
    {
      key: 'Audio3',
      text: 'Internal Microphone (Built-in)'
    }
  ];
  const options = object('Options', defaultOptions);

  const selectedKey = select(
    'Default selected key',
    options.map((i) => i.key),
    options[0]?.key ?? ''
  );

  return (
    <Dropdown
      placeholder={defaultPlaceHolder}
      label={label}
      styles={dropDownStyles}
      disabled={options.length === 0}
      options={options}
      defaultSelectedKey={selectedKey}
    />
  );
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/MicrophoneSettings`,
  component: Dropdown,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
