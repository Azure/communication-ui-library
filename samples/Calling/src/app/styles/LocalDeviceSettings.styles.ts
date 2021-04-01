// © Microsoft Corporation. All rights reserved.

import { IDropdownStyles, IStackTokens, mergeStyles } from '@fluentui/react';
import { Theme } from '@fluentui/react-theme-provider';

export const mainStackTokens: IStackTokens = {
  childrenGap: '1.5rem'
};

export const micStackTokens: IStackTokens = {
  childrenGap: '0.75rem'
};

export const dropDownStyles = (theme: Theme): Partial<IDropdownStyles> => ({
  caretDownWrapper: {
    height: '2.5rem',
    lineHeight: '2.5rem'
  },
  dropdownItem: {
    fontSize: '0.875rem',
    height: '2.5rem'
  },
  dropdownItemSelected: {
    background: theme.palette.neutralQuaternaryAlt
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
});

export const localSettingsContainer = mergeStyles({
  width: '100%',
  maxWidth: '18.75rem',
  minWidth: '12.5rem',
  maxHeight: '14.125rem',
  marginTop: '2.125rem'
});
