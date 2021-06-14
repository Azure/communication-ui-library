// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IDropdownStyles, IStackTokens, Theme, mergeStyles } from '@fluentui/react';

export const mainStackTokens: IStackTokens = {
  childrenGap: '1rem'
};

export const micStackTokens: IStackTokens = {
  childrenGap: '1rem'
};

export const dropDownStyles = (theme: Theme): Partial<IDropdownStyles> => ({
  caretDownWrapper: {
    height: '2.5rem',
    lineHeight: '2.5rem'
  },
  dropdownItem: {
    fontSize: '0.875rem',
    height: '2.5rem',
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
  },
  errorMessage: {
    fontSize: '0.875rem'
  }
});

export const localSettingsContainer = mergeStyles({
  width: '100%',
  maxWidth: '18.75rem',
  minWidth: '12.5rem',
  maxHeight: '19.125rem',
  marginTop: '.313rem'
});

export const dropDownTitleIconStyles = mergeStyles({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: '0',
  maxWidth: '100%',
  overflowWrap: 'break-word',
  margin: '.063rem'
});

export const optionIconStyles = mergeStyles({
  marginRight: '8px',
  verticalAlign: 'text-top'
});
