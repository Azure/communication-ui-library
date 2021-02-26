// © Microsoft Corporation. All rights reserved.

import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta } from '@storybook/react/types-6-0';
import { text, object, select } from '@storybook/addon-knobs';
import { Dropdown, IDropdownStyles } from '@fluentui/react';
import { getDocs } from './docs/CameraSettingsDocs';
import { COMPONENT_FOLDER_PREFIX } from './constants';

const dropDownStyles: Partial<IDropdownStyles> = {
  caretDownWrapper: {
    height: '2.5rem',
    lineHeight: '2.5rem'
  },
  dropdownItem: {
    fontSize: '0.875rem',
    height: '2.5rem'
  },
  dropdown: {
    height: '2.5rem',
    maxWidth: '20.75rem',
    minWidth: '12.5rem'
  },
  title: {
    fontSize: '0.875rem',
    height: '2.5rem',
    lineHeight: '2.3125rem'
  },
  label: {
    fontWeight: 600,
    fontSize: '0.875rem'
  }
};

export const CameraSettings: () => JSX.Element = () => {
  const label = text('Label', 'Camera');
  const defaultPlaceHolder = text('Default place holder', 'Select an option');
  const defaultOptions = [
    {
      key: 'Camera1',
      text: 'Logitech WebCam'
    },
    {
      key: 'Camera2',
      text: 'OBS Virtual Camera'
    },
    {
      key: 'Camera3',
      text: 'FaceTime HD Camera'
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
  title: `${COMPONENT_FOLDER_PREFIX}/CameraSettings`,
  component: Dropdown,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
